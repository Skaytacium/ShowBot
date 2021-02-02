"use strict";
function getFromAPI(userID, filename, method) {
    if (method === void 0) { method = "GET"; }
    return new Promise(function (resolve, reject) {
        var req = request(baseURL + "/assignments", {
            "method": method,
            "headers": data.sessions[userID]
        }, function (res) {
            pipeline(res, createGunzip(), createWriteStream(dataPath + (filename + "." + userID + ".json")), function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    console.log("SUCCESS: Wrote to file " + filename + "." + userID + ".json");
                    resolve(dataPath + (filename + "." + userID + ".json"));
                }
            });
        });
        req.end();
    });
}
