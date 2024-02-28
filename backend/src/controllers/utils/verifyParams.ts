/// True if no parameters are null/undefined
export function verifyParameters(...options: any[]): boolean {
	return options.every(item => (item != null) && (item != undefined))
}