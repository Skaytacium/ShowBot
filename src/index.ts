import { basembed, client, commands } from './commands'
import { data } from './data'
import { init, deinit } from "./api/seshman"

process.stdin.on('data', raw => {
    const line = raw.toString().trim()
    const command = line.toLowerCase().split(" ")

    switch (command[0]) {
        case "i":
            init();
            break;

        case "q":
            console.log("Bye.");
            process.exit(0);

        case "d":
            deinit();
            break;

        default: console.log("NF");
    }
});

client.on('message', message => {
    const command = message.content.toLowerCase().split(" ");

    let orig = message.content.split(" ")
    orig.splice(0, 2);

    if (command[0] == data.main.prefix) {
        message.channel.startTyping();

        if (command[1] in commands)
            commands[command[1]].get({
                orig: orig,
                userid: message.author.id
            })
                .then(a => { //@ts-ignore no no this is fine, **i think**
                    a.forEach(b => message.channel.send(b));
                    message.channel.stopTyping();
                })
                .catch(a => {
                    message.channel.send(a);
                    message.channel.stopTyping();
                });

        else {
            message.channel.send(basembed.setTitle("Command not found."))
            message.channel.stopTyping();
        }
    }
});