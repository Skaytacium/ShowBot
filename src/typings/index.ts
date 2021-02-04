declare interface Assignment {
	"id": string,
	"links": {
		"folders": string
	},
	"meta": {
		"gradedCount": number,
		"attachmentCount": number,
		"premium": boolean,
		"fresh": boolean,
		"feedbackCount": number
	},
	"class": string,
	"topic": string,
	"name": string,
	"dueDate"?: number,
	"status": Asstatus,
	"creator": string,
	"studentAccessLevel": Assacclvl,
	"studentAccessModifiedDateStamp": number,
	"lastStudentSubmission": number,
	"locked": boolean,
	"hasPremiumOwner": boolean
}

declare interface Asstatus {
	"E": "Editable",
	"R": "Readable",
	"L": "Locked"
}

declare interface Assacclvl {
	"A": "Assigned"
}

declare interface Discord {
	"token": string
}

declare interface SBHeaders {
	"Host": "my.showbie.com",
	"Connection": "keep-alive",
	"Content-Type": "application/json",
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4343.0 Safari/537.36",
	"Accept": "application/json",
	"Accept-Encoding": "gzip",
	"Authorization": string,
	"x-showbie-clientapikey": string,
	"x-showbie-appversion": "4.30.0+c1d2e2ac",
	"x-showbie-device": "Chrome 89.0.4343.0 on Windows 10 64-bit",
	"x-showbie-os": "Windows 10",
	"x-showbie-devicetimezone": 0,
	"x-showbie-scale": 1
}

declare interface Session {
	"token": string,
	"fp": string,
	"school": string
}

declare interface STBAcc {
	"user": string,
	"pass": string,
	"school": string
}

declare interface Model {
	"accounts": {
		[id: string]: STBAcc
	},
	"sessions": {
		[id: string]: Session
	},
	"kills": {
		[name: string]: string[]
	},
	"discord": Discord,
	"main": {
		"req": SBHeaders,
		"schools": {
			[id: string]: string
		},
		"studentAccessLevel": Assacclvl,
		"status": Asstatus
	}
}