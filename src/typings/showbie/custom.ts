import { MessageEmbed } from "discord.js";

export declare interface SBCommandParams {
	orig: string[], //This is a bdd way to provide parameter types, as it
	userid: string //makes it globally available, but thats ok.
}
export declare interface SBCommand {
	base: string,
	det?: string,
	opts?: {
		name: string,
		base: string,
		opt?: boolean,
		det?: string
	}[],
	get: (params: SBCommandParams) => Promise<string | MessageEmbed>
}