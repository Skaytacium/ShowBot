function getFromAPI(
    userID: string,
    filename: string,
    method: string = "GET"): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = request(
            baseURL + "/assignments",
            {
                "method": method,
                "headers": data.sessions[userID]
            }, res => {
                pipeline(
                    res,
                    createGunzip(),
                    createWriteStream(dataPath + `${filename}.${userID}.json`),
                    err => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            console.log(`SUCCESS: Wrote to file ${filename}.${userID}.json`);
                            resolve(dataPath + `${filename}.${userID}.json`);
                        }
                    }
                );
            });
        req.end();
    });
}