import { EmbedField, MessageEmbed } from "discord.js";
import { SBCommand } from "../typings/showbie/custom";
import { basembed, commands } from ".";
import cloneDeep from "lodash.clonedeep";
import { data } from "../data";

export default {
    base: "Shows the help message.",
    opts: [{
        name: "command",
        base: "The command to get more detailed help with.",
        opt: true
    }],
    get: dispatch
} as SBCommand

function dispatch() {
    return new Promise<MessageEmbed>((_res) => {
        let helpembed = cloneDeep(basembed);

        helpembed.setTitle("Help/Information")
        helpembed.setDescription("**?** next to a parameter means optional.")

        for (const command in commands) {
            //Line break thingy
            helpembed.addField("\u200B", "\u200B");
            helpembed.addField(`${data.main.prefix} ${command}`, commands[command].base, false);

            const curfield = helpembed.fields.findIndex(val => val.name == `${data.main.prefix} ${command}`)

            if (commands[command].opts) { //@ts-ignore tch
                if (commands[command].opts.length < 3)
                    helpembed.fields[curfield].inline = true;
                //@ts-ignore no
                commands[command].opts.forEach(opt => {
                    helpembed.fields[curfield].name += ` <${opt.name}${opt.opt ? '?' : ''}>`
                    helpembed.addField(opt.name, opt.base, true)
                });
            }
        }

        _res(helpembed);
    })
}