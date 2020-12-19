"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcTime = exports.makeFP = exports.randomValue = exports.fromb64 = exports.tob64 = exports.updateFiles = void 0;
var fs_1 = require("fs");
function updateFiles(dataPath, include, removeTemp) {
    if (removeTemp === void 0) { removeTemp = true; }
    console.log("INFO: Updating files: " + (include == undefined ? "all" : include));
    var data = {};
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
exports.updateFiles = updateFiles;
function tob64(string) {
    console.log("INFO: Converting " + string + " to base64");
    return Buffer.from(string).toString('base64');
}
exports.tob64 = tob64;
function fromb64(string) {
    console.log("INFO: Converting " + string + " from base64");
    return Buffer.from(string, 'base64').toString('ascii');
}
exports.fromb64 = fromb64;
function randomValue(array) {
    console.log("INFO: Returning random value from " + array);
    return array[array.length * Math.random() << 0];
}
exports.randomValue = randomValue;
function makeFP(length) {
    console.log("INFO: Made a random fingerprint of length " + length);
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}
exports.makeFP = makeFP;
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
    var times = {
        "months": months,
        "days": days,
        "hours": hours,
        "minutes": minutes
    };
    for (var time in times)
        if (times[time])
            tempString += (times[time] < 0 ? times[time] * -1 : times[time]) + " " + time + " ";
    return "" + (pos ? "Due in  __" : "Overdue by  __") + tempString + "__";
}
exports.calcTime = calcTime;
