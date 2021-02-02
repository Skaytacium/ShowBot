import { createInterface } from "readline";

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "sb> ",
    tabSize: 4
});

rl.question("Initialize accounts?", (ans: string) => {
    if (ans.match(/y/i) || ans.match(/yes/i)) initRegistered().then(() => console.log("Done initializing!"));
    else if (ans.match(/n/i) || ans.match(/No/i)) return;
    else console.log("ERROR: Invalid choice!, use init to ask again.");
});

rl.on('line', (line: string) => {
    // const orig: string[] = line.split(" ");
    const command: string[] = line.toLowerCase().split(" ");
    switch (command[0]) {
        case "exit":
            console.log("INFO: Exiting....");
            if (command[1] == "logout") deinitSessions().then(() => {
                console.log("Bye!");
                process.exit(0);
            }); else {
                console.log("Bye!");
                process.exit(0);
            }

        default: console.log("ERROR: Command not found!");
    }
});