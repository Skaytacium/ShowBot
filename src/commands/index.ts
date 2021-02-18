import { Client, MessageEmbed } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { data } from '../data'
import { SBCommand } from "../typings/showbie/custom";

export const client: Client = new Client();
export const commands = getcommands();

export const basembed = new MessageEmbed()
    .setColor('#56dfcc')
    .setFooter("Live since")
    .setTimestamp(Date.now());

function getcommands(): Dict<SBCommand> {
    let temp: Dict<SBCommand> = {};

    readdirSync(__dirname)
        .map(val => val.split(".")[0])
        .forEach(val => {
            if (val == 'index') return
            else temp[val] = require(join(__dirname, val)).default
        })

    return temp;
}

client.login(data.discord.token)
    .then(() => console.log("Logged in."))
    .catch((err) => {
        if (err) console.error(err);
        else console.error("Bot couldnt login.");
    });

client.on('ready', () => {
    console.log("Ready.");

    client.user?.setPresence({
        activity: {
            name: `${data.main.prefix} help`,
            type: "LISTENING"
        },
        status: "dnd"
    });

    basembed.setAuthor(
        client.user?.username,
        client.user?.displayAvatarURL(),
        "https://github.com/Skaytacium/ShowBot"
    );
})