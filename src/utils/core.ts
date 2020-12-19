import { readdirSync, readFileSync, rmSync } from "fs"

export function updateFiles(dataPath: string, include?: string[], removeTemp: boolean = true): any {
    console.log(`INFO: Updating files: ${include == undefined ? `all` : include}`);
    let data: any = {};

    readdirSync(dataPath).forEach((file) => {
        const name: string[] = file.split(".");

        if (include != undefined && include.includes(name[0]) && name[1] == "json") {
            data[name[0]] = JSON.parse(readFileSync(dataPath + file).toString());
            console.log(`SUCCESS: Imported: ${file}`);
        }
        else if (include == undefined && name[1] == "json") {
            data[name[0]] = JSON.parse(readFileSync(dataPath + file).toString());
            console.log(`SUCCESS: Imported: ${file}`);
        }
        else if (removeTemp && name[1] != "json") {
            rmSync(dataPath + file);
            console.log(`SUCCESS: Removed file ${file}`);
        }
    });
}

export function tob64(string: string): string {
    console.log(`INFO: Converting ${string} to base64`);
    return Buffer.from(string).toString('base64');
}

export function fromb64(string: string): string {
    console.log(`INFO: Converting ${string} from base64`);
    return Buffer.from(string, 'base64').toString('ascii');
}

export function randomValue(array: any): string {
    console.log(`INFO: Returning random value from ${array}`);
    return array[array.length * Math.random() << 0];
}

export function makeFP(length: number): string {
    console.log(`INFO: Made a random fingerprint of length ${length}`);

    let result: string = '';
    let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength: number = characters.length;

    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));

    return result;
}

export function calcTime(sub: number, server: number, overdue: boolean = false): string | undefined {
    const s = (sub - server) / 1000;
    const pos: boolean = s > 0;
    if (!overdue && !pos) return;

    let tempString: string = '';
    const months: number = pos ? Math.floor(s / (3600 * 720)) : Math.ceil(s / (3600 * 720));
    const monthdays: number = months * 30;

    const days: number = pos ? Math.floor(s / (3600 * 24)) - monthdays : Math.ceil(s / (3600 * 24)) - monthdays;
    const dayhours: number = (monthdays + days) * 24;

    const hours: number = pos ? Math.floor(s / 3600) - dayhours : Math.ceil(s / 3600) - dayhours;
    const hourminutes: number = (dayhours + hours) * 60;

    const minutes: number = pos ? Math.floor(s / 60) - hourminutes : Math.ceil(s / 60) - hourminutes;

    const times: object = {
        "months": months,
        "days": days,
        "hours": hours,
        "minutes": minutes
    }

    for (const time in times) //@ts-ignore
        if (times[time]) tempString += `${times[time] < 0 ? times[time] * -1 : times[time]} ${time} `;

    return `${pos ? "Due in  __" : "Overdue by  __"}${tempString}__`;
}