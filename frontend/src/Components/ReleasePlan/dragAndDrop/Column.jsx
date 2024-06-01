import React from "react";
import styled from "@xstyled/styled-components";
import { colors } from "@atlaskit/theme";
import { Draggable } from "react-beautiful-dnd";
import QuoteList from "../styles/verticalList";
import Title from "../styles/title";
import {
	Typography,
} from "@mui/material";
import BacklogCreateButton from "../BacklogCreateButton";

const grid = 8;
const borderRadius = 2;

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  height: 0px;
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
`;

const Column = (props) => {
	const title = props.title;
	const quotes = props.quotes;
	const index = props.index;
	const lockPage = props.lockPage;
	const backlogItems = props.backlogItems;
	const setBacklogItems = props.setBacklogItems;
	const deleteStory = props.deleteStory;
	const releaseId = props.releaseId;

	return (
		<>
			<Typography
				variant="h6"
				marginLeft={2}
				textAlign={"left"}
				fontWeight="bold"
				fontSize={14}
			>
				Backlog
				{
					lockPage ?
						<></>
						:
						<BacklogCreateButton releaseId={releaseId} backlogItems={backlogItems} setBacklogItems={setBacklogItems} />
				}
			</Typography>

			<Draggable draggableId={title} index={index} isDragDisabled={true}>
				{(provided, snapshot) => (
					<Container ref={provided.innerRef} {...provided.draggableProps}>
						<Header isDragging={snapshot.isDragging}>
							<Title
								isDragging={snapshot.isDragging}
								{...provided.dragHandleProps}
								aria-label={`${title} quote list`}
							>
							</Title>
						</Header>
						<QuoteList
							listId={title}
							listType="QUOTE"
							style={{
								backgroundColor: snapshot.isDragging ? colors.G50 : null
							}}
							quotes={quotes}
							internalScroll={props.isScrollable}
							isCombineEnabled={Boolean(props.isCombineEnabled)}
							useClone={Boolean(props.useClone)}
							lockPage={lockPage}
							backlog={backlogItems}
							deleteStory={deleteStory}
						/>
					</Container>
				)}
			</Draggable>
		</>
	);
};

export default Column;
