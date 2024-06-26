/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from '@xstyled/styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import QuoteItem from './item';
import Title from './title';

const grid = 8;
const borderRadius = 0;

export const getBackgroundColor = (isDraggingOver, isDraggingFrom) => {
	if (isDraggingOver) {
		return '#FFEBE6';
	}
	if (isDraggingFrom) {
		return '#E6FCFF';
	}
	return '#EBECF0';
};

const Wrapper = styled.div`
  background-color: ${(props) =>
		getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  flex-direction: row;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
  padding: ${grid}px;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  flex-grow: 1; // Allow it to grow and fill available space;
`;

const scrollContainerHeight = 250;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-width: 500px;
  min-height: 150px;
  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: ${grid}px;
  display: flex;
  flex-direction: row; /* Display children horizontally */
  flex-grow: 1; // Allow it to grow and fill available space
`;

const ScrollContainer = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  max-height: ${scrollContainerHeight}px;
  width: 100%; // Use the full width
  display: flex;
  flex-direction: row;
`;

/* stylelint-disable block-no-empty */
const Container = styled.div``;
/* stylelint-enable */

const InnerQuoteList = (props) => {
	return props.quotes.map((quote, index) => (
		<Draggable key={"cardId" + quote.id} draggableId={"draggableId" + quote.id} index={index} isDragDisabled={props.lockPage}>
			{(dragProvided, dragSnapshot) => (
				<QuoteItem
					key={"cardId" + quote.id}
					quote={quote}
					isDragging={dragSnapshot.isDragging}
					provided={dragProvided}
					style={{ marginRight: grid }} // Add margin-right between items
					sprints={props.sprints}
					setSprints={props.setSprints}
					sprintIndex={props.sprintIndex}
					deleteStory={props.deleteStory}
					lockPage={props.lockPage}
				/>
			)}
		</Draggable>
	));
};

function InnerList(props) {
	const { quotes, dropProvided, lockPage, sprints, setSprints, sprintIndex, deleteStory } = props;
	const title = props.title ? <Title>{props.title}</Title> : null;

	return (
		<Container>
			{title}
			<DropZone ref={dropProvided.innerRef}>
				<InnerQuoteList quotes={quotes} lockPage={lockPage} sprints={sprints} setSprints={setSprints} sprintIndex={sprintIndex} deleteStory={deleteStory} />
				{dropProvided.placeholder}
			</DropZone>
		</Container>
	);
}

export default function QuoteList(props) {
	const {
		ignoreContainerClipping,
		internalScroll,
		scrollContainerStyle,
		isDropDisabled,
		isCombineEnabled,
		listId = 'LIST',
		listType,
		style,
		quotes,
		title,
		useClone,
		lockPage,
		sprints,
		setSprints,
		sprintIndex,
		deleteStory,
	} = props;

	// console.log("rendering quoteList", quotes)

	return (
		<Droppable
			droppableId={listId}
			type={listType}
			ignoreContainerClipping={ignoreContainerClipping}
			isDropDisabled={isDropDisabled}
			isCombineEnabled={isCombineEnabled}
			direction="horizontal"
		>
			{(dropProvided, dropSnapshot) => (
				<Wrapper
					style={style}
					isDraggingOver={dropSnapshot.isDraggingOver}
					isDropDisabled={isDropDisabled}
					isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
					{...dropProvided.droppableProps}
				>
					{internalScroll ? (
						<ScrollContainer style={scrollContainerStyle}>
							<InnerList
								quotes={quotes}
								title={title}
								dropProvided={dropProvided}
								lockPage={lockPage}
								sprints={sprints}
								setSprints={setSprints}
								sprintIndex={sprintIndex}
								deleteStory={deleteStory}
							/>
						</ScrollContainer>
					) : (
						<InnerList
							quotes={quotes}
							title={title}
							dropProvided={dropProvided}
							lockPage={lockPage}
							sprints={sprints}
							setSprints={setSprints}
							sprintIndex={sprintIndex}
							deleteStory={deleteStory}
						/>
					)}
				</Wrapper>
			)}
		</Droppable>
	);
}
