export class RegisterStaffModel {
	constructor(
		public email: string,
		public username: string,
		public password: string,
		public role: string
	) { }
}
