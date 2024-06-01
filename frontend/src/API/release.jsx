import { apiCallGet, apiCallPost } from "./Calls";

export function newBacklogStoryAPI(
	releaseId,
	userTypes,
	functionalityDescription,
	reasoning,
	acceptanceCriteria,
	storyPoints,
	priority,
	resultSuccessHandler,
	resultFailureHandler
) {
	const body = {
		userTypes,
		functionalityDescription,
		reasoning,
		acceptanceCriteria,
		storyPoints,
		priority,
	}
	apiCallPost(`release/${releaseId}`, body, resultSuccessHandler, resultFailureHandler);
}

// export function projectRowDataAPI(resultSuccessHandler, resultFailureHandler) {
// 	apiCallGet(``, resultSuccessHandler, resultFailureHandler);
// }
