import { readFileSync, writeFileSync } from "fs";

export function jsonfr(filen: string) {
    return JSON.parse(readFileSync("db/" + filen + ".json").toString());
}

export function jsonto(filen: string, data: any) {
    writeFileSync("db/" + filen + ".json", JSON.stringify(data));
}