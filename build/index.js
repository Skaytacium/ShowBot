"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var fs_1 = require("fs");
var client = new discord_js_1.Client();
client.login(data.discord.token)
    .then(function () { return console.log("INFO: Started!"); })
    .catch(function (err) {
    if (err)
        console.error(err);
    else
        console.log("ERROR: Bot couldnt login!");
});
var dataPath = "data/";
var baseURL = "https://my.showbie.com/core";
var data = {};
updateFiles();
client.on("message", function (message) {
    var orig = message.content.split(" ");
    var command = message.content.toLowerCase().split(" ");
    if (command[0] == "sb") {
        switch (command[1]) {
            case "login":
                if (data.accounts[message.author.id]) {
                    if (data.sessions[message.author.id])
                        message.channel.send("You have already logged in! To relogin, use:\n\
 `sb creds <username here> <password here> <optional school name(no spaces, default is BHIS)>`.");
                    else
                        login(message.author.id, [data.accounts[message.author.id].user,
                            data.accounts[message.author.id].pass,
                            data.accounts[message.author.id].school]);
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
                updateFiles(["kills"]);
                if (command[2] == "contribute") {
                    message.channel.send("5 ");
                }
                else if (data.kills[command[2]])
                    message.channel.send(randarrval(data.kills[command[2]]));
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
                            result = calctime(assignment.dueDate, info.meta.serverTime);
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
                    if (msg_1 == '')
                        message.channel.send("There are no pending assignments!\n\
Use `sb ass all` to see overdue pending assignments.");
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
