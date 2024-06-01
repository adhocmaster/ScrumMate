import { apiCallGet, apiCallPost } from "./Calls";

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

// export function projectRowDataAPI(resultSuccessHandler, resultFailureHandler) {
// 	apiCallGet(``, resultSuccessHandler, resultFailureHandler);
// }
