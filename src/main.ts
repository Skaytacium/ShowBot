import { Client } from "discord.js";
import { request } from "https";
import { STATUS_CODES } from "http";
import {
    readdirSync,
    readFileSync,
    writeFileSync,
    createWriteStream,
    rmSync
} from "fs";
import { createGunzip } from "zlib";
import { pipeline } from "stream";
import { createInterface } from "readline";

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "sb> ",
    tabSize: 4
});
const client: Client = new Client();
const dataPath: string = "data/";
const baseURL: string = "https://my.showbie.com/core";
var data: any = {};

writeFileSync(dataPath + "sessions.json", "{}");
updateFiles();

function updateFiles(include?: string[], removeTemp: boolean = true): void {
    console.log(`INFO: Updating files: ${include == undefined ? `all` : include}`);

    readdirSync(dataPath).forEach((file) => {
        const name: string[] = file.split(".");

        if (include != undefined && include.includes(name[0]) && name[1] == "json") {
            data[name[0]] = JSON.parse(readFileSync(dataPath + file).toString());
            console.log(`SUCCESS: Imported: ${file}`);
        }
        else if (include == undefined && name[1] == "json") {
            data[name[0]] = JSON.parse(readFileSync(dataPath + file).toString());
            console.log(`SUCCESS: Imported: ${file}`);
        } 
        else if (removeTemp && name[1] != "json") {
            rmSync(dataPath + file);
            console.log(`SUCCESS: Removed file ${file}`);
        }
    });
}

function tob64(string: string): string {
    console.log(`INFO: Converting ${string} to base64`);
    return Buffer.from(string).toString('base64');
}

function fromb64(string: string): string {
    console.log(`INFO: Converting ${string} from base64`);
    return Buffer.from(string, 'base64').toString('ascii');
}

function randomValue(array: any): string {
    console.log(`INFO: Returning random value from ${array}`);
    return array[array.length * Math.random() << 0];
}

function makefp(length: number): string {
    console.log(`INFO: Made a random fingerprint of length ${length}`);

    let result: string = '';
    let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength: number = characters.length;

    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));

    return result;
}

function makeTokenHeads(
    user: string,
    pass: string,
    school: string = "BHIS"): object {
    console.log(`INFO: Making token headers for user ${user} in ${school}`);
    const tempReq: any = data.main.req;

    tempReq["x-showbie-clientapikey"] = data.main.schools[school];
    tempReq["Authorization"] = `Basic ${tob64(`${user}:${pass}`)}`;
    tempReq["Content-Type"] = "application/json";

    return tempReq;
}

function makeAuthHeads(token: string, fp: string, school: string): object {
    console.log(`INFO: Making auth headers for user in ${school}`);
    const tempReq: any = data.main.req;

    tempReq["x-showbie-clientapikey"] = data.main.schools[school];
    tempReq["Authorization"] = `sbe token=${tob64(token)},fp=${tob64(fp)}`;
    tempReq["Content-Type"] = "application/json";

    return tempReq;
}

function createSessionEntry(headers: object, userID: string): void {
    data.sessions[userID] = headers;
    data.sessions[userID]["Content-Type"] = undefined;

    writeFileSync(dataPath + "sessions.json", JSON.stringify(data.sessions));
    updateFiles(["sessions"]);

    console.log(`SUCCESS: Created session for userID ${userID}`);
}

function getFromAPI(
    userID: string,
    filename: string,
    method: string = "GET"): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = request(
            baseURL + "/assignments",
            {
                "method": method,
                "headers": data.sessions[userID]
            }, res => {
                pipeline(
                    res,
                    createGunzip(),
                    createWriteStream(dataPath + `${filename}.${userID}.json`),
                    err => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            console.log(`SUCCESS: Wrote to file ${filename}.${userID}.json`);
                            resolve(dataPath + `${filename}.${userID}.json`);
                        }
                    }
                );
            });
        req.end();
    });
}

function logout(userID: string): Promise<string> {
    updateFiles(["sessions"]);

    return new Promise(resolve => {
        if (data.sessions[userID]) {
            const sessionToken: string = fromb64(
                (data.sessions[userID]["Authorization"])
                    .split(",")[0].slice(10));

            request(baseURL + "/sessions/" + sessionToken, {
                "method": "DELETE",
                "headers": data.sessions[userID]
            }, res => {
                switch (('' + res.statusCode)[0]) {
                    case "4":
                        resolve(`**Error!**\n*Code:* ${res.statusCode}\n*Definition:* ${//@ts-ignore
                            STATUS_CODES[res.statusCode]}.`);

                    case "2":
                        delete data.sessions[userID];
                        writeFileSync(dataPath + "sessions.json", JSON.stringify(data.sessions));
                        updateFiles(["sessions"]);
                        resolve("Logged out succesfully!");

                    default: resolve("Could not log out, try again later!");
                }
            }).end();
        }
        else resolve("No login found! Login first to logout.");
    });
}

