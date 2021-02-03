import { Client } from "discord.js";
import { jsonfr } from "./utils/data";

const data: Discord = jsonfr('../db/discord.json');
export const client: Client = new Client();

client.login(data.token)
    .then(() => console.log("INFO: Started!"))
    .catch((err) => {
        if (err) console.error(err);
        else console.log("ERROR: Bot couldnt login!");
    });