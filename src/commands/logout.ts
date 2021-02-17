import { MessageEmbed } from "discord.js";
import { basembed } from ".";
import { logout } from "../api/log";
import { data, refresh } from "../data";
import { SBCommand, SBCommandParams } from "../typings/showbie/custom";

export default {
    base: "Logs out of your account securely.",
    get: dispatch
} as SBCommand

function dispatch(params: SBCommandParams) {
    return new Promise<MessageEmbed>((_res, _rej) => {
        refresh(["sessions"])
        console.log(data.sessions)
        if (!(params.userid in data.sessions)) _rej(basembed.setTitle("You have not logged in."));

        else logout(params.userid)
            .then(val => _res(basembed.setTitle(val)))
            .catch(val => _rej(basembed.setTitle(val)))
    });
}