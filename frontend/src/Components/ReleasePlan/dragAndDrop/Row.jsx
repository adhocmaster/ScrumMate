import React from 'react';
import styled from '@xstyled/styled-components';
import { colors } from '@atlaskit/theme';
import { Draggable } from 'react-beautiful-dnd';
import QuoteList from '../styles/list';
import Title from '../styles/title';

const grid = 8;
const borderRadius = 2;

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: row;
  min-width: 100px;
  min-height: 252px;
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

	return (
		<Draggable draggableId={title} index={index} direction="horizontal">
			{(provided, snapshot) => (
				<Container ref={provided.innerRef} {...provided.draggableProps}>
					<Header isDragging={snapshot.isDragging}>
						<Title
							isDragging={snapshot.isDragging}
							{...provided.dragHandleProps}
							aria-label={`${title} quote list`}
						>
							{title}
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
					/>
				</Container>
			)}
		</Draggable>
	);
};

export default Row;
