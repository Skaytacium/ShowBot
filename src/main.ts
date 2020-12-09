import fs from "fs";
// import https from "https";
// import discord from "discord.js";
import yaml from "js-yaml";
/* const {
    Worker, MessageChannel, MessagePort, isMainThread, parentPort
} = require('worker_threads'); */

var data = yaml.load(fs.readFileSync("data/main.yaml").toString());