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

// pop elem from arr if it is in there
function remove<A>(elem: A, arr: A[]) : A[] {
	const index = arr.indexOf(elem, 0);
	if (index > -1) {
		arr.splice(index, 1);
	}
	return arr
}

/// If it was originally undef, it will still be undef
export function removeMaybeUndefined<A>(item: A, maybeUndefined: A[]) : A[] {
	if (maybeUndefined) {
		return remove(item, maybeUndefined)
	} else {
		return maybeUndefined
	}
}
