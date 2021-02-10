import { createInterface } from "readline";
import { init, deinit } from "../api/seshman"

export const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    tabSize: 4,
    prompt: '',
    terminal: true
})

rl.question("Initialize accounts?   ", ans => {
    if (ans == ('y' || 'Y')) init();

    else return;
});

rl.on('line', (line: string) => {
    const command = line.toLowerCase().split(" ");

    switch (command[0]) {
        case "q":
            console.log("Bye.");
            process.exit(0);

        case "deinit":
            deinit();
            break;

        default: console.log("NF");
    }
});