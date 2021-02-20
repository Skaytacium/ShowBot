import { MessageEmbed } from "discord.js";
import cloneDeep from "lodash.clonedeep";
import { basembed } from ".";
import { sbreq } from "../api";
import { data, refresh } from "../data";
import { SBCommand, SBCommandParams } from "../typings/showbie/custom";
import Fuse from 'fuse.js'
import { ctime } from "../utils";

export default {
    base: "Searches an assignment by name.",
    opts: [{
        name: "query",
        base: "The name of the assignment to search for."
    }],
    get: dispatch
} as SBCommand

function dispatch(params: SBCommandParams) {
    return new Promise<MessageEmbed>((_res, _rej) => {
        refresh(["sessions"])

        const searchembed = cloneDeep(basembed);

        if (!data.sessions[params.userid])
            _rej(searchembed.setTitle("No login found."))

        else sbreq(params.userid, "assignments")
            .then((info: { "meta": { "serverTime": number }, "assignments": SBAssignment[] }) => {
                const query = params.orig.join(" ");

                const results = new Fuse(info.assignments, {
                    keys: ['name']
                }).search(query);
                
                if (!results.length) _res(searchembed.setTitle("No search results found for " + query))
                else searchembed.setTitle("Search results for " + query);

                results.forEach(rul => {
                    if (searchembed.length < 1750)
                        searchembed.addField(
                            `${rul.item.name}, ID: ${rul.item.id}`, 
                            `[${rul.item.meta.attachmentCount ? 'Submitted ' + ctime(rul.item.dueDate, info.meta.serverTime) + ' ago' : (rul.item.dueDate > info.meta.serverTime ? 'Due in ' : 'Overdue by ') + ctime(rul.item.dueDate, info.meta.serverTime)}](https://my.showbie.com/assignments/${rul.item.id}/posts)`
                        )
                    else _res(searchembed)
                });

                _res(searchembed)
            });
    })
}