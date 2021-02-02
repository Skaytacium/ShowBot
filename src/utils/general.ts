function tob64(string: string) {
    return Buffer.from(string).toString('base64');
}

function fromb64(string: string) {
    return Buffer.from(string, 'base64').toString('ascii');
}

function randarrval(array: any) {
    return array[array.length * Math.random() << 0];
}

function makefp(length: number) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;

    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));

    return result;
}

function calctime(sub: number, server: number) {
    const s = (sub - server) / 1000;
    const pos = s > 0;

    let tempString = '';
    const months = pos ? Math.floor(s / (3600 * 720)) : Math.ceil(s / (3600 * 720));
    const monthdays = months * 30;

    const days = pos ? Math.floor(s / (3600 * 24)) - monthdays : Math.ceil(s / (3600 * 24)) - monthdays;
    const dayhours = (monthdays + days) * 24;

    const hours = pos ? Math.floor(s / 3600) - dayhours : Math.ceil(s / 3600) - dayhours;
    const hourminutes = (dayhours + hours) * 60;

    const minutes = pos ? Math.floor(s / 60) - hourminutes : Math.ceil(s / 60) - hourminutes;

    const times = {
        "months": months,
        "days": days,
        "hours": hours,
        "minutes": minutes
    }

    for (const time in times) //@ts-ignore ITS LITERALLY THE KEY FROM THE OBJECT WHAT HUH?
        if (times[time]) tempString += `${times[time] < 0 ? times[time] * -1 : times[time]} ${time} `;

    return tempString;
}