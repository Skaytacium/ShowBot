import fs from "fs";

export class Utils {
    private dataPath: string;
    public data: any = {};

    constructor(dataPath: string) {
        this.dataPath = dataPath;
        let tempJS: string = "";

        fs.readdirSync(dataPath).forEach((file) => {
            const name: string = file.split(".")[0];
            this.data[name] = JSON.parse(
                fs.readFileSync(this.dataPath + file).toString()
            );
        });
    }

    makeRequestData(school?: string) {
        let tempObj: any = {};
        tempObj = this.data.main.req;

        if (school)
            tempObj["x-showbie-clientapikey"] = this.data.main.schools.get(
                school
            );
        else
            tempObj["x-showbie-clientapikey"] = this.data.main.schools[
                this.data.main.schools.def
            ];

        return tempObj;
    }
}
