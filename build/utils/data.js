"use strict";
function updateFiles(include, removeTemp) {
    if (removeTemp === void 0) { removeTemp = true; }
    console.log("INFO: Updating files: " + (include == undefined ? "all" : include));
    readdirSync(dataPath).forEach(function (file) {
        var name = file.split(".");
        if (include != undefined && include.includes(name[0]) && name[1] == "json") {
            data[name[0]] = JSON.parse(readFileSync(dataPath + file).toString());
            console.log("SUCCESS: Imported: " + file);
        }
        else if (include == undefined && name[1] == "json") {
            data[name[0]] = JSON.parse(readFileSync(dataPath + file).toString());
            console.log("SUCCESS: Imported: " + file);
        }
        else if (removeTemp && name[1] != "json") {
            rmSync(dataPath + file);
            console.log("SUCCESS: Removed file " + file);
        }
    });
}
