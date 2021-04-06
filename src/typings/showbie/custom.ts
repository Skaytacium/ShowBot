import { MessageEmbed } from "discord.js";

export declare interface SBCommandParams {
	orig: string[], //This is a bad way to provide parameter types, as it
	userid: string  //makes it globally available, but thats ok.
}
export declare interface SBCommand {
	base: string, //The basic summary of the command
	det?: string, //Detailed info about the command, soon to be added to specific command help
	opts?: {
		name: string, //Name of the parameter
		base: string, //Basic summary of the parameter
		opt?: boolean, //Is the parameter optional? Default is false
		det?: string //Detailed info about the parameter
	}[],
	//The function which returns a Promise which resolves or rejects to
	//an array of strings or MessageEmbeds(preferred).
	//If its just 1 message that you want to resolve, then resolve it with something
	//like resolve([message]). Make sure to use reject for
	//errors, as it has special formatting applied to it.
	get: (params: SBCommandParams) => Promise<(string | MessageEmbed)[]>
}
