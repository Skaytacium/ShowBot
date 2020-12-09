import fs from "fs";
import https from "https";
import {
    Worker,
    MessageChannel,
    MessagePort,
    parentPort,
} from "worker_threads";

class Utils {
    private dataPath: string;
    public data: any = {};

    constructor(dataPath: string) {
        this.dataPath = dataPath;

        fs.readdirSync(dataPath).forEach((file) => {
            const name: string = file.split(".")[0].toString();
            this.data[name] = JSON.parse(fs.readFileSync(this.dataPath + file).toString());
        });
    }
}
