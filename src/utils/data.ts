import { readFileSync, writeFileSync } from "fs";

export function jsonfr<T>(path: string) {
    return JSON.parse(readFileSync(path).toString()) as T;
}

export function jsonto(path: string, data: any) {
    writeFileSync(path, JSON.stringify(data));
}