import { login, logout } from "./log"
import { data, refresh } from '../data'

export function init(excludes?: string[]) {

    for (const account in data.accounts) {

        if (account == "fp") continue;
        if (excludes?.includes(account)) continue;

        login(account, data.accounts[account])
        .then(console.log)
        .catch(console.log)
    }
}

export function deinit(excludes?: string[]) {
    refresh(['sessions'])

    for (const account in data.accounts) {

        if (account == "fp") continue;
        if (excludes?.includes(account)) continue;

        logout(account)
        .then(console.log)
        .catch(console.log)
    }
}