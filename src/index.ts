import { rl } from './ui'
import { client, commands } from './commands'
rl;

client.on('message', message => {
    const command = message.content.toLowerCase().split(" ");

    if (command[0] == "sb" && command[1] in commands)
        commands[command[1]].get(message.content.split(" "))
            .then(val => message.channel.send(val))
            .catch(val => message.channel.send(val));
});

// client.on('message', message => {
//     const orig = message.content.split(" ");
//     const command = message.content.toLowerCase().split(" ");

//     if (command[0] == "sb   ")
//         switch (command[1]) {
//             case "login":
//                 if (data.accounts[message.author.id]) {
//                     if (data.sessions[message.author.id])
//                         message.channel.send("You have already logged in! To relogin, use:\n\
// `sb creds <username here> <password here> <optional school name(no spaces, default is BHIS)>`.");
//                     else {
//                         message.channel.send("Logging in...");

//                         login(
//                             message.author.id,
//                             data.accounts[message.author.id] as STBAcc
//                         )
//                             .then(message.channel.send)
//                             .catch(message.channel.send)
//                     }
//                     break;
//                 }
//                 message.channel.send("Check your DMs!");
//                 message.author.createDM().then(chan => {
//                     chan.send(
//                         "Welcome to ShowBot!\n\
// Type in the following command using your Showbie credentials without the `<` or `>`:\n\
// `sb creds <username here> <password here> <optional school name(no spaces, default is BHIS)>`\n\
// ShowBot **does not use your account for any other purposes.**\
// Due to the nature of open source software, it is recommended\
// that you **take out any private information from your Showbie account** before continuing.\
// ShowBot doesn't practice or encourage theft of credentials.\
// While you can use `sb creds` on a public server, it is **not recommended** due to obvious reasons."
//                     );
//                 });
//                 break;

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

//             case "kill":
//                 refresh(["kills"]);

//                 if (command[2] == "contribute") {
//                     message.channel.send("TODO")
//                 }
//                 else if (data.kills[command[2]])
//                     message.channel.send(ranval(data.kills[command[2]]));

//                 else message.channel.send("Who?");
//                 break;

//             case "ass":
//                 if (!data.sessions[message.author.id]) {
//                     message.channel.send("Log in first! `sb login`"); break;
//                 }
//                 message.channel.startTyping();
//                 let msg = '';

//                 sbreq(message.author.id, "assignments").then((info: any) => {

//                     info.assignments.forEach((assignment: any) => {
//                         let result: string | undefined;

//                         if (assignment.dueDate)
//                             result = ctime(assignment.dueDate, info.meta.serverTime);
//                         else result = "Due __without a time limit__";

//                         if (assignment.meta.attachmentCount == 0
//                             && assignment["studentAccessLevel"] == "E"
//                             && result != undefined) {

//                             if (msg.length > 1500) {
//                                 message.channel.send(msg);
//                                 msg = '';
//                             } msg += (`**${assignment.name}**: ${result}\n\n`);
//                         }
//                     });

//                     if (msg == '') message.channel.send("There are no pending assignments!\n\
// Use `sb ass all` to see overdue pending assignments.");

//                     message.channel.send(msg);
//                 }, console.log);

//                 message.channel.stopTyping();
//                 break;

//             case "help":

//                 break;

//             default:
//                 message.channel.send("Command not found. Use `sb help` to check available commands.");
//         }
// });