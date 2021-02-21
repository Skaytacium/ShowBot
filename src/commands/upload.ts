import { MessageEmbed } from "discord.js";
import cloneDeep from "lodash.clonedeep";
import { basembed } from ".";
import { SBCommand, SBCommandParams } from "../typings/showbie/custom";

export default {
    base: "Uploads the attached file to the given assignment ID.",
    opts: [{
        name: "ID",
        base: "The ID of the assignment to upload to."
    }, {
        name: "attachment",
        base: "The attached file to upload. This is read from a message attachment and is not a text parameter."
    }],
    get: dispatch
} as SBCommand

function dispatch(params: SBCommandParams) {
    return new Promise<MessageEmbed[]>((_res, _rej) => {
        return _res([cloneDeep(basembed).setTitle("TODO")])
    })
}