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
import { getBacklogAPI, newSprintAPI, reorderSprintsAPI } from '../../../API/release';
import { deleteBacklogItemAPI } from '../../../API/backlogItem';

const Container = styled.div`
  min-width: 88%; // Ensure it takes the full width of the viewport
  flex-direction: column; // Ensure items stack vertically
  align-items: stretch;   // Ensure items take the full width
`;

const Board = ({
	isCombineEnabled,
	sprints,
	setSprints,
	lockPage,
	useClone,
	containerHeight,
	withScrollableColumns,
	releaseId,
	projectId,
}) => {
	const [backlogItems, setBacklogItems] = useState([]); // copy this into the first index of columns and ordered

	function fetchBacklog() {
		const resultSuccessHandler = (response) => {
			setBacklogItems(response.backlog);
		}
		const resultFailureHandler = () => {
			setBacklogItems([]);
		}
		getBacklogAPI(releaseId, resultSuccessHandler, resultFailureHandler);
	}

	useEffect(() => {
		fetchBacklog();
	}, [releaseId]);

	async function fetchReorderSprints(releaseId, sprintStartIndex, sprintEndIndex, setItems) {
		reorderSprintsAPI(releaseId, sprintStartIndex, sprintEndIndex, setItems);
	}

	const deleteStory = (storyId) => {
		const resultSuccessHandler = (response) => {
			if (response[0] === 0) {
				setBacklogItems(response[1]);
			} else {
				const sprintsCopy = [...sprints];
				const sprintIndex = response[0] - 1;
				sprintsCopy[sprintIndex].todos = response[1];
				setSprints(sprintsCopy);
			}
		}
		deleteBacklogItemAPI(storyId, resultSuccessHandler);
	};

	function createNewSprints() {
		const resultSuccessHandler = (response) => {
			response = {
				...response,
				todos: [],
			}
			setSprints((prevSprints) => [...prevSprints, response]);
		}
		newSprintAPI(releaseId, sprints.length + 1, resultSuccessHandler);
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
									lockPage={lockPage}
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
										textAlign="left"
										fontWeight="bold"
										fontSize={14}
									>
										Sprints
										{
											lockPage ? <></> :
												<IconButton
													sx={{
														marginBottom: "3px",
													}}
													onClick={createNewSprints}
												>
													<AddCircleOutlineIcon fontSize="small" />
												</IconButton>
										}
									</Typography>
								</Grid>
								{sprints.map((sprint, index) =>
									<Row
										key={`${sprint.sprintNumber}`}
										index={index}
										title={`${sprint.sprintNumber}`}
										quotes={sprint.todos}
										isScrollable={withScrollableColumns}
										isCombineEnabled={isCombineEnabled}
										useClone={useClone}
										lockPage={lockPage}
										sprints={sprints}
										setSprints={setSprints}
										setBacklogItems={setBacklogItems}
										releaseId={releaseId}
										projectId={projectId}
										deleteStory={deleteStory}
									/>
								)}
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
