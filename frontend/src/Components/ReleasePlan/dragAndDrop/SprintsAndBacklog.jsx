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
				if (result[0] === 0) {
					setBacklogItems(result[1]);
				} else {
					const sprintsCopy = [...sprints];
					const sprintIndex = result[0] - 1;
					sprintsCopy[sprintIndex].todos = result[1];
					setSprints(sprintsCopy);
				}
			}).catch((error) => console.log("error deleting story"));
	};

	function createNewSprints() {
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
					return result.json();
				}
			})
			.then((response) => {
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
			const reorderedSprints = reorder(sprints, source.index, destination.index);

			setSprints(reorderedSprints);

			fetchReorderSprints(releaseId, source.index, destination.index, setSprints);

			return;
		}

		reorderQuoteMap({
			sprints, setSprints,
			backlogItems, setBacklogItems,
			source,
			destination,
			releaseId,
		});
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
								<Column
									key={"0"}
									index={0}
									title={"0"}
									quotes={backlogItems}
									isScrollable={withScrollableColumns}
									isCombineEnabled={isCombineEnabled}
									useClone={useClone}
									disableDrag={true}
									backlogItems={backlogItems}
									setBacklogItems={setBacklogItems}
									releaseId={releaseId}
									deleteStory={deleteStory}
								/>
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
								{sprints.map((sprint, index) => (
									<Row
										key={`${sprint.sprintNumber}`}
										index={index}
										title={`${sprint.sprintNumber}`}
										quotes={sprint.todos}
										isScrollable={withScrollableColumns}
										isCombineEnabled={isCombineEnabled}
										useClone={useClone}
										sprints={sprints}
										setSprints={setSprints}
										setBacklogItems={setBacklogItems}
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
