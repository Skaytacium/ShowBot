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