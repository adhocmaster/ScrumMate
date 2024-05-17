import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Row from "./Row";
import Column from "./Column";
import reorder, { reorderQuoteMap } from "../reorder";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
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
	// const [columns, setColumns] = useState(sprints); // { "finn": ["quote 1", "quote2"], "Jake": ["quote3", "quote 4"], "BMO": [...], ... } => [ [story 1, Story 2], [story 3, story 4], [], ... ]
	const [ordered, setOrdered] = useState(Object.keys(sprints)); // ["Finn", "jake", ...] -> [0, 1, 2, 3, 4]
	console.log(sprints);
	console.log(Object.keys(sprints).map((indexStr) => parseInt(indexStr)));
	console.log(ordered);

	useEffect(() => {
		setOrdered(Object.keys(sprints).map((indexStr) => parseInt(indexStr)));
	}, [sprints]);

	const onDragEnd = (result) => {
		// if (result.combine) {
		// 	if (result.type === 'COLUMN') {
		// 		const shallow = [...ordered];
		// 		shallow.splice(result.source.index, 1);
		// 		setOrdered(shallow);
		// 		return;
		// 	}

		// 	const column = columns[result.source.droppableId];
		// 	const withQuoteRemoved = [...column];

		// 	withQuoteRemoved.splice(result.source.index, 1);

		// 	const orderedColumns = {
		// 		...columns,
		// 		[result.source.droppableId]: withQuoteRemoved,
		// 	};
		// 	setColumns(orderedColumns);
		// 	return;
		// }

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
		if (result.type === "COLUMN") {
			const reorderedorder = reorder(
				ordered,
				source.index,
				destination.index
			);

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
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{ordered.map((key, index) => (
									<Row
										key={key}
										index={index}
										title={key + 1}
										stories={sprints[parseInt(key)].todos} // [story1, story2, story3, ...]
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
										quotes={columns[key]}
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
