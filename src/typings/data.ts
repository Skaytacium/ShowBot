//These are just representations of what happens in the .json files because I cannot import outside of rootDir
//which is src and I do not want to copy databases because that would be eh.

declare interface Dict<T> {
    [key: string]: T
}

declare interface STBAcc {
	"user": string,
	"pass": string,
	"school": string
}

declare interface Session {
	"token": string,
	"fp": string,
	"school": string
}

declare interface Discord {
	"token": string
}

interface Model {
	"accounts": Dict<STBAcc>,
	"sessions": Dict<Session>,
	"kills": Dict<string[]>,
	"discord": Discord,
	"main": {
		"prefix": string,
		"req": SBHeaders,
		"schools": Dict<string>,
		"studentAccessLevel": Assacclvl,
		"status": Asstatus,
		"pglen": number
	}
}