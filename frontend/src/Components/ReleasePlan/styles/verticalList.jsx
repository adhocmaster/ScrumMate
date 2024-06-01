/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from '@xstyled/styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import QuoteItem from './item';
import Title from './title';

const grid = 8;
const borderRadius = 2;

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
  background-color: ${(props) => getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  flex-direction: column;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
  padding: ${grid}px;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 180px;
`;

const scrollContainerHeight = 760;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;
  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${scrollContainerHeight}px;
`;

/* stylelint-disable block-no-empty */
const Container = styled.div``;
/* stylelint-enable */

const InnerQuoteList = (props) => {
	if (props.quotes === undefined) {
		return <></>
	}
	return props.quotes.map((quote, index) => (
		<Draggable key={"cardId" + quote.id} draggableId={"draggableId" + quote.id} index={index} isDragDisabled={props.lockPage}>
			{(dragProvided, dragSnapshot) => (
				<QuoteItem
					key={"cardId" + quote.id}
					quote={quote}
					isDragging={dragSnapshot.isDragging}
					provided={dragProvided}
					lockPage={props.lockPage}
					backlog={props.backlog}
					setBacklogItems={props.setBacklogItems}
					deleteStory={props.deleteStory}
				/>
			)}
		</Draggable>
	));
};

function InnerList(props) {
	const { quotes, dropProvided, lockPage, backlog, setBacklogItems, deleteStory } = props;
	const title = props.title ? <Title>{props.title}</Title> : null;

	return (
		<Container>
			{title}
			<DropZone ref={dropProvided.innerRef}>
				<InnerQuoteList quotes={quotes} lockPage={lockPage} backlog={backlog} setBacklogItems={setBacklogItems} deleteStory={deleteStory} />
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
		backlog,
		setBacklogItems,
		deleteStory,
	} = props;

	return (
		<Droppable
			droppableId={listId}
			type={listType}
			ignoreContainerClipping={ignoreContainerClipping}
			isDropDisabled={isDropDisabled}
			isCombineEnabled={isCombineEnabled}
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
								backlog={backlog}
								setBacklogItems={setBacklogItems}
								deleteStory={deleteStory}
							/>
						</ScrollContainer>
					) : (
						<InnerList
							quotes={quotes}
							title={title}
							dropProvided={dropProvided}
							lockPage={lockPage}
							backlog={backlog}
							setBacklogItems={setBacklogItems}
							deleteStory={deleteStory}
						/>
					)}
				</Wrapper>
			)}
		</Droppable>
	);
}
