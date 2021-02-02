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


const client: Client = new Client();
client.login(data.discord.token)
    .then(() => console.log("INFO: Started!"))
    .catch((err) => {
        if (err) console.error(err);
        else console.log("ERROR: Bot couldnt login!");
    });

const dataPath: string = "data/";
const baseURL: string = "https://my.showbie.com/core";
var data: any = {};

updateFiles();

client.on("message", (message) => {
    const orig: string[] = message.content.split(" ");
    const command: string[] = message.content.toLowerCase().split(" ");

    if (command[0] == "sb") {
        switch (command[1]) {
            case "login":
                if (data.accounts[message.author.id]) {
                    if (data.sessions[message.author.id])
                        message.channel.send("You have already logged in! To relogin, use:\n\
 `sb creds <username here> <password here> <optional school name(no spaces, default is BHIS)>`.");
                    else login(
                        message.author.id,
                        [data.accounts[message.author.id].user,
                        data.accounts[message.author.id].pass,
                        data.accounts[message.author.id].school]
                    );
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
                updateFiles(["kills"]);

                if (command[2] == "contribute") {
                    message.channel.send("5 ")
                }
                else if (data.kills[command[2]])
                    message.channel.send(randarrval(data.kills[command[2]]));

                else message.channel.send("Who?");
                break;

            case "ass":
                if (!data.sessions[message.author.id]) {
                    message.channel.send("Log in first! `sb login`"); break;
                }
                message.channel.startTyping();
                let msg: string = '';

                getFromAPI(message.author.id, "assignments").then((path: string) => {
                    const info: any = JSON.parse(readFileSync(path).toString());

                    info.assignments.forEach((assignment: any) => {
                        let result: string | undefined;

                        if (assignment.dueDate)
                            result = calctime(assignment.dueDate, info.meta.serverTime);
                        else result = "Due __without a time limit__";

                        if (assignment.meta.attachmentCount == 0
                            && assignment["studentAccessLevel"] == "E"
                            && result != undefined) {

                            if (msg.length > 1500) {
                                message.channel.send(msg);
                                msg = '';
                            } msg += (`**${assignment.name}**: ${result}\n\n`);
                        }
                    });

                    if (msg == '') message.channel.send("There are no pending assignments!\n\
Use `sb ass all` to see overdue pending assignments.");

                    message.channel.send(msg);
                }, console.log);


                message.channel.stopTyping();
                break;

            case "logout":
                message.channel.send("Logging out...");
                logout(message.author.id).then(val => message.channel.send(val));
                break;
        }
    }
});