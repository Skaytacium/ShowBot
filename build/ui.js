"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline_1 = require("readline");
var rl = readline_1.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "sb> ",
    tabSize: 4
});
rl.question("Initialize accounts?", function (ans) {
    if (ans.match(/y/i) || ans.match(/yes/i))
        initRegistered().then(function () { return console.log("Done initializing!"); });
    else if (ans.match(/n/i) || ans.match(/No/i))
        return;
    else
        console.log("ERROR: Invalid choice!, use init to ask again.");
});
rl.on('line', function (line) {
    var command = line.toLowerCase().split(" ");
    switch (command[0]) {
        case "exit":
            console.log("INFO: Exiting....");
            if (command[1] == "logout")
                deinitSessions().then(function () {
                    console.log("Bye!");
                    process.exit(0);
                });
            else {
                console.log("Bye!");
                process.exit(0);
            }
        default: console.log("ERROR: Command not found!");
    }
});