function login(userID: string, orig: string[]): Promise<string> {
    return new Promise(resolve => {
        const tempFP = makefp(20);
        const options: object = {
            "method": "POST",
            "headers": makeTokenHeads(orig[2], orig[3], orig[4])
        };

        const req = request(baseURL + "/sessions", options, res => {
            console.log(`INFO: Logging in for user ${userID}`);

            let reqData: any = '';
            res.on('data', chunk => reqData += chunk.toString());

            res.on('close', () => {
                reqData = JSON.parse(reqData);
                switch (('' + res.statusCode)[0]) {
                    case "4":
                        reqData.errors.forEach((err: any) => {
                            resolve(`**Error!**\n*Code:* ${err.status}\n*Definition:* ${STATUS_CODES[err.status]}.\n*Meaning:* ${err.title}`);
                        });
                        break;

                    case "2":
                        data.accounts[userID] = {};
                        data.accounts[userID].user = orig[2];
                        data.accounts[userID].pass = orig[3];
                        data.accounts[userID].school =
                            orig[4] == undefined ? "BHIS" : orig[4];

                        writeFileSync(dataPath + "accounts.json", JSON.stringify(data.accounts));

                        createSessionEntry(
                            makeAuthHeads(reqData.session.token, tempFP, data.accounts[userID].school),
                            userID);
                        resolve("Created session!");

                    default: resolve("Could not log in, try again later!");
                }
            });
        });
        req.write(JSON.stringify({
            "session": {
                "fingerprint": tempFP
            }
        }));
        req.end();
    });
}

function initRegistered(excludes?: string[]): void {
    for (const account in data.accounts) {
        if (account == "fp") continue;
        if (excludes?.includes(account)) continue;
        login(account, ["", "",
            data.accounts[account].user,
            data.accounts[account].pass,
            data.accounts[account].school])
            .then((val: string) => console.log(`INFO: ${val}`));
    }
}

client.login(data.discord.token)
    .then(() => console.log("INFO: Started!"))
    .catch((err) => {
        if (err) console.error(err);
        else console.log("ERROR: Bot couldnt login!");
    });

rl.question("Initialize accounts?", (ans: string) => {
    if (ans.match(/y/i) || ans.match(/yes/i)) initRegistered();
    else if (ans.match(/n/i) || ans.match(/No/i)) return;
    else console.log("ERROR: Invalid choice!");
});

rl.on('line', (line: string) => {
    // const orig: string[] = line.split(" ");
    const command: string[] = line.toLowerCase().split(" ");
    switch (command[0]) {
        case "exit":
            console.log("INFO: Exiting....");
            for (const session in data.sessions) logout(session);
            console.log("Bye!");
            process.exit(0);
        
        default: console.log("ERROR: Command not found!");
    }
});

client.on("message", (message) => {
    const orig: string[] = message.content.split(" ");
    const command: string[] = message.content.toLowerCase().split(" ");

    if (command[0] == "sb") {
        switch (command[1]) {
            case "login":
                if (data.accounts[message.author.id]) {
                    message.channel.send("You have already logged in! To relogin, use:\n\
 `sb creds <username here> <password here> <optional school name(no spaces, default is BHIS)>`.");
                    break;
                }
                message.channel.send("Check your DMs!");
                message.author.createDM().then((chan) => {
                    chan.send(
                        "Welcome to ShowBot!\n\
Type in the following command using your Showbie credentials:\n\
 `sb creds <username here> <password here> <optional school name(no spaces, default is BHIS)>`\n\
ShowBot **does not use your account for any other purposes.**\
 Due to the nature of open source software, it is recommended\
 that you **take out any private information from your Showbie account** before continuing.\
 ShowBot doesn't practice or encourage theft of credentials.\
 While you can use `sb creds` on a public server, it is **not recommended** due to obvious reasons."
                    );
                });
                break;

            case "creds":
                if (orig[3] == undefined) {
                    message.channel.send("Enter your details!\n\
`sb creds <username here> <password here> <optional school name(no spaces, default is BHIS)>`"); break;
                }
                message.channel.send("Logging in...");

                login(message.author.id, orig).then(val => {
                    message.channel.send(val);
                    console.log(`INFO: ${val}`);
                });
                break;

            case "kill":
                if (command[2] == "contribute") {
                    message.channel.send("5 ")
                }
                else if (data.kills[command[2]])
                    message.channel.send(randomValue(data.kills[command[2]]));

                else message.channel.send("Who?");
                break;

            case "assignments":
                if (!data.sessions[message.author.id]) {
                    message.channel.send("Log in first! `sb login`"); break;
                }
                getFromAPI(message.author.id, "assignments").then(console.log, console.log)
                break;

            case "logout":
                message.channel.send("Logging out...");
                logout(message.author.id).then(val => message.channel.send(val));
                break;
        }
    }
});