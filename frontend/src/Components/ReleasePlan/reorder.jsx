import { reorderBacklogItemAPI } from "../../API/backlogItem";

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
	const resultSuccessHandler = (result) => {
		const newSourceList = result[0];
		const newDestinationList = result[1];
		const sprintsCopy = [...sprints];
		var backlogCopy = [...backlogItems];

		if (sourceSprintNumber === 0) {
			backlogCopy = newSourceList;
		} else {
			const sourceSprintIndex = sourceSprintNumber - 1;
			sprintsCopy[sourceSprintIndex].todos = newSourceList;
		}

		if (destinationSprintNumber === 0) {
			backlogCopy = newDestinationList;
		} else {
			const destinationSprintIndex = destinationSprintNumber - 1;
			sprintsCopy[destinationSprintIndex].todos = newDestinationList;
		}

		setSprints(sprintsCopy);
		setBacklogItems(backlogCopy);
	}
	reorderBacklogItemAPI(sourceId, destinationId, sourceType, sourceRank,
		destinationType, destinationRank, resultSuccessHandler
	)
}

export const reorderQuoteMap = ({ sprints, setSprints, backlogItems, setBacklogItems, source, destination, releaseId }) => {
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

	setSprints(sprintsCopy);
	setBacklogItems(backlogItemsCopy);

	fetchReorderBacklogItem(sourceBackendId, destinationBackendId, sourceType, sourceRank, destinationType, destinationRank, sprints, setSprints, backlogItems, setBacklogItems, sourceSprintNumber, destinationSprintNumber)
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
