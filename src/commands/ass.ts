import { MessageEmbed } from "discord.js";
import cloneDeep from "lodash.clonedeep";
import { basembed } from ".";
import { sbreq } from "../api";
import { data, refresh } from "../data";
import { SBCommand, SBCommandParams } from "../typings/showbie/custom";
import { ctime } from "../utils";

export default {
    base: "Main assignments command.",
    opts: [{
        name: "pen",
        base: "Shows pending assignments.",
        opt: true
    }, {
        name: "old",
        base: "Shows overdue assignments.",
        opt: true
    }, {
        name: "--new",
        base: "Sorts by latest.",
        opt: true
    }, {
        name: "--old",
        base: "Sorts by oldest.",
        opt: true
    }],
    get: dispatch
} as SBCommand

function dispatch(params: SBCommandParams) {
    return new Promise<MessageEmbed[]>((_res, _rej) => {
        refresh(["sessions"])

        let final: MessageEmbed[] = [];
        let assembed = cloneDeep(basembed)

        if (!data.sessions[params.userid])
            _rej(assembed.setTitle("No login found."))

        else sbreq(params.userid, "assignments")
            .then((info: { "meta": { "serverTime": number }, "assignments": SBAssignment[] }) => {
                assembed.setTitle("Assignments");

                info.assignments.forEach((ass) => {
                    if (assembed.length < 5500 && approve(info.meta.serverTime, ass, params.orig))
                        assembed.addField(
                            `${ass.name}, ID: ${ass.id}`, //Sorry vim users, gotta do it this one time.
                            `[${ass.meta.attachmentCount ? 'Submitted ' + ctime(ass.dueDate, info.meta.serverTime) + ' ago' : (ass.dueDate > info.meta.serverTime ? 'Due in ' : 'Overdue by ') + ctime(ass.dueDate, info.meta.serverTime)}](https://my.showbie.com/assignments/${ass.id}/posts)`
                        );

                    else {
                        final.push(assembed)
                        assembed.fields = []
                        assembed.addField(
                            `${ass.name}, ID: ${ass.id}`, //Sorry vim users, gotta do it this second time.
                            `[${ass.meta.attachmentCount ? 'Submitted ' + ctime(ass.dueDate, info.meta.serverTime) + ' ago' : (ass.dueDate > info.meta.serverTime ? 'Due in ' : 'Overdue by ') + ctime(ass.dueDate, info.meta.serverTime)}](https://my.showbie.com/assignments/${ass.id}/posts)`
                        );
                    };
                });

                _res(final);
            });
    });
}

function approve(servertime: number, assignment: SBAssignment, msg: string[]) {
    let truthy = 0;

    if (!assignment.meta.attachmentCount) {
        if (msg.includes("pen")) {
            if (servertime < assignment.dueDate) truthy++;
            else truthy = 0
        }
        if (msg.includes("old")){
            if (servertime > assignment.dueDate) truthy++;
            else truthy = 0
        }
    } else truthy++;

    // console.log({
    //     "st": servertime,
    //     "add": assignment.dueDate,
    //     "ac": assignment.meta.attachmentCount,
    //     "truthy": truthy
    // })

    return truthy
}