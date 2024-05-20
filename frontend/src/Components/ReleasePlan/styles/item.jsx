import React from 'react';
import styled from '@xstyled/styled-components';

const grid = 8;
const borderRadius = 2;

const getBackgroundColor = (isDragging, isGroupedOver, authorColors) => {
	if (isDragging) {
		return authorColors.soft;
	}

	if (isGroupedOver) {
		return '#EBECF0';
	}

	return '#FFFFFF';
};

const getBorderColor = (isDragging, authorColors) =>
	isDragging ? authorColors.hard : 'transparent';

const imageSize = 40;

const CloneBadge = styled.div`
  background: #79f2c0;
  bottom: ${grid / 2}px;
  border: 2px solid #57d9a3;
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 10px;
  position: absolute;
  right: -${imageSize / 3}px;
  top: -${imageSize / 3}px;
  transform: rotate(40deg);
  height: ${imageSize}px;
  width: ${imageSize}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.a`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  box-shadow: ${({ isDragging }) =>
		isDragging ? `2px 2px 1px #A5ADBA` : 'none'};
  box-sizing: border-box;
  padding: ${grid}px;
  height: 150px; /* Set a fixed height */
  width: 150px;
  margin-bottom: ${grid}px;
  user-select: none;

  /* anchor overrides */
  color: #091e42;

  &:hover,
  &:active {
    color: #091e42;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

const Content = styled.div`
  /* flex child */
  flex-grow: 1;
  /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
  flex-basis: 100%;
  /* flex parent */
  display: flex;
  flex-direction: column;
`;

const BlockQuote = styled.div`
  &::before {
    content: open-quote;
  }
  &::after {
    content: close-quote;
  }
  overflow: hidden; /* Prevent text overflow */
  text-overflow: ellipsis; /* Display ellipsis for overflowed text */
`;

function getStyle(provided, style) {
	if (!style) {
		return provided.draggableProps.style;
	}

	return {
		...provided.draggableProps.style,
		...style,
	};
}

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent
function QuoteItem(props) {
	const { todo, isDragging, isGroupedOver, provided, style, isClone, index } =
		props;

	return (
		<Container
			isDragging={isDragging}
			isGroupedOver={isGroupedOver}
			isClone={isClone}
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			style={getStyle(provided, style)}
			data-is-dragging={isDragging}
			data-testid={todo.id}
			data-index={index}
			aria-label={`${todo.id} quote ${todo.id}`}
		>
			<Content>
				<BlockQuote>{todo.id}</BlockQuote>
			</Content>
		</Container>
	);
}

export default React.memo(QuoteItem);