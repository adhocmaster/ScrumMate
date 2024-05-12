import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DragList from "../DragList";
import Backlog from "../Backlog";
import { Grid, Typography } from "@mui/material";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const TitleAndButtons = ({ sprints, setSprints, releaseId }) => {

	function createNewSprints() {
		console.log("creating new");
		var options = {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ sprintNumber: sprints.length + 1 }),
		};

		fetch(`http://localhost:8080/api/release/${releaseId}/sprint`, options)
			.then((result) => {
				if (result.status === 200) {
					console.log(result);
				}
				console.log(result);
				return result.json();
			})
			.then((response) => {
				console.log(response);
				setSprints((prevSprints) => [...prevSprints, response]);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}

	return (
		<Grid container spacing={2}>
			{/* Sprints */}
			<Grid item xs={9}>
				<Typography
					marginLeft={4}
					textAlign="left"
					fontWeight="bold"
					fontSize={14}
				>
					Sprints
					<IconButton
						sx={{
							marginBottom: "3px",
						}}
						onClick={createNewSprints}
					>
						<AddCircleOutlineIcon fontSize="small" />
					</IconButton>
				</Typography>

			</Grid>
			{/* Backlog */}
			<Grid item xs={3}>
				{/* TODO: Refactor this away */}
				<Backlog releaseId={releaseId} />
			</Grid>
		</Grid>
	)
}

const Board = ({
	isCombineEnabled,
	useClone,
	containerHeight,
	withScrollableColumns,
	sprints,
	setSprints,
	releaseId
}) => {
	const rows = sprints;
	const setRows = setSprints;

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
			const reorderedorder = reorder(ordered, source.index, destination.index);

			setOrdered(reorderedorder);

			return;
		}

		const data = reorderQuoteMap({
			quoteMap: columns,
			source,
			destination,
		});

		setRows(data.quoteMap);
	};


	return (
		<>
			<TitleAndButtons sprints={sprints} setSprints={setSprints} releaseId={releaseId} />
			<DragDropContext onDragEnd={onDragEnd}>
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
								<Column
									key={key}
									index={index}
									title={key}
									quotes={columns[key]}
									isScrollable={withScrollableColumns}
									isCombineEnabled={isCombineEnabled}
									useClone={useClone}
								/>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
			{/* <DragList
				marginLeft={2}
				items={sprints}
				setItems={setSprints}
				releaseId={releaseId}
			/> */}
		</>
	)
}

export default Board;