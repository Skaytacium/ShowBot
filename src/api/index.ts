import { gun } from "../utils/guz"
import { request } from "https"
import { tknhead } from "../utils/api";
import { data } from "../data";

export function sbass(userID: string): Promise<string> {
    return new Promise((_res, _rej) => {
        request(
            "https://my.showbie.com/core/assignments",
            {
                "method": "GET", //@ts-ignore WHYY??
                "headers": tknhead(data.sessions[userID])
            },
            res => {
                const gunner = gun();
                //@ts-ignore TS is shit.
                res.on('data', gunner.write);

                res.on('close', () => { //@ts-ignore BRUH ITS NOT A PROMISE.
                    gunner.end();  //@ts-ignore BRUH ITS NOT A PROMISE.
                    gunner.on('out', val => {
                        switch (('' + res.statusCode)[0]) {
                            case "2":
                                console.log(val);
                                _res(val);

                            case "4":
                                _rej(`**Error:**\n*Code:* ${res.statusCode}\n*Definition:* ${//@ts-ignore Impossible scenario.
                                STATUS_CODES[res.statusCode]}.`);

                            default:  _rej("Could not get assignments, try again later.");
                        }
                    })
                });
            }).end();
    });
}