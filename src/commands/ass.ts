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
                let page = 1;
                assembed.setTitle("Assignments, Page " + page);

                if (params.orig.includes("--new")) info.assignments.sort((a, b) => b.dueDate - a.dueDate)
                else if (params.orig.includes("--old")) info.assignments.sort((a, b) => a.dueDate - b.dueDate)

                info.assignments.forEach((ass) => {
                    if (approve(info.meta.serverTime, ass, params.orig)) assembed.addField(
                        `${ass.name}, ID: ${ass.id}`, //Sorry vim users, gotta do it this one time.
                        `[${ass.meta.attachmentCount ? 'Submitted ' + ctime(ass.dueDate, info.meta.serverTime) + ' ago' : (ass.dueDate > info.meta.serverTime ? 'Due in ' : 'Overdue by ') + ctime(ass.dueDate, info.meta.serverTime)}](https://my.showbie.com/assignments/${ass.id}/posts)`
                    );

                    if (assembed.length > data.main.pglen) {
                        final.push(assembed)
                        page++
                        assembed = cloneDeep(basembed).setTitle("Assignments, Page " + page)
                    };
                });

                if (assembed.fields.length > 0) final.push(assembed);

                _res(final);
            });
    });
}

function approve(servertime: number, assignment: SBAssignment, msg: string[]) { //Doesn't actually work lmao
    let truthy = 0;

    if (!assignment.meta.attachmentCount) {
        if (msg.includes("pen") && servertime < assignment.dueDate) truthy++;
        else truthy--;
        if (msg.includes("old") && servertime > assignment.dueDate) truthy++;
        else truthy--;
    }

    if (truthy < 0) truthy = 0

    return !assignment.meta.attachmentCount
}