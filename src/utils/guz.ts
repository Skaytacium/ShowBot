import { createGunzip, createGzip } from 'zlib';

export function gun(quick?: Buffer | Uint8Array) {
    const dp = createGunzip();
    let buf: Buffer;

    dp.on('data', chunk => {
        if (buf) buf += chunk
        else buf = chunk;
    });
    dp.on('end', () => dp.emit('out', buf.toString()));

    if (quick) {
        return new Promise<string>((_res) => {
            dp.end(quick)
            dp.on('out', val => _res(val.toString()))
        });
    }

    else return dp;
}

export function gz(quick?: string) {
    const cp = createGzip();
    let buf: Buffer;

    cp.on('data', chunk => {
        if (buf) buf = Buffer.concat([buf, chunk])
        else buf = chunk;
    });
    cp.on('end', () => cp.emit('out', buf));

    if (quick) {
        return new Promise<Buffer>((_res) => {
            cp.end(quick);
            cp.on('out', _res)
        });
    }

    else return cp;
}