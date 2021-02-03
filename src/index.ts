import { client } from "./bot";

client.on('message', message => {
    const orig = message.content.split(" ");
    const command = message.content.toLowerCase().split(" ");

    switch (orig[0]) {
        case "login":
            if (data.accounts[message.author.id]) {
                if (data.sessions[message.author.id])
                    message.channel.send("You have already logged in! To relogin, use:\n\
`sb creds <username here> <password here> <optional school name(no spaces, default is BHIS)>`.");
                else login(
                    message.author.id,
                    [data.accounts[message.author.id].user,
                    data.accounts[message.author.id].pass,
                    data.accounts[message.author.id].school]
                );
                break;
            }
            message.channel.send("Check your DMs!");
            message.author.createDM().then(chan => {
                chan.send(
                    "Welcome to ShowBot!\n\
Type in the following command using your Showbie credentials:\n\
`sb creds <username here> <password here> <optional school name(no spaces, default is BHIS)>`\n\
ShowBot **does not use your account for any other purposes.**\
Due to the nature of open source software, it is recommended\
that you **take out any private information from your Showbie account** before continuing.\
ShowBot doesn't practice or encourage theft of credentials.\
While you can use `sb creds` on a public server, it is **not recommended** due to obvious reasons."
                );
            });
            break;
    }
});