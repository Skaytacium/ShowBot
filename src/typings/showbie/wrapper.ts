declare interface SBErrors {
	"errors": [{
		"title": string,
		"code": string,
		"status": string | number
	}]
}

interface SBAssignment {
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
	"dueDate": number,
	"status": Asstatus,
	"creator": string,
	"studentAccessLevel": Assacclvl,
	"studentAccessModifiedDateStamp": number,
	"lastStudentSubmission": number,
	"locked": boolean,
	"hasPremiumOwner": boolean
}

interface SBClass {
	"id": string,
	"links": {
		"assignments": string,
		"permissions": string,
		"topics": string,
		"posts": string,
		"integrations": string
	},
	"meta": {
		"totalParents": number,
		"totalPosts": number,
		"totalAssignmentsCollected": number,
		"premium": boolean,
		"totalAssignmentsAssigned": number,
		"totalPending": number,
		"totalStudents": number,
		"totalOwners": number,
		"freshDiscussion": boolean,
		"fresh": boolean
	},
	"code": string,
	"teacherCount": number,
	"name": string,
	"studentCount": number
}