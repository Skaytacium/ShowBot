"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
updateFiles();
function updateFiles(include, removeTemp) {
    if (removeTemp === void 0) { removeTemp = true; }
    console.log("INFO: Updating files: " + (include == undefined ? "all" : include));
    fs_1.readdirSync(dataPath).forEach(function (file) {
        var name = file.split(".");
        if (include != undefined && include.includes(name[0]) && name[1] == "json") {
            data[name[0]] = JSON.parse(fs_1.readFileSync(dataPath + file).toString());
            console.log("SUCCESS: Imported: " + file);
        }
        else if (include == undefined && name[1] == "json") {
            data[name[0]] = JSON.parse(fs_1.readFileSync(dataPath + file).toString());
            console.log("SUCCESS: Imported: " + file);
        }
        else if (removeTemp && name[1] != "json") {
            fs_1.rmSync(dataPath + file);
            console.log("SUCCESS: Removed file " + file);
        }
    });
}
function tob64(string) {
    console.log("INFO: Converting " + string + " to base64");
    return Buffer.from(string).toString('base64');
}
function fromb64(string) {
    console.log("INFO: Converting " + string + " from base64");
    return Buffer.from(string, 'base64').toString('ascii');
}
function randomValue(array) {
    console.log("INFO: Returning random value from " + array);
    return array[array.length * Math.random() << 0];
}
function makefp(length) {
    console.log("INFO: Made a random fingerprint of length " + length);
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}
function calcTime(sub, server, overdue) {
    if (overdue === void 0) { overdue = false; }
    var s = (sub - server) / 1000;
    var pos = s > 0;
    if (!overdue && !pos)
        return;
    var tempString = '';
    var months = pos ? Math.floor(s / (3600 * 720)) : Math.ceil(s / (3600 * 720));
    var monthdays = months * 30;
    var days = pos ? Math.floor(s / (3600 * 24)) - monthdays : Math.ceil(s / (3600 * 24)) - monthdays;
    var dayhours = (monthdays + days) * 24;
    var hours = pos ? Math.floor(s / 3600) - dayhours : Math.ceil(s / 3600) - dayhours;
    var hourminutes = (dayhours + hours) * 60;
    var minutes = pos ? Math.floor(s / 60) - hourminutes : Math.ceil(s / 60) - hourminutes;
    var minuteseconds = (hourminutes + minutes) * 60;
    var seconds = pos ? Math.floor(s) - minuteseconds : Math.ceil(s) - minuteseconds;
    var times = {
        "months": months,
        "days": days,
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds
    };
    for (var time in times)
        if (times[time])
            tempString += (times[time] < 0 ? times[time] * -1 : times[time]) + " " + time + " ";
    return "" + (pos ? "Due in  __" : "Overdue by  __") + tempString + "__";
}
function makeTokenHeads(user, pass, school) {
    if (school === void 0) { school = "BHIS"; }
    console.log("INFO: Making token headers for user " + user + " in " + school);
    var tempReq = data.main.req;
    tempReq["x-showbie-clientapikey"] = data.main.schools[school];
    tempReq["Authorization"] = "Basic " + tob64(user + ":" + pass);
    tempReq["Content-Type"] = "application/json";
    return tempReq;
}
function makeAuthHeads(token, fp, school) {
    console.log("INFO: Making auth headers for user in " + school);
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
    console.log("SUCCESS: Created session for userID " + userID);
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
                    console.log("SUCCESS: Wrote to file " + filename + "." + userID + ".json");
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
        if (data.sessions[userID]) {
            resolve("Session already exists for " + userID + ". Logout to delete the session.");
            return;
        }
        var tempFP = makefp(20);
        var options = {
            "method": "POST",
            "headers": makeTokenHeads(orig[2], orig[3], orig[4])
        };
        var req = https_1.request(baseURL + "/sessions", options, function (res) {
            console.log("INFO: Logging in for user " + userID);
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
function initRegistered(excludes) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _i, account;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in data.accounts)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    account = _a[_i];
                    if (account == "fp")
                        return [3, 3];
                    if (excludes === null || excludes === void 0 ? void 0 : excludes.includes(account))
                        return [3, 3];
                    return [4, login(account, ["", "",
                            data.accounts[account].user,
                            data.accounts[account].pass,
                            data.accounts[account].school])
                            .then(function (val) { return console.log("INFO: " + val); })];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    });
}
function deinitSessions(excludes) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _i, account;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in data.accounts)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    account = _a[_i];
                    if (account == "fp")
                        return [3, 3];
                    if (excludes === null || excludes === void 0 ? void 0 : excludes.includes(account))
                        return [3, 3];
                    return [4, logout(account)
                            .then(function (val) { return console.log("INFO: " + val); })];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    });
}
client.login(data.discord.token)
    .then(function () { return console.log("INFO: Started!"); })
    .catch(function (err) {
    if (err)
        console.error(err);
    else
        console.log("ERROR: Bot couldnt login!");
});
rl.question("Initialize accounts?", function (ans) {
    if (ans.match(/y/i) || ans.match(/yes/i))
        initRegistered().then(function () { return console.log("Done initializing!"); });
    else if (ans.match(/n/i) || ans.match(/No/i))
        return;
    else
        console.log("ERROR: Invalid choice!, use init to ask again.");
});
rl.on('line', function (line) {
    var command = line.toLowerCase().split(" ");
    switch (command[0]) {
        case "exit":
            console.log("INFO: Exiting....");
            if (command[1] == "logout")
                deinitSessions().then(function () {
                    console.log("Bye!");
                    process.exit(0);
                });
            else {
                console.log("Bye!");
                process.exit(0);
            }
        default: console.log("ERROR: Command not found!");
    }
});
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
                    console.log("INFO: " + val);
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
            case "ass":
                if (!data.sessions[message.author.id]) {
                    message.channel.send("Log in first! `sb login`");
                    break;
                }
                message.channel.startTyping();
                var msg_1 = '';
                getFromAPI(message.author.id, "assignments").then(function (path) {
                    var info = JSON.parse(fs_1.readFileSync(path).toString());
                    info.assignments.forEach(function (assignment) {
                        var result;
                        if (assignment.dueDate)
                            result = calcTime(assignment.dueDate, info.meta.serverTime, (command[2] == "all"));
                        else
                            result = "Due __without a time limit__";
                        if (assignment.meta.attachmentCount == 0
                            && assignment["studentAccessLevel"] == "E"
                            && result != undefined) {
                            if (msg_1.length > 1500) {
                                message.channel.send(msg_1);
                                msg_1 = '';
                            }
                            msg_1 += ("**" + assignment.name + "**: " + result + "\n\n");
                        }
                    });
                    message.channel.send(msg_1);
                }, console.log);
                message.channel.stopTyping();
                break;
            case "logout":
                message.channel.send("Logging out...");
                logout(message.author.id).then(function (val) { return message.channel.send(val); });
                break;
        }
    }
});
