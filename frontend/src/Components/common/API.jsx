const host = "http://localhost:8080/api/"

const defaultHandler = () => { }

async function apiCallPost(endpoint, body, resultSuccessHandler = defaultHandler, resultFailureHandler = defaultHandler) {
	const options = {
		url: host + endpoint,
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body),
	}

	// const response = await fetch('http://localhost:8080/api/user/login/', options);
	console.log("succ0", host + endpoint)
	const response = await fetch(host + endpoint, options);

	if (response.status === 200) {
		console.log("succ1")
		console.log(response)
		response.json().then(resultSuccessHandler);
	} else {
		resultFailureHandler(response);
	}
};

async function apiCallGet(endpoint, resultSuccessHandler = defaultHandler, resultFailureHandler = defaultHandler) {
	const options = {
		url: host + endpoint,
		method: 'GET',
		credentials: 'include',
	}

	const response = await fetch(options);

	if (response.status === 200) {
		response.json().then(resultSuccessHandler);
	} else {
		resultFailureHandler(response);
	}
};

export function loginAPI(email, password, resultSuccessHandler, resultFailureHandler) {
	apiCallPost('user/login', { email: email, password: password }, resultSuccessHandler, resultFailureHandler);
};