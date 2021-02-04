import { data, refresh } from '../data'
import { request } from 'https'
import { bschead, tknhead, wsession } from '../utils/api'
import { STATUS_CODES } from 'http';
import { jsonto } from '../utils/data';

export function login(userID: string, acc: STBAcc) {

    return new Promise<string>((_res, _rej) => {
        const tempFP = makefp(20);

        request("https://my.showbie.com/core/sessions",
            {
                "method": "POST", //@ts-ignore why?
                "headers": bschead(orig[2], orig[3], data.main[orig[4]])
            },
            res => {
                let recdat: any = '';
                res.on('data', chunk => recdat += chunk.toString());

                res.on('close', () => {
                    recdat = JSON.parse(recdat);

                    switch (('' + res.statusCode)[0]) {
                        case "4":
                            let terrors = '';

                            recdat.errors.forEach((err: any) => {
                                terrors += `**Error:**\n\
*Code:* ${err.status}\n\
*Definition:* ${STATUS_CODES[err.status]}.\n\
*Meaning:* ${err.title}`;
                            });
                            _rej(terrors)

                        case "2":
                            data.accounts[userID] = acc;

                            jsonto("accounts", data.accounts);

                            wsession(
                                {
                                    token: recdat.session.token,
                                    fp: tempFP,
                                    school: data.accounts[userID].school
                                },
                                userID);
                            _res("Logged in and created session!");

                        default: _rej("Could not log in, try again later.");
                    }
                });
            }).end(JSON.stringify({
                "session": {
                    "fingerprint": tempFP
                }
            }));
    });
}

export function logout(userID: string) {
    refresh(["sessions"]);

    return new Promise<string>((_res, _rej) => {
        request(
            "https://my.showbie.com/core/sessions/" + data.sessions[userID].token,
            {
                "method": "DELETE", //@ts-ignore WHY?
                "headers": tknhead(data.sessions[userID])
            },
            res => {
                switch (('' + res.statusCode)[0]) {
                    case "4":
                        _rej(`**Error:**\n*Code:* ${res.statusCode}\n*Definition:* ${//@ts-ignore Impossible scenario.
                            STATUS_CODES[res.statusCode]}.`);

                    case "2":
                        delete data.sessions[userID];

                        jsonto("sessions", data.sessions);
                        refresh(["sessions"]);

                        _res("Logged out succesfully!");

                    default: _rej("Could not log out, try again later.");
                }
            }).end();
    });
}