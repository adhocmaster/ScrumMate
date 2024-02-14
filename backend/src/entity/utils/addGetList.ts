export function getMaybeUndefined<A>(maybeUndefined: A[]) : A[] {
	if (maybeUndefined) {
		return maybeUndefined
	} else {
		return []
	}
}

export function addMaybeUndefined<A>(item: A, maybeUndefined: A[]) : A[] {
	if (maybeUndefined) {
		maybeUndefined.push(item)
		return maybeUndefined
	} else {
		maybeUndefined = [item]
		return maybeUndefined
	}
}
