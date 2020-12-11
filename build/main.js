"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var https_1 = require("https");
var http_1 = require("http");
var fs_1 = require("fs");
var zlib_1 = require("zlib");
var stream_1 = require("stream");
var readline_1 = require("readline");
var rl = readline_1.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "sb> ",
    tabSize: 4
});
var client = new discord_js_1.Client();
var dataPath = "data/";
var baseURL = "https://my.showbie.com/core";
var data = {};
fs_1.writeFileSync(dataPath + "sessions.json", "{}");
function updateFiles(include, removeTemp) {
    if (removeTemp === void 0) { removeTemp = true; }
    console.log("Updating files: " + (include == undefined ? "all" : include));
    fs_1.readdirSync(dataPath).forEach(function (file) {
        var name = file.split(".");
        if (include != undefined && include.includes(name[0]) && name[1] == "json") {
            data[name[0]] = JSON.parse(fs_1.readFileSync(dataPath + file).toString());
            console.log("Imported: " + file);
        }
        else if (include == undefined && name[1] == "json") {
            data[name[0]] = JSON.parse(fs_1.readFileSync(dataPath + file).toString());
            console.log("Imported: " + file);
        }
        else if (removeTemp && name[1] != "json") {
            fs_1.rmSync(dataPath + file);
            console.log("Removed file " + file);
        }
    });
}
updateFiles();
client.login(data.discord.token)
    .then(function () { return console.log("Started"); })
    .catch(function (err) {
    if (err)
        console.error(err);
    else
        console.log("Couldnt Login");
});
function tob64(string) {
    console.log("Converting " + string + " to base64");
    return Buffer.from(string).toString('base64');
}
function fromb64(string) {
    console.log("Converting " + string + " from base64");
    return Buffer.from(string, 'base64').toString('ascii');
}
function randomValue(array) {
    console.log("Returning random value from " + array);
    return array[array.length * Math.random() << 0];
}
function makefp(length) {
    console.log("Made a random fingerprint of length " + length);
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}
function makeTokenHeads(user, pass, school) {
    if (school === void 0) { school = "BHIS"; }
    console.log("Making token headers for user " + user + " in " + school);
    var tempReq = data.main.req;
    tempReq["x-showbie-clientapikey"] = data.main.schools[school];
    tempReq["Authorization"] = "Basic " + tob64(user + ":" + pass);
    tempReq["Content-Type"] = "application/json";
    return tempReq;
}
function makeAuthHeads(token, fp, school) {
    console.log("Making auth headers for user in " + school);
    var tempReq = data.main.req;
    tempReq["x-showbie-clientapikey"] = data.main.schools[school];
    tempReq["Authorization"] = "sbe token=" + tob64(token) + ",fp=" + tob64(fp);
    tempReq["Content-Type"] = "application/json";
    return tempReq;
}
function createSessionEntry(headers, userID) {
    data.sessions[userID] = headers;
    data.sessions[userID]["Content-Type"] = undefined;
    fs_1.writeFileSync(dataPath + "sessions.json", JSON.stringify(data.sessions));
    updateFiles(["sessions"]);
    console.log("Created session for userID " + userID);
}
function getFromAPI(userID, filename, method) {
    if (method === void 0) { method = "GET"; }
    return new Promise(function (resolve, reject) {
        var req = https_1.request(baseURL + "/assignments", {
            "method": method,
            "headers": data.sessions[userID]
        }, function (res) {
            stream_1.pipeline(res, zlib_1.createGunzip(), fs_1.createWriteStream(dataPath + (filename + "." + userID + ".json")), function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    console.log("Wrote to file " + filename + "." + userID + ".json");
                    resolve(dataPath + (filename + "." + userID + ".json"));
                }
            });
        });
        req.end();
    });
}
function logout(userID) {
    updateFiles(["sessions"]);
    return new Promise(function (resolve) {
        if (data.sessions[userID]) {
            var sessionToken = fromb64((data.sessions[userID]["Authorization"])
                .split(",")[0].slice(10));
            https_1.request(baseURL + "/sessions/" + sessionToken, {
                "method": "DELETE",
                "headers": data.sessions[userID]
            }, function (res) {
                switch (('' + res.statusCode)[0]) {
                    case "4":
                        resolve("**Error!**\n*Code:* " + res.statusCode + "\n*Definition:* " + http_1.STATUS_CODES[res.statusCode] + ".");
                    case "2":
                        delete data.sessions[userID];
                        fs_1.writeFileSync(dataPath + "sessions.json", JSON.stringify(data.sessions));
                        updateFiles(["sessions"]);
                        resolve("Logged out succesfully!");
                    default: resolve("Could not log out, try again later!");
                }
            }).end();
        }
        else
            resolve("No login found! Login first to logout.");
    });
}
function login(userID, orig) {
    return new Promise(function (resolve) {
        var tempFP = makefp(20);
        var options = {
            "method": "POST",
            "headers": makeTokenHeads(orig[2], orig[3], orig[4])
        };
        var req = https_1.request(baseURL + "/sessions", options, function (res) {
            console.log("Logging in for user " + userID);
            var reqData = '';
            res.on('data', function (chunk) { return reqData += chunk.toString(); });
            res.on('close', function () {
                reqData = JSON.parse(reqData);
                switch (('' + res.statusCode)[0]) {
                    case "4":
                        reqData.errors.forEach(function (err) {
                            resolve("**Error!**\n*Code:* " + err.status + "\n*Definition:* " + http_1.STATUS_CODES[err.status] + ".\n*Meaning:* " + err.title);
                        });
                        break;
                    case "2":
                        data.accounts[userID] = {};
                        data.accounts[userID].user = orig[2];
                        data.accounts[userID].pass = orig[3];
                        data.accounts[userID].school =
                            orig[4] == undefined ? "BHIS" : orig[4];
                        fs_1.writeFileSync(dataPath + "accounts.json", JSON.stringify(data.accounts));
                        createSessionEntry(makeAuthHeads(reqData.session.token, tempFP, data.accounts[userID].school), userID);
                        resolve("Created session!");
                    default: resolve("Could not log in, try again later!");
                }
            });
        });
        req.write(JSON.stringify({
            "session": {
                "fingerprint": tempFP
            }
        }));
        req.end();
    });
}
for (var account in data.accounts) {
    if (account == "fp")
        continue;
    login(account, ["", "",
        data.accounts[account].user,
        data.accounts[account].pass,
        data.accounts[account].school])
        .then(console.log);
}
client.on("message", function (message) {
    var orig = message.content.split(" ");
    var command = message.content.toLowerCase().split(" ");
    if (command[0] == "sb") {
        switch (command[1]) {
            case "login":
                if (data.accounts[message.author.id]) {
                    message.channel.send("You have already logged in! To relogin, use:\n\
 `sb creds <username here> <password here> <optional school name(no spaces, default is BHIS)>`.");
                    break;
                }
                message.channel.send("Check your DMs!");
                message.author.createDM().then(function (chan) {
                    chan.send("Welcome to ShowBot!\n\
Type in the following command using your Showbie credentials:\n\
 `sb creds <username here> <password here> <optional school name(no spaces, default is BHIS)>`\n\
ShowBot **does not use your account for any other purposes.**\
 Due to the nature of open source software, it is recommended\
 that you **take out any private information from your Showbie account** before continuing.\
 ShowBot doesn't practice or encourage theft of credentials.\
 While you can use `sb creds` on a public server, it is **not recommended** due to obvious reasons.");
                });
                break;
            case "creds":
                if (orig[3] == undefined) {
                    message.channel.send("Enter your details!\n\
`sb creds <username here> <password here> <optional school name(no spaces, default is BHIS)>`");
                    break;
                }
                message.channel.send("Logging in...");
                login(message.author.id, orig).then(function (val) {
                    message.channel.send(val);
                    console.log(val);
                });
                break;
            case "kill":
                if (command[2] == "contribute") {
                    message.channel.send("5 ");
                }
                else if (data.kills[command[2]])
                    message.channel.send(randomValue(data.kills[command[2]]));
                else
                    message.channel.send("Who?");
                break;
            case "assignments":
                if (!data.sessions[message.author.id]) {
                    message.channel.send("Log in first! `sb login`");
                    break;
                }
                getFromAPI(message.author.id, "assignments").then(console.log, console.log);
                break;
            case "logout":
                message.channel.send("Logging out...");
                logout(message.author.id).then(function (val) { return message.channel.send(val); });
                break;
        }
    }
});
