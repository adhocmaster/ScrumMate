import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Row from './Row';
import Column from './Column';
import reorder, { reorderQuoteMap } from '../reorder';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Box } from "@mui/material";
import styled, { order } from "@xstyled/styled-components";
import { colors } from "@atlaskit/theme";

const Container = styled.div`
  background-color: ${colors.B100};
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

const Board = ({
	isCombineEnabled,
	sprints,
	setSprints,
	useClone,
	containerHeight,
	withScrollableColumns,
}) => {

	const [ordered, setOrdered] = useState([]);
	useEffect(() => {
		setOrdered(Object.keys(sprints));
	}, [sprints]);

	const onDragEnd = (result) => {
		if (result.combine) {
			if (result.type === 'COLUMN') {
				const shallow = [...ordered];
				shallow.splice(result.source.index, 1);
				setOrdered(shallow);
				return;
			}

			const column = sprints[result.source.droppableId];
			const withQuoteRemoved = [...column];

			withQuoteRemoved.splice(result.source.index, 1);

			const orderedsprints = {
				...sprints,
				[result.source.droppableId]: withQuoteRemoved,
			};
			setSprints(orderedsprints);
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

			return;
		}

		const data = reorderQuoteMap({
			quoteMap: sprints,
			source,
			destination,
		});

		setSprints(data.quoteMap);
	};

	return (
		<>
			<DragDropContext onDragEnd={onDragEnd}>
				<Box display="flex">
					<Droppable
						droppableId="board"
						type="COLUMN"
						direction="vertical" // Change to vertical
						ignoreContainerClipping={Boolean(containerHeight)}
						isCombineEnabled={isCombineEnabled}
					>
						{(provided) => (
							<div ref={provided.innerRef} {...provided.droppableProps}>
								{ordered.map((key, index) => (
									<Row
										key={"sprintkey" + key}
										index={index}
										title={"sprintId" + key}
										sprint={sprints[key]}
										isScrollable={withScrollableColumns}
										isCombineEnabled={isCombineEnabled}
										useClone={useClone}
									/>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
					{/* <Droppable
						droppableId="BACKLOG"
						type="BACKLOG"
						direction="vertical" // Change to vertical
						ignoreContainerClipping={Boolean(containerHeight)}
						isCombineEnabled={isCombineEnabled}
					>
						{(provided) => (
							<div ref={provided.innerRef} {...provided.droppableProps}>
								{ordered.slice(-1).map((key, index) => (
									<Column
										key={key}
										index={3}
										title={key}
										quotes={sprints[key]}
										isScrollable={withScrollableColumns}
										isCombineEnabled={isCombineEnabled}
										useClone={useClone}
										disableDrag={true}
									/>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable> */}
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
