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
	"status": string,
	"creator": string,
	"studentAccessLevel": string,
	"studentAccessModifiedDateStamp": number,
	"lastStudentSubmission": number,
	"locked": boolean,
	"hasPremiumOwner": boolean
}

declare interface Discord {
	"token": string
}

declare interface Headers {
	"Host": "my.showbie.com",
	"Connection": "keep-alive",
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
	"Authorization": string,
	"x-showbie-clientapikey": string
}

declare interface Account {
	"user": string,
	"sbid": string,
	"pass": string,
	"school": string
}

declare interface Model {
	"accounts": {
		[id: string]: Account
	},
	"sessions": {
		[id: string]: Session
	},
	"kills": {
		[name: string]: string[]
	},
	"discord": Discord,
	"main": {
		"req": Headers,
		"schools": {
			[id: string]: string
		},
		"studentAccessLevel": {
			"A": "Assigned"
		  },
		  "status": {
			"E": "Editable",
			"R": "Readable",
			"L": "Locked"
		  }
	}
}