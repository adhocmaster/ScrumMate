import { apiCallGet, apiCallPost, apiCallPostWithoutReturn } from "./Calls";

export function reorderBacklogItemAPI(
	sourceId,
	destinationId,
	sourceType,
	sourceRank,
	destinationType,
	destinationRank,
	resultSuccessHandler,
	resultFailureHandler
) {
	const body = {
		sourceType,
		sourceRank,
		destinationType,
		destinationRank,
	}
	apiCallPost(`backlogItem/${sourceId}/${destinationId}/reorder`, body, resultSuccessHandler, resultFailureHandler);
}

export function saveBacklogItemAPI(
	storyId,
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
	apiCallPost(`story/${storyId}/edit`, body, resultSuccessHandler, resultFailureHandler);
}

export function saveActionItemAPI(
	storyId,
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
	apiCallPost(`action/${storyId}/edit`, body, resultSuccessHandler, resultFailureHandler);
}

export function deleteBacklogItemAPI(storyId, resultSuccessHandler, resultFailureHandler) {
	apiCallPost(`backlogItem/${storyId}/delete`, {}, resultSuccessHandler, resultFailureHandler);
}

export function placePokerEstimateAPI(pokerId, estimate, resultSuccessHandler, resultFailureHandler) {
	apiCallPostWithoutReturn(`backlogItem/${pokerId}/poker`, { estimate }, resultSuccessHandler, resultFailureHandler);
}

export function getPokerInformationAPI(pokerId, resultSuccessHandler, resultFailureHandler) {
	apiCallGet(`backlogItem/${pokerId}/poker`, resultSuccessHandler, resultFailureHandler);
}