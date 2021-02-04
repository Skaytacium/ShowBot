import { data, refresh } from '../data'
import { jsonto } from '../utils/data'

export function bschead(acc: STBAcc) {
    const basheaders = data.main.req;

    basheaders["x-showbie-clientapikey"] = data.main.schools[acc.school];
    basheaders["Authorization"] = `Basic ${tob64(`${acc.user}:${acc.pass}`)}`;

    return basheaders;
}

export function tknhead(session: Session) {
    let tknheaders = data.main.req;

    tknheaders["x-showbie-clientapikey"] = data.main.schools[session.school];
    tknheaders["Authorization"] = `sbe token=${tob64(session.token)},fp=${tob64(session.fp)}`;

    return tknheaders;
}

export function wsession(session: Session, userID: string) {
    data.sessions[userID] = session;

    jsonto("sessions", data.sessions);
    refresh(['sessions']);
}