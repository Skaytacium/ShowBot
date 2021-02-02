"use strict";
function tob64(string) {
    return Buffer.from(string).toString('base64');
}
function fromb64(string) {
    return Buffer.from(string, 'base64').toString('ascii');
}
function randarrval(array) {
    return array[array.length * Math.random() << 0];
}
function makefp(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}
function calctime(sub, server) {
    var s = (sub - server) / 1000;
    var pos = s > 0;
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
    return tempString;
}
