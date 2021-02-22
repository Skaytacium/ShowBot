import { MessageEmbed } from "discord.js";
import cloneDeep from "lodash.clonedeep";
import { basembed } from ".";
import { login } from "../api/log";
import { data, refresh } from "../data";
import { SBCommand, SBCommandParams } from "../typings/showbie/custom";

export default {
    base: "Logs in to your account securely.",
    opts: [{
        name: "username",
        base: "Your Showbie username to login with."
    }, {
        name: "password",
        base: "Your Showbie password to login with."
    }, {
        name: "school",
        base: "The school that you are in. Default is BHIS.",
        det: "Currently only BHIS Malad is supported as I am in that school and the only developer working on this bot.",
        opt: true
    }],
    get: dispatch
} as SBCommand

function dispatch(params: SBCommandParams) {
    return new Promise<MessageEmbed[]>((_res, _rej) => {
        const logembed = cloneDeep(basembed);

        refresh(["sessions"])

        if (params.userid in data.sessions)
            return _rej(logembed.setTitle("You have already logged in."));

        else if (!params.orig[0] && params.userid in data.accounts)
            login(params.userid, data.accounts[params.userid])
                .then(val => _res([logembed
                    .setTitle(val)
                    .setDescription("Used already existing account creds.")
                ]))
                .catch(val => _rej(logembed
                    .setTitle(val)
                    .setDescription("Used already existing account creds.")
                ))

        else if (!params.orig[0])
            return _rej(logembed.setTitle("No username and/or password found."));

        else login(params.userid, {
            user: params.orig[0],
            pass: params.orig[1],
            school: params.orig[2] ? params.orig[2] : "BHIS"
        })
            .then(val => _res([logembed.setTitle(val)]))
            .catch(val => _rej(logembed.setTitle(val)))
    });
}