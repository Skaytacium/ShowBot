export function tob64(string: string) {
    return Buffer.from(string).toString('base64');
}

export function fromb64(string: string) {
    return Buffer.from(string, 'base64').toString('ascii');
}

export function ranval(array: any) {
    return array[array.length * Math.random() << 0];
}

export function makefp(length: number) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;

    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));

    return result;
}

export function ctime(sub: number, server: number) {
    const s = (sub - server) / 1000;
    const pos: boolean = s > 0;

    let tmpstr = '';
    const months = pos ? Math.floor(s / (3600 * 720)) : Math.ceil(s / (3600 * 720));
    const mdays = months * 30;

    const days = pos ? Math.floor(s / (3600 * 24)) - mdays : Math.ceil(s / (3600 * 24)) - mdays;
    const dhrs = (mdays + days) * 24;

    const hrs = pos ? Math.floor(s / 3600) - dhrs : Math.ceil(s / 3600) - dhrs;
    const hmins = (dhrs + hrs) * 60;

    const mins = pos ? Math.floor(s / 60) - hmins : Math.ceil(s / 60) - hmins;

    const times = {
        "months": months,
        "days": days,
        "hours": hrs,
        "minutes": mins
    }

    for (const time in times) //@ts-ignore
        if (times[time]) tmpstr += `${times[time] < 0 ? times[time] * -1 : times[time]} ${time} `;

    return tmpstr;
}