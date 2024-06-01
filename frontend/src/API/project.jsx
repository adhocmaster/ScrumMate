import { apiCallGet, apiCallPost, apiCallPatch, apiCallDeleteWithoutReturn } from "./Calls";

export function projectRowDataAPI(resultSuccessHandler, resultFailureHandler) {
	apiCallGet('user/projectRowData', resultSuccessHandler, resultFailureHandler);
}

export function newProjectAPI(name, resultSuccessHandler, resultFailureHandler) {
	apiCallPost('project', { name }, resultSuccessHandler, resultFailureHandler);
}

export function projectUserListAPI(projectId, resultSuccessHandler, resultFailureHandler) {
	apiCallGet(`project/${projectId}/getMembers`, resultSuccessHandler, resultFailureHandler);
}

export function sendInviteAPI(fromProjectId, recipientEmail, resultSuccessHandler, resultFailureHandler) {
	apiCallPost(`project/${fromProjectId}/invite/${recipientEmail}`, {}, resultSuccessHandler, resultFailureHandler);
}

export function cancelInviteAPI(fromProjectId, recipientId, resultSuccessHandler, resultFailureHandler) {
	apiCallPost(`project/${fromProjectId}/cancelInvite/${recipientId}`, {}, resultSuccessHandler, resultFailureHandler);
}

export function kickUserAPI(fromProjectId, kickedUserId, resultSuccessHandler, resultFailureHandler) {
	apiCallPost(`project/${fromProjectId}/removeMember/${kickedUserId}`, {}, resultSuccessHandler, resultFailureHandler);
}

export function renameProjectAPI(projectId, name, resultSuccessHandler, resultFailureHandler) {
	apiCallPatch(`project/${projectId}`, { name }, resultSuccessHandler, resultFailureHandler);
}

export function deleteProjectAPI(projectId, resultSuccessHandler, resultFailureHandler) {
	apiCallDeleteWithoutReturn(`project/${projectId}`, resultSuccessHandler, resultFailureHandler);
}

