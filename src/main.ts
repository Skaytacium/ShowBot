import discord from "discord.js";
import https from "https";
import http from "http";
import fs from "fs";

const client: discord.Client = new discord.Client();
const dataPath: string = "data/";
const baseURL: string = "https://my.showbie.com/core";
var data: any = {};

fs.readdirSync(dataPath).forEach((file) => {
    const name: string = file.split(".")[0];
    console.log(`Initializing ${file}`);

    data[name] = JSON.parse(fs.readFileSync(dataPath + file).toString());
});

client.login(data.discord.token)
    .then(() => console.log("Started."))
    .catch((err) => {
        if (err) console.error(err);
        else console.log("Couldn't Login.");
    });

function makeTokenHeads(
    user: string,
    pass: string,
    school: string = "BHIS"): object {

    const tempReq: any = data.main.req;

    tempReq["x-showbie-clientapikey"] = data.main.schools[school];
    tempReq["Authorization"] = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
    tempReq["Content-Type"] = "application/json";

    return tempReq;
}

client.on("message", (message) => {
    const orig: string[] = message.content.split(" ");
    const command: string[] = message.content.toLowerCase().split(" ");

    if (command[0] == "sb") {
        switch (command[1]) {
            case "login":
                message.author.createDM().then((chan) => {
                    chan.send(
                        "Welcome to ShowBot!\
Type in the following command using your Showbie credentials:\n\
`sb creds <username here> <password here> <optional fingerprint>`\n\
ShowBot **does not use your account for any other purposes.**\
 Due to the nature of open source software, it is recommended\
 that you **take out any private information from your Showbie account** before continuing.\
 ShowBot doesn't practice or encourage theft of credentials.\
 While you can use `sb creds` on a public server, it is **not recommended** due to obvious reasons."
                    );
                });
                break;

            case "creds":
                message.channel.send("Logging in...")

                const tempFP: string = (orig[4] != undefined ? orig[4] : data.accounts["dfp"]);
                const options: object = {
                    "method": "POST",
                    "headers": makeTokenHeads(orig[2], orig[3])
                };
                
                const req = https.request("https://my.showbie.com/core/sessions", options, res => {
                    res.on('data', chunk => {
                        chunk = JSON.parse(chunk.toString());
                        switch ((''+res.statusCode)[0]) {
                            case "4":
                                chunk.errors.forEach((err: any) => {
                                    message.channel.send(`**Error!**\n*Code:* ${err.status}\n*Definition:* ${//@ts-ignore
                                    http.STATUS_CODES[err.status]}.\n*Meaning:* ${err.title}`);
                                    console.log(err);
                                });
                                break;

                            case "2":
                                message.channel.send("Succesfully logged in!");
                                break
                            
                            default: message.channel.send("Try again!")
                        }
                    });
                });
                req.write(JSON.stringify({
                    "session": {
                        "fingerprint": tempFP
                    }
                }));
                req.end();

                break;
        }
    }
});
