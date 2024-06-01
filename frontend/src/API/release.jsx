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

export function newBacklogActionAPI(
	releaseId,
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
	apiCallPost(`release/${releaseId}/action`, body, resultSuccessHandler, resultFailureHandler);
}

export function getReleaseAPI(releaseId, resultSuccessHandler, resultFailureHandler) {
	apiCallGet(`release/${releaseId}`, resultSuccessHandler, resultFailureHandler);
}

export function editReleaseAPI(releaseId, problemStatement, goalStatement, resultSuccessHandler, resultFailureHandler) {
	apiCallPost(`release/${releaseId}/edit`, { problemStatement, goalStatement }, resultSuccessHandler, resultFailureHandler);
}

export function copyReleaseAPI(releaseId, resultSuccessHandler, resultFailureHandler) {
	apiCallPost(`release/${releaseId}/copy`, {}, resultSuccessHandler, resultFailureHandler);
}

export function getSignaturesAPI(releaseId, resultSuccessHandler, resultFailureHandler) {
	apiCallGet(`release/${releaseId}/signatures`, resultSuccessHandler, resultFailureHandler);
}

export function getBacklogAPI(releaseId, resultSuccessHandler, resultFailureHandler) {
	apiCallGet(`release/${releaseId}/backlog`, resultSuccessHandler, resultFailureHandler);
}

export function reorderSprintsAPI(releaseId, sprintStartIndex, sprintEndIndex, resultSuccessHandler, resultFailureHandler) {
	apiCallPost(`release/${releaseId}/reorder`, { sprintStartIndex, sprintEndIndex }, resultSuccessHandler, resultFailureHandler);
}

export function getSprintsAPI(releaseId, resultSuccessHandler, resultFailureHandler) {
	apiCallGet(`release/${releaseId}/sprints`, resultSuccessHandler, resultFailureHandler);
}

export function newSprintAPI(releaseId, sprintNumber, resultSuccessHandler, resultFailureHandler) {
	apiCallPost(`release/${releaseId}/sprint`, { sprintNumber }, resultSuccessHandler, resultFailureHandler);
}

export function toggleSigningAPI(releaseId, resultSuccessHandler, resultFailureHandler) {
	apiCallPost(`release/${releaseId}/toggleSign`, {}, resultSuccessHandler, resultFailureHandler);
}

export function getSigningConditionAPI(releaseId, resultSuccessHandler, resultFailureHandler) {
	apiCallGet(`release/${releaseId}/signingCondtion`, resultSuccessHandler, resultFailureHandler);
}
