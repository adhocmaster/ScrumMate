import { ParameterError } from "../../helpers/errors";

/// True if no parameters are null/undefined
export function verifyParameters(...options: any[]): void {
	const verified = options.every(item => (item != null) && (item !== undefined));
	if (!verified) {
		throw new ParameterError("Parameters are not all there")
	}
}