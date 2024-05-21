import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Row from './Row';
import Column from './Column';
import reorder, { reorderQuoteMap } from '../reorder';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Box } from "@mui/material";
import styled, { order } from "@xstyled/styled-components";
import { colors } from "@atlaskit/theme";

const Container = styled.div`
  background-color: ${colors.B100};
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

const Board = ({
	isCombineEnabled,
	sprints,
	setSprints,
	useClone,
	containerHeight,
	withScrollableColumns,
	releaseId,
}) => {
	const [columns, setColumns] = useState({});
	const [ordered, setOrdered] = useState([]);

	useEffect(() => {
		// console.log('firing useeffect')
		// console.log(sprints)
		const sprintListObject = sprints.reduce((accumulator, sprint) => ({ ...accumulator, [sprint.sprintNumber]: sprint.todos }), {})
		setColumns(sprintListObject);
		setOrdered(Object.keys(sprintListObject));
		// console.log(columns)
		// console.log(ordered)
	}, [sprints]);

	// const setSprintsAndColumnsAndOrdered = (newSprints) => {
	// 	setSprints(newSprints);
	// 	const sprintListObject = newSprints.reduce((accumulator, sprint) => ({ ...accumulator, [sprint.sprintNumber]: sprint.todos }), {})
	// 	setColumns(sprintListObject);
	// 	setOrdered(Object.keys(sprintListObject));
	// }

	async function fetchReorderSprints(
		releaseId,
		sprintStartIndex,
		sprintEndIndex,
		setItems
	) {
		fetch(`http://localhost:8080/api/release/${releaseId}/reorder`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ sprintStartIndex, sprintEndIndex }),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setItems(data);
			})
			.catch((error) => { });
	}

	const onDragEnd = (result) => {
		if (result.combine) {
			if (result.type === 'COLUMN') {
				const shallow = [...ordered];
				shallow.splice(result.source.index, 1);
				setOrdered(shallow);
				return;
			}

			const column = columns[result.source.droppableId];
			const withQuoteRemoved = [...column];

			withQuoteRemoved.splice(result.source.index, 1);

			const orderedColumns = {
				...columns,
				[result.source.droppableId]: withQuoteRemoved,
			};
			setColumns(orderedColumns);
			return;
		}

		// dropped nowhere
		if (!result.destination) {
			return;
		}

		const source = result.source;
		const destination = result.destination;

		// did not move anywhere - can bail early
		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		) {
			return;
		}

		// reordering column
		if (result.type === 'COLUMN') {
			const reorderedorder = reorder(ordered, source.index, destination.index);

			setOrdered(reorderedorder);

			fetchReorderSprints(releaseId, source.index, destination.index, setSprints);

			return;
		}

		const data = reorderQuoteMap({
			quoteMap: columns,
			source,
			destination,
			sprints,
		});

		setColumns(data.quoteMap);
	};

	return (
		<>
			<DragDropContext onDragEnd={onDragEnd}>
				<Box display="flex">
					<Droppable
						droppableId="board"
						type="COLUMN"
						direction="vertical" // Change to vertical
						ignoreContainerClipping={Boolean(containerHeight)}
						isCombineEnabled={isCombineEnabled}
					>
						{(provided) => (
							<div ref={provided.innerRef} {...provided.droppableProps}>
								{ordered.map((key, index) => (
									<Row
										key={key}
										index={index}
										title={key}
										quotes={columns[key]}
										isScrollable={withScrollableColumns}
										isCombineEnabled={isCombineEnabled}
										useClone={useClone}
										sprints={sprints}
										setSprints={setSprints}
									/>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
					{/* <Droppable
						droppableId="BACKLOG"
						type="BACKLOG"
						direction="vertical" // Change to vertical
						ignoreContainerClipping={Boolean(containerHeight)}
						isCombineEnabled={isCombineEnabled}
					>
						{(provided) => (
							<div ref={provided.innerRef} {...provided.droppableProps}>
								{ordered.slice(-1).map((key, index) => (
									<Column
										key={key}
										index={3}
										title={key}
										quotes={columns[key]}
										isScrollable={withScrollableColumns}
										isCombineEnabled={isCombineEnabled}
										useClone={useClone}
										disableDrag={true}
									/>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable> */}
				</Box>
			</DragDropContext>
		</>
	);
};

Board.defaultProps = {
	isCombineEnabled: false,
};

Board.propTypes = {
	isCombineEnabled: PropTypes.bool,
};

export default Board;
