import { MessageEmbed } from "discord.js";
import { SBCommand } from "../typings/showbie/custom";
import { client, commands } from ".";

export default {
    base: "Shows the help message.",
    get: helpembed
} as SBCommand

function helpembed() {
    return new Promise<MessageEmbed>((_res) => {
        let temp = new MessageEmbed()
            .setTitle("Help/Information.") //@ts-ignore, highly unlikely scenario.
            .setAuthor(client.user?.username, client.user?.avatar)
            .setColor(65535)

        for (const command in commands) {
            
        }

        _res(temp);
    })
}