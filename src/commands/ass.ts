import { MessageEmbed } from "discord.js";
import cloneDeep from "lodash.clonedeep";
import { basembed } from ".";
import { sbreq } from "../api";
import { data } from "../data";
import { SBCommand, SBCommandParams } from "../typings/showbie/custom";
import { ctime } from "../utils";

export default {
    base: "Shows non-submitted assignments menu.",
    det: "Displays a menu which handles all non-submitted assignment tasks via reactions.",
    opts: [{
        name: "pen",
        base: "Shows pending assignments.",
        opt: true
    }, {
        name: "old",
        base: "Shows overdue assignments.",
        opt: true
    }, {
        name: "all",
        base: "Shows pending and overdue assignments.",
        opt: true
    }],
    get: dispatch
} as SBCommand

function dispatch(params: SBCommandParams) {
    return new Promise<MessageEmbed>((_res, _rej) => {
        let assembed = cloneDeep(basembed)

        if (!data.sessions[params.userid])
            _rej(assembed.setTitle("No login found."))

        else sbreq(params.userid, "assignments").then((info: {
            "meta": {
                "serverTime": number
            },
            "assignments": SBAssignment[]
        }) => {
            info.assignments.forEach((assignment) => {
                console.log(assignment.name);
            });
        }, console.log);
    });
}