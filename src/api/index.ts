import { gun } from "../utils/guz"
import { request } from "https"
import { tknhead } from "../utils/api";
import { data } from "../data";
import { STATUS_CODES } from "http";
import { Gunzip } from "zlib";
import cloneDeep from "lodash.clonedeep";
import { basembed } from "../commands";

export function sbreq(userID: string, path: string, method: string = "GET"): Promise<any> {
    return new Promise((_res, _rej) => {
        request(
            "https://my.showbie.com/core/" + path,
            {
                "method": method,
                "headers": { ...tknhead(data.sessions[userID]) }
            },
            res => {
                const gunner = gun() as Gunzip;
                res.on('data', val => gunner.write(val));

                res.on('close', () => {
                    gunner.end();
                    //Sorry, too lazy too add types right now
                    gunner.on('out', (val: any) => {
                        val = JSON.parse(val);

                        switch (('' + res.statusCode)[0]) {
                            case "2":
                                _res(val);
                                break;

                            case "4":
                                _rej(cloneDeep(basembed).setTitle("Error").addFields([{
                                    name: "Code",
                                    value: res.statusCode
                                }, {
                                    name: "Definition",
                                    value: STATUS_CODES[res.statusCode ? res.statusCode : 404]
                                }, {
                                    name: "Meaning",
                                    value: val.errors ? val.errors[0].title : "No meaning sent from server."
                                }]));
                                break;

                            default: _rej("Could process request, try again later.");
                        }

                    })
                });
            }).end();
    });
}