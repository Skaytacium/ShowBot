import { APIMessage, MessageEmbed } from "discord.js";
import cloneDeep from "lodash.clonedeep";
import { basembed } from ".";
import { sbreq } from "../api";
import { data } from "../data";
import { SBCommand, SBCommandParams } from "../typings/showbie/custom";

export default {
    base: "View an assignment by its ID.",
    opts: [{
        name: "ID",
        base: "The ID of the assignment or media to view.",
        det: "Assignment IDs can be found by `sb ass` or `sb search`. Media IDs can be found by doing `sb view <assignment ID>`."
    }],
    get: dispatch
} as SBCommand

function dispatch(params: SBCommandParams) {
    const fpembed = cloneDeep(basembed)

    return new Promise<(string | MessageEmbed)[]>(async (_res, _rej) => {

        if (!data.sessions[params.userid]) _rej(fpembed.setTitle("Log in first."))
        if (!params.orig[0]) _rej(fpembed.setTitle("No ID specified."))

        if (params.orig[0].includes("-")) {
            let sendimgs: string[] = []

            const mediareq: {
                "media": {
                    "pages": {
                        "page": number,
                        "baseUrl": string
                    }[],
                    "status": string
                }
            } = await sbreq(params.userid, `folder-posts/${params.orig[0]}/media`)

            if (mediareq.media.status != "COMPLETE") _rej(fpembed.setTitle("Conversion not complete yet, try again in a bit."))

            else mediareq.media.pages.forEach(pg => {
                sendimgs.push(pg.baseUrl)
            });

            _res(sendimgs)
        } else {
            const assreq: {
                "assignment": SBAssignment,
                "folders": {
                    "id": string
                }[]
            } = await sbreq(params.userid, `assignments/${params.orig[0]}`).catch(_rej);

            if (!assreq) return

            const folderpostsreq: {
                "folderPosts": {
                    "id": string,
                    "name": string
                }[]
            } = await sbreq(params.userid, `folders/${assreq.folders[0].id}/folder-posts`).catch(_rej);

            fpembed.setTitle("Media in assignment " + assreq.assignment.name)

            folderpostsreq.folderPosts.forEach(post => {
                fpembed.addField(post.name, post.id)
            })

            _res([fpembed]);
        }
    });
}