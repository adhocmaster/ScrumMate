import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Sprint from "./Sprint";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";


async function reorderFetch(releaseId, sprintStartIndex, sprintEndIndex, setItems) {
	fetch(`http://localhost:8080/api/release/${releaseId}/reorder`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ sprintStartIndex, sprintEndIndex })
	})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			setItems(data);
		})
		.catch(error => {
			;
		});
}

export default function DragList({ items, setItems, releaseId }) {
	// a little function to help us with reordering the result
	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};

	const grid = 4;

	const getItemStyle = (isDragging, draggableStyle) => ({
		// some basic styles to make the items look a bit nicer
		userSelect: "none",
		padding: grid * 2,
		margin: `0 0 ${grid}px 0`,

		// change background colour if dragging
		background: isDragging ? "lightgreen" : "grey",

		// styles we need to apply on draggables
		...draggableStyle
	});

	const getListStyle = isDraggingOver => ({
		background: isDraggingOver ? "lightblue" : "lightgrey",
		padding: grid,
		// width: 1000
	});

	const onDragEnd = (result) => {
		// dropped outside the list
		if (!result.destination) {
			return;
		}
		const items2 = reorder(
			items,
			result.source.index,
			result.destination.index
		);
		setItems(items2);
		reorderFetch(releaseId, result.source.index,
			result.destination.index, setItems);
	}

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	function handleDragEnd(event) {
		const { active, over } = event;

		if (active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.indexOf(active.id);
				const newIndex = items.indexOf(over.id);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<div>
				<SortableContext
					items={items}
					strategy={verticalListSortingStrategy}
				>
					{items.map((item, index) =>
						<div>
							<Sprint
								index={index}
								items={items}
								setItems={setItems}
								userStories={item.todos}
							/>
						</div>
					)}
				</SortableContext>
			</div>
		</DndContext >
	);
}
