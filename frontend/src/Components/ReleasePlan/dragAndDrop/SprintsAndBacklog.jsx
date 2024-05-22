import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Row from './Row';
import Column from './Column';
import reorder, { reorderQuoteMap } from '../reorder';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Box, Grid, Typography, IconButton } from "@mui/material";
import styled, { order, width } from "@xstyled/styled-components";
import { colors } from "@atlaskit/theme";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Container = styled.div`
  min-width: 88%; // Ensure it takes the full width of the viewport
  flex-direction: column; // Ensure items stack vertically
  align-items: stretch;   // Ensure items take the full width
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

	// TODO: Kinda buggy with dnd...
	// not updating correctly? duplicated id??? showing up in next sprint??
	//	Is it because it was declared with a certain sprint number?
	// also need to handle release... diff function? 
	const deleteStory = (storyId) => {
		fetch(`http://localhost:8080/api/backlogItem/${storyId}/delete`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		})
			.then((response) => response.json())
			.then((result) => {
				setSprints((currentItems) => {
					const updatedItems = [...currentItems];
					const sprintIndex = updatedItems.findIndex(s => s.todos.some(t => t.id === storyId));
					if (sprintIndex !== -1) {
						updatedItems[sprintIndex].todos = result;
						// updatedItems[sprintIndex].todos = updatedItems[sprintIndex].todos.filter(todo => todo.id !== storyId)
					}
					return updatedItems;
				});
			}).catch((error) => console.log("error deleting story"));
	};

	function createNewSprints() {
		console.log("creating new");
		var options = {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ sprintNumber: sprints.length + 1 }),
		};

		fetch(`http://localhost:8080/api/release/${releaseId}/sprint`, options)
			.then((result) => {
				if (result.status === 200) {
					console.log(result);
				}
				console.log(result);
				return result.json();
			})
			.then((response) => {
				console.log(response);
				response = {
					...response,
					todos: [],
				}
				setSprints((prevSprints) => [...prevSprints, response]);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
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
										releaseId={releaseId}
										deleteStory={deleteStory}
									/>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
					<Droppable
						droppableId="board"
						type="COLUMN"
						direction="vertical" // Change to vertical
						ignoreContainerClipping={Boolean(containerHeight)}
						isCombineEnabled={isCombineEnabled}
					>
						{(provided) => (
							<Container ref={provided.innerRef} {...provided.droppableProps} >
								<Grid item xs={15}>
									<Typography
										marginLeft={1}
										maxRows={4}
										textAlign="left"
										fontWeight="bold"
										fontSize={14}
									>
										Sprints
										<IconButton
											sx={{
												marginBottom: "3px",
											}}
											onClick={createNewSprints}
										>
											<AddCircleOutlineIcon fontSize="small" />
										</IconButton>
									</Typography>
								</Grid>
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
										releaseId={releaseId}
										deleteStory={deleteStory}
									/>
								))}
								{provided.placeholder}
							</Container>
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
