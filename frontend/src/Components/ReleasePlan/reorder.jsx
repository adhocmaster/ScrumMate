// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

export default reorder;

async function fetchReorderBacklogItem(
	sourceId,
	destinationId,
	sourceType,
	sourceRank,
	destinationType,
	destinationRank
) {
	fetch(`http://localhost:8080/api/backlogItem/${sourceId}/${destinationId}/reorder`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			sourceType: sourceType,
			sourceRank: sourceRank,
			destinationType: destinationType,
			destinationRank: destinationRank,
		}),
	})
		.then(() => {
			// console.log("done")
		})
		// .then((response) => response.json())
		// .then((data) => {
		// 	console.log(data);
		// 	setItems(data);
		// })
		.catch((error) => { });
}

export const reorderQuoteMap = ({ quoteMap, source, destination, sprints, releaseId }) => {
	// console.log("source", source)
	// console.log("destination", destination)

	// MUST update sprints

	const current = [...quoteMap[source.droppableId]];
	const next = [...quoteMap[destination.droppableId]];
	const target = current[source.index];

	const sourceRank = source.index;
	const destinationRank = destination.index;
	const sourceType = source.droppableId === '0' ? "backlog" : "sprint";
	const destinationType = destination.droppableId === '0' ? "backlog" : "sprint";
	var sourceBackendId, destinationBackendId;
	if (sourceType === "sprint") {
		sourceBackendId = sprints.find(sprint => `${sprint.sprintNumber}` === source.droppableId).id;
	} else {
		sourceBackendId = releaseId;
	}

	if (destinationType === "sprint") {
		destinationBackendId = sprints.find(sprint => `${sprint.sprintNumber}` === destination.droppableId).id;
	} else {
		destinationBackendId = releaseId;
	}

	// console.log("sourceBackendId", sourceBackendId)
	// console.log("sourceRank", sourceRank)
	// console.log("sourceType", sourceType)
	// console.log("destinationBackendId", destinationBackendId)
	// console.log("destRank", destinationRank)
	// console.log("destinationType", destinationType)

	fetchReorderBacklogItem(sourceBackendId, destinationBackendId, sourceType, sourceRank, destinationType, destinationRank)

	// moving to same list
	if (source.droppableId === destination.droppableId) {
		const reordered = reorder(current, source.index, destination.index);
		const result = {
			...quoteMap,
			[source.droppableId]: reordered
		};
		fetchReorderBacklogItem(sourceBackendId, destinationBackendId, sourceType, sourceRank, destinationType, destinationRank)
		return {
			quoteMap: result
		};
	}

	// moving to different list

	// remove from original
	current.splice(source.index, 1);
	// insert into next
	next.splice(destination.index, 0, target);

	const result = {
		...quoteMap,
		[source.droppableId]: current,
		[destination.droppableId]: next
	};

	return {
		quoteMap: result
	};
};

export function moveBetween({ list1, list2, source, destination }) {
	const newFirst = Array.from(list1.values);
	const newSecond = Array.from(list2.values);

	const moveFrom = source.droppableId === list1.id ? newFirst : newSecond;
	const moveTo = moveFrom === newFirst ? newSecond : newFirst;

	const [moved] = moveFrom.splice(source.index, 1);
	moveTo.splice(destination.index, 0, moved);

	return {
		list1: {
			...list1,
			values: newFirst
		},
		list2: {
			...list2,
			values: newSecond
		}
	};
}
