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
	destinationRank,
	sprints,
	setSprints,
	backlogItems,
	setBacklogItems,
	sourceSprintNumber,
	destinationSprintNumber,
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
		.then((response) => {
			if (response.status !== 200) {
				console.log("Drag and drop error")
				return;
			}
			// console.log("Drag and drop success")
			return response.json();
		})
		.then((data) => {
			// console.log("going 0");
			console.log(data);
			const newSourceList = data[0];
			const newDestinationList = data[1];
			// console.log("going 0.5");
			// console.log(sprints)
			const sprintsCopy = [...sprints];
			// console.log(sprintsCopy)
			// console.log("going 0.6");
			// console.log(backlogItems)
			var backlogCopy = [...backlogItems];
			// console.log("going 1");

			if (sourceSprintNumber === 0) {
				backlogCopy = newSourceList;
			} else {
				const sourceSprintIndex = sourceSprintNumber - 1;
				// console.log("going 1.5");
				// console.log(sourceSprintNumber);
				// console.log(sourceSprintIndex);
				sprintsCopy[sourceSprintIndex].todos = newSourceList;
				// console.log("going 1.6");
			}
			// console.log("going 2");

			if (destinationSprintNumber === 0) {
				backlogCopy = newDestinationList;
			} else {
				const destinationSprintIndex = destinationSprintNumber - 1;
				sprintsCopy[destinationSprintIndex].todos = newDestinationList;
			}

			// console.log("backlogCopy is")
			// console.log(backlogCopy)
			// console.log("sprintsCopy is")
			// console.log(sprintsCopy)
			setSprints(sprintsCopy);
			setBacklogItems(backlogCopy);
		})
		.catch((error) => { });
}

export const reorderQuoteMap = ({ sprints, setSprints, backlogItems, setBacklogItems, source, destination, releaseId }) => {
	// console.log("source", source)
	// console.log("destination", destination)

	// droppableId is "0" if its backlog, else string(sprintNumber)
	// const currentList = source.droppableId === "0" ? [...backlog] : [...sprints[source.droppableId].todos];
	// const nextList = destination.droppableId === "0" ? [...backlog] : [...sprints[destination.droppableId].todos];
	// const itemToMove = currentList[source.index];

	const sprintsCopy = [...sprints]
	const backlogItemsCopy = [...backlogItems]

	const sourceRank = source.index;
	const destinationRank = destination.index;

	const sourceType = source.droppableId === '0' ? "backlog" : "sprint";
	const destinationType = destination.droppableId === '0' ? "backlog" : "sprint";

	var sourceBackendId, destinationBackendId;
	var sourceSprintNumber, destinationSprintNumber; // 0 if backlog, else sprint number
	var removedItem;
	if (sourceType === "sprint") {
		const sprintIndex = parseInt(source.droppableId) - 1;
		const sourceSprint = sprints[sprintIndex];
		sourceBackendId = sourceSprint.id;
		sourceSprintNumber = sourceSprint.sprintNumber;

		const [removed] = sprintsCopy[sprintIndex].todos.splice(sourceRank, 1);
		removedItem = removed;
	} else {
		sourceBackendId = releaseId;
		sourceSprintNumber = 0;

		const [removed] = backlogItemsCopy.splice(sourceRank, 1);
		removedItem = removed;
	}

	if (destinationType === "sprint") {
		const sprintIndex = parseInt(destination.droppableId) - 1;
		const destinationSprint = sprints[sprintIndex];
		destinationBackendId = destinationSprint.id;
		destinationSprintNumber = destinationSprint.sprintNumber;

		sprintsCopy[sprintIndex].todos.splice(destinationRank, 0, removedItem)
	} else {
		destinationBackendId = releaseId;
		destinationSprintNumber = 0;

		backlogItemsCopy.splice(destinationRank, 0, removedItem)
	}

	// console.log('fuckin backlog is ', backlogItems)
	// console.log('fuckin sourceSprintNumber is ', sourceSprintNumber)
	// console.log('fuckin destinationSprintNumber is ', destinationSprintNumber)

	// console.log("sourceBackendId", sourceBackendId)
	// console.log("sourceRank", sourceRank)
	// console.log("sourceType", sourceType)
	// console.log("destinationBackendId", destinationBackendId)
	// console.log("destRank", destinationRank)
	// console.log("destinationType", destinationType)

	setSprints(sprintsCopy);
	setBacklogItems(backlogItemsCopy);

	fetchReorderBacklogItem(sourceBackendId, destinationBackendId, sourceType, sourceRank, destinationType, destinationRank, sprints, setSprints, backlogItems, setBacklogItems, sourceSprintNumber, destinationSprintNumber)

	// moving to same list
	// if (source.droppableId === destination.droppableId) {
	// 	const reordered = reorder(current, source.index, destination.index);
	// 	const result = {
	// 		...quoteMap,
	// 		[source.droppableId]: reordered
	// 	};
	// 	fetchReorderBacklogItem(sourceBackendId, destinationBackendId, sourceType, sourceRank, destinationType, destinationRank)
	// 	return {
	// 		quoteMap: result
	// 	};
	// }

	// // moving to different list

	// // remove from original
	// current.splice(source.index, 1);
	// // insert into next
	// next.splice(destination.index, 0, target);

	// const result = {
	// 	...quoteMap,
	// 	[source.droppableId]: current,
	// 	[destination.droppableId]: next
	// };

	// return {
	// 	backlog: newBacklog,
	// 	sprints: newSprints
	// };
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
