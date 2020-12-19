import * as core from "./core";
import { writeFileSync } from "fs";

export class Make {
    private mainData: any;
    private sessionData: any;
    private dataPath: string;
    public school;

    constructor(options: {
        mainData: any,
        sessionData: any,
        dataPath: string,
        school: string | undefined
    }) {
        this.mainData = options.mainData;
        this.sessionData = options.sessionData;
        this.dataPath = options.dataPath;
        this.school = options.school ? options.school : "BHIS";
    }

    makeBearerHeads(options: {
        user: string,
        pass: string
    }): object {
        console.log(`INFO: Making token headers for user ${options.user} in ${this.school}`);
        const tempHeads: any = this.mainData.req;

        tempHeads["x-showbie-clientapikey"] = this.mainData.schools[this.school];
        tempHeads["Authorization"] = `Basic ${core.tob64(`${options.user}:${options.pass}`)}`;
        tempHeads["Content-Type"] = "application/json";

        return tempHeads;
    }

    makeTokenHeads(token: string, fp: string): object {
        console.log(`INFO: Making auth headers for user in ${this.school}`);
        const tempHeads: any = this.mainData.req;

        tempHeads["x-showbie-clientapikey"] = this.mainData.schools[this.school];
        tempHeads["Authorization"] = `sbe token=${core.tob64(token)},fp=${core.tob64(fp)}`;
        tempHeads["Content-Type"] = "application/json";

        return tempHeads;
    }

    createSessionEntry(headers: object, userID: string): void {
        this.sessionData[userID] = headers;
        this.sessionData[userID]["Content-Type"] = undefined;

        writeFileSync(this.dataPath + "sessions.json", JSON.stringify(this.sessionData));
        core.updateFiles(this.dataPath, ["sessions"]);

        console.log(`SUCCESS: Created session for userID ${userID}`);
    }
}