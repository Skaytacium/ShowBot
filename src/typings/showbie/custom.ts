import { MessageEmbed } from "discord.js";

export declare interface SBCommand {
	base: string,
	det?: string,
	opts?: [{
		name: string,
		opt: boolean,
		base: string,
		det?: string
	}],
	get: (orig: string[]) => Promise<string | MessageEmbed>
}