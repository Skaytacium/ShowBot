import { jsonfr } from "../utils/data";

export let data: Model;

export function refresh(include?: ["accounts" | "kills" | "sessions"]) {
    if (include)
        include?.forEach(val => {
            data[val] = jsonfr(val);
        })
    else {
        data.accounts = jsonfr("accounts")
        data.kills = jsonfr("kills")
        data.sessions = jsonfr("sessions")
    }
}

function init() {
    data = {
        accounts: jsonfr("accounts"),
        discord: jsonfr("discord"),
        main: jsonfr("main"),
        sessions: jsonfr("sessions"),
        kills: jsonfr("kills")
    }
}

init();