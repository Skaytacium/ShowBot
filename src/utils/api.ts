function makeTokenHeads(
    user: string,
    pass: string,
    school: string = "BHIS"): object {
    console.log(`INFO: Making token headers for user ${user} in ${school}`);
    const tempReq: any = data.main.req;

    tempReq["x-showbie-clientapikey"] = data.main.schools[school];
    tempReq["Authorization"] = `Basic ${tob64(`${user}:${pass}`)}`;
    tempReq["Content-Type"] = "application/json";

    return tempReq;
}

function makeAuthHeads(token: string, fp: string, school: string): object {
    console.log(`INFO: Making auth headers for user in ${school}`);
    const tempReq: any = data.main.req;

    tempReq["x-showbie-clientapikey"] = data.main.schools[school];
    tempReq["Authorization"] = `sbe token=${tob64(token)},fp=${tob64(fp)}`;
    tempReq["Content-Type"] = "application/json";

    return tempReq;
}

function createSessionEntry(headers: object, userID: string): void {
    data.sessions[userID] = headers;
    data.sessions[userID]["Content-Type"] = undefined;

    writeFileSync(dataPath + "sessions.json", JSON.stringify(data.sessions));
    updateFiles(["sessions"]);

    console.log(`SUCCESS: Created session for userID ${userID}`);
}