import { apiCallPost, apiCallDeleteWithReturn } from "./Calls";

export function newSprintActionAPI(
	sprintId,
	actionType,
	description,
	priority,
	resultSuccessHandler,
	resultFailureHandler
) {
	const body = {
		actionType,
		description,
		priority,
	}
	apiCallPost(`sprint/${sprintId}/action`, body, resultSuccessHandler, resultFailureHandler);
}

export function newSprintStoryAPI(
	sprintId,
	userTypes,
	functionalityDescription,
	reasoning,
	acceptanceCriteria,
	priority,
	resultSuccessHandler,
	resultFailureHandler
) {
	const body = {
		userTypes,
		functionalityDescription,
		reasoning,
		acceptanceCriteria,
		priority,
	}
	apiCallPost(`sprint/${sprintId}`, body, resultSuccessHandler, resultFailureHandler);
}

export function editSprintAPI(
	sprintId,
	startDate,
	endDate,
	scrumMasterId,
	resultSuccessHandler,
	resultFailureHandler
) {
	const body = {
		startDate,
		endDate,
		scrumMasterId,
	}
	apiCallPost(`sprint/${sprintId}/edit`, body, resultSuccessHandler, resultFailureHandler);
}

export function deleteSprintAPI(sprintId, resultSuccessHandler, resultFailureHandler) {
	apiCallDeleteWithReturn(`sprint/${sprintId}`, resultSuccessHandler, resultFailureHandler);
}

