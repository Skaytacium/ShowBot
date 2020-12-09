import discord from "discord.js"

const client = new discord.Client();
client
    .login()
    .then(() => console.log("Started."))
    .catch((err) => {
        if (err) console.error(err);
        else console.log("Couldn't Login.");
    });

client.on("message", (message) => {
    const orig: string[] = message.content.split(" ");
    const command: string[] = message.content.toLowerCase().split(" ");
    if (command[0] == "sb") {
        switch (command[1]) {
            case "assignments"
        }
    }
});
