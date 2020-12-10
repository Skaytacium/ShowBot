import discord from "discord.js";
import https from "https";
import http from "http";
import fs from "fs";

const client: discord.Client = new discord.Client();
const dataPath: string = "data/";
const baseURL: string = "https://my.showbie.com/core";
var data: any = {};

function updateFiles(include?: string[]): void {
    console.log(`Updating files: ${include == undefined ? `all` : include}`);
    fs.readdirSync(dataPath).forEach((file) => {
        const name: string = file.split(".")[0];
        if (include != undefined && include?.includes(name)) {
            data[name] = JSON.parse(fs.readFileSync(dataPath + file).toString());
            console.log(`Imported: ${file}`);
        } else if (include == undefined) {
            data[name] = JSON.parse(fs.readFileSync(dataPath + file).toString());
            console.log(`Imported: ${file}`);
        }
    });
}
updateFiles();

client.login(data.discord.token)
    .then(() => console.log("Started"))
    .catch((err) => {
        if (err) console.error(err);
        else console.log("Couldnt Login");
    });

function tob64(string: string): string {
    console.log(`Converting ${string} to base64`)
    return Buffer.from(string).toString('base64');
}

function makefp(length: number): string {
    console.log(`Made a random fingerprint of length ${length}`)
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
    console.log(`Making token headers for user ${user} in ${school}`);
    const tempReq: any = data.main.req;

    tempReq["x-showbie-clientapikey"] = data.main.schools[school];
    tempReq["Authorization"] = `Basic ${tob64(`${user}:${pass}`)}`;
    tempReq["Content-Type"] = "application/json";

    return tempReq;
}

function makeAuthHeads(token: string, fp: string, school: string): object {
    console.log(`Making auth headers for user in ${school}`);
    const tempReq: any = data.main.req;

    tempReq["x-showbie-clientapikey"] = data.main.schools[school];
    tempReq["Authorization"] = `sbe token=${tob64(token)},fp=${tob64(fp)}`;
    tempReq["Content-Type"] = "application/json";

    return tempReq;
}

function createSessionEntry(headers: object, userID: string): void {
    data.sessions[userID] = headers;
    fs.writeFileSync(dataPath + "sessions.json", JSON.stringify(data.sessions));
    updateFiles(["sessions"]);
    console.log(`Created session for userID ${userID}`);
}

function login(userID: string, orig: string[]): Promise<string> {
    return new Promise(resolve => {
        const tempFP = makefp(10);
        const options: object = {
            "method": "POST",
            "headers": makeTokenHeads(orig[2], orig[3], orig[4])
        };
    
        const req = https.request(baseURL + "/sessions", options, res => {
            console.log(`Logging in for user ${userID}`);
    
            res.on('data', chunk => {
                chunk = JSON.parse(chunk.toString());
                switch (('' + res.statusCode)[0]) {
                    case "4":
                        chunk.errors.forEach((err: any, index: number) => {
                            resolve(`**Error!**\n*Code:* ${err.status}\n*Definition:* ${//@ts-ignore
                                http.STATUS_CODES[err.status]}.\n*Meaning:* ${err.title}`);
                        });
                        break;
    
                    case "2":
                        data.accounts[userID] = {};
                        data.accounts[userID].user = orig[2];
                        data.accounts[userID].pass = orig[3];
                        data.accounts[userID].school =
                            orig[4] == undefined ? "BHIS" : orig[4];
    
                        fs.writeFileSync(dataPath + "accounts.json", JSON.stringify(data.accounts));
    
                        createSessionEntry(
                            makeAuthHeads(chunk.session.token, tempFP, data.accounts[userID].school),
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

for (const account in data.accounts) {
    if (account == "fp") continue;
    login(account, ["", "",
        data.accounts[account].user,
        data.accounts[account].pass,
        data.accounts[account].school])
        .then(console.log);
}

client.on("message", (message) => {
    const orig: string[] = message.content.split(" ");
    const command: string[] = message.content.toLowerCase().split(" ");

    if (command[0] == "sb") {
        switch (command[1]) {
            case "login":
                if (data.accounts[message.author.id]) message.channel.send("You have already logged in!\n\
To relogin, use `sb creds`.")
                else {
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
                }
                break;

            case "creds":
                message.channel.send("Logging in...");
                login(message.author.id, orig).then(val => {
                    message.channel.send(val);
                    console.log(val);
                });
                break;

            case "assignments":
                if (!data.sessions[message.author.id]) {
                    message.channel.send("Log in first! `sb login`");
                    break;
                }
                const assignmentOptions: object = data.sessions[message.author.id]

                break;
        }
    }
});
