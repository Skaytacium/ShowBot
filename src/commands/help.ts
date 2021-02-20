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
    return new Promise<MessageEmbed[]>((_res) => {
        let helpembed = cloneDeep(basembed);

        helpembed.setTitle("Help/Information")
        helpembed.setDescription("**?** next to a parameter means optional. \
**--** next to a parameter means its a modifier and not a command. \
If two or more incompatible modifiers or commands are specified, the result might not be as expected.")

        for (const command in commands) {
            //Line break thingy
            helpembed.addField("\u200B", "\u200B");
            helpembed.addField(`${data.main.prefix} ${command}`, commands[command].base, false);

            const curfield = helpembed.fields.findIndex(val => val.name == `${data.main.prefix} ${command}`)

            if (commands[command].opts) { //@ts-ignore tch
                if (commands[command].opts.length < 2)
                    helpembed.fields[curfield].inline = true;
                //@ts-ignore no
                commands[command].opts.forEach(opt => {
                    helpembed.fields[curfield].name += ` <${opt.name}${opt.opt ? '?' : ''}>`
                    helpembed.addField(opt.name, opt.base, true)
                });
            }
        }

        _res([helpembed]);
    })
}