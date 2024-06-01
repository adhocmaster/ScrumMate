import { apiCallPost, apiCallGet } from "./Calls";

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

export function copyReleaseAPI(releaseId, resultSuccessHandler, resultFailureHandler) {
	apiCallPost(`release/${releaseId}/copy`, {}, resultSuccessHandler, resultFailureHandler);
}

export function getSignaturesAPI(releaseId, resultSuccessHandler, resultFailureHandler) {
	apiCallGet(`release/${releaseId}/signatures`, resultSuccessHandler, resultFailureHandler);
}
