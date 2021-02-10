import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { data } from '../data'
import { SBCommand } from "../typings/showbie/custom";

export const client: Client = new Client();
export const commands = getcommands();

function getcommands(): Dict<SBCommand> {
    let temp: Dict<SBCommand> = {};

    readdirSync(__dirname)
        .map(val => val.split(".")[0])
        .forEach(val => {
            if (val == 'index') return
            else temp[val] = require(join(__dirname, val)).default
        })

    return temp;
}

client.login(data.discord.token)
    .catch((err) => {
        if (err) console.error(err);
        else console.error("Bot couldnt login.");
    });