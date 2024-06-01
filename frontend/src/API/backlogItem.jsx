import { apiCallPost } from "./Calls";

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
