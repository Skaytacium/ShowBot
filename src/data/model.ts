import { jsonfr } from "../utils/data";
import { readdirSync, rmSync } from "fs";

export let data: Model;
const datapath = 'db/'

export function updateFiles(include?: string[]) {

    readdirSync(datapath).forEach(file => {
        const name: string[] = file.split(".");

        if (include != undefined && include.includes(name[0]) && name[1] == "json") {
            data[name[0]] = jsonfr<name>(datapath + file);
            console.log(`SUCCESS: Imported: ${file}`);
        }
        else if (include == undefined && name[1] == "json") {
            data[name[0]] = jsonfr(datapath + file);
            console.log(`SUCCESS: Imported: ${file}`);
        }
        else if (removeTemp && name[1] != "json") {
            rmSync(dataPath + file);
            console.log(`SUCCESS: Removed file ${file}`);
        }
    });
}