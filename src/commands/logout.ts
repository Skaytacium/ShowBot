import { MessageEmbed } from "discord.js";
import cloneDeep from "lodash.clonedeep";
import { basembed } from ".";
import { logout } from "../api/log";
import { data, refresh } from "../data";
import { SBCommand, SBCommandParams } from "../typings/showbie/custom";

export default {
    base: "Logs out of your account securely.",
    get: dispatch
} as SBCommand

function dispatch(params: SBCommandParams) {
    const logembed = cloneDeep(basembed);

    return new Promise<MessageEmbed[]>((_res, _rej) => {
        refresh(["sessions"])

        if (!(params.userid in data.sessions)) _rej(logembed.setTitle("You have not logged in."));

        else logout(params.userid)
            .then(val => _res([logembed.setTitle(val)]))
            .catch(val => _rej(logembed.setTitle(val)))
    });
}