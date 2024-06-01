const host = "http://localhost:8080/api/"

const defaultSuccessHandler = () => { }
const defaultFailureHandler = (response) => { console.log("API Call error:", response) }

const postOptions = (body) => {
	const options = {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body),
	}
	return options
}

const getOptions = () => {
	const options = {
		method: 'GET',
		credentials: 'include',
	}
	return options;
}

const patchOptions = (body) => {
	const options = {
		method: 'PATCH',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body),
	}
	return options
}

const deleteOptions = () => {
	const options = {
		method: 'DELETE',
		credentials: 'include',
	}
	return options;
}

async function apiCall(endpoint, options, resultSuccessHandler = defaultSuccessHandler, resultFailureHandler = defaultFailureHandler) {
	const response = await fetch(host + endpoint, options);
	if (response.status === 200) {
		response.json().then(responseJSON => resultSuccessHandler(responseJSON));
	} else {
		resultFailureHandler(response);
	}
};

export async function apiCallPost(endpoint, body, resultSuccessHandler, resultFailureHandler) {
	await apiCall(endpoint, postOptions(body), resultSuccessHandler, resultFailureHandler);
}

export async function apiCallGet(endpoint, resultSuccessHandler, resultFailureHandler) {
	await apiCall(endpoint, getOptions(), resultSuccessHandler, resultFailureHandler);
}

export async function apiCallPatch(endpoint, body, resultSuccessHandler, resultFailureHandler) {
	await apiCall(endpoint, patchOptions(body), resultSuccessHandler, resultFailureHandler);
}

export async function apiCallDeleteWithReturn(endpoint, resultSuccessHandler, resultFailureHandler) {
	await apiCall(endpoint, deleteOptions(), resultSuccessHandler, resultFailureHandler);
}

export async function apiCallDeleteWithoutReturn(endpoint, resultSuccessHandler = defaultSuccessHandler, resultFailureHandler = defaultFailureHandler) {
	const response = await fetch(host + endpoint, deleteOptions());
	if (response.status === 200) {
		resultSuccessHandler();
	} else {
		resultFailureHandler(response);
	}
}
