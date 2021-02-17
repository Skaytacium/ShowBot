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
                .then(a => {
                    message.channel.send(a);
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
//             case "creds":
//                 if (!orig[3]) {
//                     message.channel.send("Enter your details!"); break;
//                 }
//                 if (orig[4] && !data.main.schools[orig[4]])
//                     message.channel.send("School not found.")

//                 message.channel.send("Logging in...");

//                 login(message.author.id, {
//                     user: orig[2],
//                     pass: orig[3],
//                     school: orig[4] == undefined ? "BHIS" : orig[4]
//                 })
//                     .then(message.channel.send)
//                     .catch(message.channel.send)

//                 break;

//             case "logout":
//                 message.channel.send("Logging out...");

//                 if (data.sessions[message.author.id])
//                     logout(message.author.id)
//                         .then(message.channel.send)
//                         .catch(message.channel.send)

//                 else message.channel.send("No login found. Login before logging out.");
//                 break;