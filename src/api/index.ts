import { gun } from "../utils/guz"
import { request } from "https"
import { tknhead } from "../utils/api";
import { data } from "../data";
import { STATUS_CODES } from "http";
import { Gunzip } from "zlib";

export function sbreq(userID: string, path: string, method: string = "GET"): Promise<string> {
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
                                _rej(`**Error:**\n\
*Code:* ${res.statusCode}\n\
*Meaning:* ${val.errors[0].title}
*Definition:* ${STATUS_CODES[res.statusCode ? res.statusCode : 404]}.\
`);
                                break;

                            default: _rej("Could process request, try again later.");
                        }

                    })
                });
            }).end();
    });
}