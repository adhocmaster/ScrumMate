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

	const [backlogItems, setBacklogItems] = useState([]); // copy this into the first index of columns and ordered

	function fetchBacklog() {
		var options = {
			method: "get",
			credentials: "include",
		};
		try {
			fetch(
				`http://localhost:8080/api/release/${releaseId}/backlog`,
				options
			).then((result) => {
				if (result.status === 200) {
					result.json().then((response) => {
						setBacklogItems(response.backlog);
					});
				} else {
					setBacklogItems([]);
				}
			});
		} catch { }
	}

	useEffect(() => {
		fetchBacklog();
	}, [releaseId]);

	useEffect(() => {
		// console.log('firing useeffect')
		// console.log(sprints)
		const sprintListObject = sprints.reduce((accumulator, sprint) => ({ ...accumulator, [sprint.sprintNumber]: sprint.todos }), {});
		const backlogAndSprints = {
			0: backlogItems,
			...sprintListObject,
		}
		// console.log("backlogAndSprints")
		// console.log(backlogAndSprints)
		setColumns(backlogAndSprints);
		setOrdered(Object.keys(backlogAndSprints));
		// console.log(Object.keys(backlogAndSprints))
		// console.log(Object.keys(backlogAndSprints)[0])
		// console.log([Object.keys(backlogAndSprints)[0]])
		// console.log(backlogAndSprints[Object.keys(backlogAndSprints)[0]])
		// console.log(columns)
		// console.log(ordered)
	}, [sprints, backlogItems]);

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
			releaseId,
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
								{ordered.slice(1).map((key, index) => (
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
					<Droppable
						droppableId="BACKLOG"
						type="BACKLOG"
						direction="vertical" // Change to vertical
						ignoreContainerClipping={Boolean(containerHeight)}
						isCombineEnabled={isCombineEnabled}
					>
						{(provided) => (
							<div ref={provided.innerRef} {...provided.droppableProps}>
								{[ordered[0]].map((key, index) => (
									<Column
										key={key}
										index={index}
										title={key}
										quotes={columns[key]}
										isScrollable={withScrollableColumns}
										isCombineEnabled={isCombineEnabled}
										useClone={useClone}
										disableDrag={true}
										backlogItems={backlogItems}
										setBacklogItems={setBacklogItems}
									/>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
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
