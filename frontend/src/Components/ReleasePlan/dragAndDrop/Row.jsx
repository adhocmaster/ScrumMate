import React from 'react';
import styled from '@xstyled/styled-components';
import { colors } from '@atlaskit/theme';
import { Draggable } from 'react-beautiful-dnd';
import QuoteList from '../styles/list';
import Title from '../styles/title';
import SprintOptions from '../SprintOptions'
import { Box, Divider, Typography } from '@mui/material';
import BacklogItemCreateButton from '../BacklogItemCreateButton';

const grid = 8;
const borderRadius = 2;

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: row;
  min-width: 100px;
  min-height: 252px;
  width: 100%; // Ensure it takes the full width
  flex-grow: 1; // Allow it to grow
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${({ isDragging }) =>
		isDragging ? colors.G50 : colors.N30};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${colors.G50};
  }
  width: 100;
`;

const Row = (props) => {
	const title = props.title;
	const quotes = props.quotes;
	const index = props.index;
	const lockPage = props.lockPage;
	const sprints = props.sprints;
	const setSprints = props.setSprints;
	const deleteStory = props.deleteStory;
	const setBacklogItems = props.setBacklogItems;
	const releaseId = props.releaseId;
	const projectId = props.projectId;

	return (
		<>
			<Draggable draggableId={title} index={index} direction="horizontal" isDragDisabled={lockPage}>
				{(provided, snapshot) => (
					<Container ref={provided.innerRef} {...provided.draggableProps}>
						<Header isDragging={snapshot.isDragging}>
							<Title
								isDragging={snapshot.isDragging}
								{...provided.dragHandleProps}
								aria-label={`${title} quote list`}
							>
								<Box
									sx={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<Box
										sx={{
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
											alignItems: "center",
											height: "100%",
											marginLeft: 2,
										}}
									>
										<Typography sx={{ marginTop: 2 }} fontSize={14}>
											{`Sprint ${index + 1}`}
										</Typography>
										{
											lockPage ? <></> :
												<>
													<BacklogItemCreateButton sprints={sprints} setSprints={setSprints} sprintIndex={index} />
													<SprintOptions
														sprints={sprints}
														setSprints={setSprints}
														setBacklogItems={setBacklogItems}
														index={index}
														projectId={projectId}
													/>
												</>
										}
										<Typography sx={{ marginBottom: 2 }} fontSize={14}>
											{quotes.reduce((accumulator, todo) => accumulator + (todo.name === 'Story' ? todo.size : 0), 0)} SP
										</Typography>
									</Box>
									<Box sx={{ height: "100%" }}>
										<Divider
											orientation="vertical"
											sx={{
												marginTop: "10px",
												marginLeft: "12px",
												backgroundColor: "rgba(0, 0, 0, 0.5)",
												width: "1.5px",
												height: "88%",
											}}
										/>
									</Box>
								</Box>
							</Title>
						</Header>
						<QuoteList
							listId={title}
							listType="QUOTE"
							style={{
								backgroundColor: snapshot.isDragging ? colors.G50 : null,
							}}
							quotes={quotes}
							internalScroll={props.isScrollable}
							isCombineEnabled={Boolean(props.isCombineEnabled)}
							useClone={Boolean(props.useClone)}
							lockPage={lockPage}
							sprints={sprints}
							setSprints={setSprints}
							sprintIndex={index}
							deleteStory={deleteStory}
						/>
					</Container >
				)
				}
			</Draggable >
		</>
	);
};

export default Row;
