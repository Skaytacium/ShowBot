"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Make = void 0;
var core = __importStar(require("./core"));
var fs_1 = require("fs");
var Make = (function () {
    function Make(options) {
        this.mainData = options.mainData;
        this.sessionData = options.sessionData;
        this.dataPath = options.dataPath;
        this.school = options.school ? options.school : "BHIS";
    }
    Make.prototype.makeBearerHeads = function (options) {
        console.log("INFO: Making token headers for user " + options.user + " in " + this.school);
        var tempHeads = this.mainData.req;
        tempHeads["x-showbie-clientapikey"] = this.mainData.schools[this.school];
        tempHeads["Authorization"] = "Basic " + core.tob64(options.user + ":" + options.pass);
        tempHeads["Content-Type"] = "application/json";
        return tempHeads;
    };
    Make.prototype.makeTokenHeads = function (token, fp) {
        console.log("INFO: Making auth headers for user in " + this.school);
        var tempHeads = this.mainData.req;
        tempHeads["x-showbie-clientapikey"] = this.mainData.schools[this.school];
        tempHeads["Authorization"] = "sbe token=" + core.tob64(token) + ",fp=" + core.tob64(fp);
        tempHeads["Content-Type"] = "application/json";
        return tempHeads;
    };
    Make.prototype.createSessionEntry = function (headers, userID) {
        this.sessionData[userID] = headers;
        this.sessionData[userID]["Content-Type"] = undefined;
        fs_1.writeFileSync(this.dataPath + "sessions.json", JSON.stringify(this.sessionData));
        core.updateFiles(this.dataPath, ["sessions"]);
        console.log("SUCCESS: Created session for userID " + userID);
    };
    return Make;
}());
exports.Make = Make;
