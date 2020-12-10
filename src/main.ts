import discord from "discord.js";
import { Utils } from "./utils";
import { API } from "./showbie";

const utils: Utils = new Utils("data/");
const client: discord.Client = new discord.Client();

client
    .login(utils.data.discord.token)
    .then(() => console.log("Started."))
    .catch((err) => {
        if (err) console.error(err);
        else console.log("Couldn't Login.");
    });

client.on("message", (message) => {
    const orig: string[] = message.content.split(" ");
    const command: string[] = message.content.toLowerCase().split(" ");
    if (command[0] == "sb") {
        switch (command[1]) {
            case "login":
                if (message.author)
                message.author.createDM().then((chan) => {
                    chan.send("Welcome to ShowBot!\
Type in the following command using your Showbie credentials:\n\
`sb creds <username here> <password here>`\n\
ShowBot does not use your account for any other purposes.\
 Due to the nature of open source software, it is recommended\
 that you take out any private information from your Showbie account before continuing.\
 ShowBot doesn't practice or encourage theft of credentials.\
 While you can use `sb creds` on a public server, it is not recommended due to obvious reasons.");
                });
                break;
        }
    }
});
