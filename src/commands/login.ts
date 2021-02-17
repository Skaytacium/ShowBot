import { MessageEmbed } from "discord.js";
import { basembed } from ".";
import { login } from "../api/log";
import { data, refresh } from "../data";
import { SBCommand } from "../typings/showbie/custom";

export default {
    base: "Logs in to your account securely.",
    opts: [{
        name: "username",
        base: "Your Showbie username to login with.",
        opt: false
    }, {
        name: "password",
        base: "Your Showbie password to login with.",
        opt: false
    }, {
        name: "school",
        base: "The school that you are in. Default is BHIS.",
        det: "Currently only BHIS Malad is supported as I am in that school and the only developer working on this bot.",
        opt: true
    }],
    get: dispatch
} as SBCommand

function dispatch(params: {
    orig: string[],
    userid: string
}) {
    return new Promise<MessageEmbed>((_res, _rej) => {
        refresh(["sessions"])

        if (params.userid in data.sessions) _rej(basembed.setTitle("You have already logged in."));
        else if (!params.orig[0]) _rej(basembed.setTitle("No username and/or password found."));

        else login(params.userid, {
            user: params.orig[0],
            pass: params.orig[1],
            school: params.orig[2] ? params.orig[2] : "BHIS"
        })
            .then(val => _res(basembed.setTitle(val)))
            .catch(val => _rej(basembed.setTitle(val)))
    });
}