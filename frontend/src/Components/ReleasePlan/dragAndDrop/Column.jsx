import React from "react";
import styled from "@xstyled/styled-components";
import { colors } from "@atlaskit/theme";
import { Draggable } from "react-beautiful-dnd";
import QuoteList from "../styles/verticalList";
import Title from "../styles/title";

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
	const backlogItems = props.backlogItems;
	const deleteStory = props.deleteStory;
	// const setBacklogItems = props.setBacklogItems;

	return (
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
						backlog={backlogItems}
						deleteStory={deleteStory}
					/>
				</Container>
			)}
		</Draggable>
	);
};

export default Column;
