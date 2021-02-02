"use strict";
function login(userID, orig) {
    return new Promise(function (resolve) {
        if (data.sessions[userID]) {
            resolve("Session already exists for " + userID + ". Logout to delete the session.");
            return;
        }
        var tempFP = makefp(20);
        var options = {
            "method": "POST",
            "headers": makeTokenHeads(orig[2], orig[3], orig[4])
        };
        var req = request(baseURL + "/sessions", options, function (res) {
            console.log("INFO: Logging in for user " + userID);
            var reqData = '';
            res.on('data', function (chunk) { return reqData += chunk.toString(); });
            res.on('close', function () {
                reqData = JSON.parse(reqData);
                switch (('' + res.statusCode)[0]) {
                    case "4":
                        reqData.errors.forEach(function (err) {
                            resolve("**Error!**\n*Code:* " + err.status + "\n*Definition:* " + STATUS_CODES[err.status] + ".\n*Meaning:* " + err.title);
                        });
                        break;
                    case "2":
                        data.accounts[userID] = {};
                        data.accounts[userID].user = orig[2];
                        data.accounts[userID].pass = orig[3];
                        data.accounts[userID].school =
                            orig[4] == undefined ? "BHIS" : orig[4];
                        writeFileSync(dataPath + "accounts.json", JSON.stringify(data.accounts));
                        createSessionEntry(makeAuthHeads(reqData.session.token, tempFP, data.accounts[userID].school), userID);
                        resolve("Created session!");
                    default: resolve("Could not log in, try again later!");
                }
            });
        });
        req.write(JSON.stringify({
            "session": {
                "fingerprint": tempFP
            }
        }));
        req.end();
    });
}
function logout(userID) {
    updateFiles(["sessions"]);
    return new Promise(function (resolve) {
        if (data.sessions[userID]) {
            var sessionToken = fromb64((data.sessions[userID]["Authorization"])
                .split(",")[0].slice(10));
            request(baseURL + "/sessions/" + sessionToken, {
                "method": "DELETE",
                "headers": data.sessions[userID]
            }, function (res) {
                switch (('' + res.statusCode)[0]) {
                    case "4":
                        resolve("**Error!**\n*Code:* " + res.statusCode + "\n*Definition:* " + STATUS_CODES[res.statusCode] + ".");
                    case "2":
                        delete data.sessions[userID];
                        writeFileSync(dataPath + "sessions.json", JSON.stringify(data.sessions));
                        updateFiles(["sessions"]);
                        resolve("Logged out succesfully!");
                    default: resolve("Could not log out, try again later!");
                }
            }).end();
        }
        else
            resolve("No login found! Login first to logout.");
    });
}
