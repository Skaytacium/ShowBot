import { Client } from "discord.js";
import * as data from "../data/discord.json";

const client: Client = new Client();

client.login(data.token)
    .then(() => console.log("INFO: Started!"))
    .catch((err) => {
        if (err) console.error(err);
        else console.log("ERROR: Bot couldnt login!");
    });