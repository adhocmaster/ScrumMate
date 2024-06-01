import { apiCallGet, apiCallPost } from "./Calls";

export function loginAPI(email, password, resultSuccessHandler, resultFailureHandler) {
	apiCallPost('user/login', { email, password }, resultSuccessHandler, resultFailureHandler);
};

export function registerAPI(username, email, password, resultSuccessHandler, resultFailureHandler) {
	apiCallPost('user/create', { username, email, password }, resultSuccessHandler, resultFailureHandler);
};

export function getUserIdAPI(resultSuccessHandler, resultFailureHandler) {
	apiCallGet('user', resultSuccessHandler, resultFailureHandler);
}

export function fetchNotificationsAPI(resultSuccessHandler, resultFailureHandler) {
	apiCallGet(`user/getInvites`, resultSuccessHandler, resultFailureHandler);
}

export function acceptInviteAPI(projectId, resultSuccessHandler, resultFailureHandler) {
	apiCallPost(`user/acceptInvite/${projectId}`, {}, resultSuccessHandler, resultFailureHandler);
};

export function rejectInviteAPI(projectId, resultSuccessHandler, resultFailureHandler) {
	apiCallPost(`user/rejectInvite/${projectId}`, {}, resultSuccessHandler, resultFailureHandler);
};