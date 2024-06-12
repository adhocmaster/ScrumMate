import React from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import StoryEditDialog from "./StoryEditDialog";
import ActionEditDialog from "./ActionEditDialog";

export default function CardEditDialog({
	editDialogOpen,
	handleEditDialogClose,
	tempRole,
	setTempRole,
	tempFunctionality,
	setTempFunctionality,
	tempReasoning,
	setTempReasoning,
	tempAcceptanceCriteria,
	setTempAcceptanceCriteria,
	tempPriority,
	setTempPriority,
	handleDeleteDialogOpen,
	handleSave,
	editActionDialogOpen,
	handleEditActionDialogClose,
	tempActionType,
	setTempActionType,
	tempActionDescription,
	setTempActionDescription,
	tempActionPriority,
	setTempActionPriority,
	handleActionSave,
}) {


	return <>
		<Dialog
			open={editDialogOpen}
			onClose={handleEditDialogClose}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>Edit:</DialogTitle>
			<DialogContent>
				<Box
					sx={{ mt: 1 }}
				/>
				<StoryEditDialog
					role={tempRole}
					setRole={setTempRole}
					functionality={tempFunctionality}
					setFunctionality={setTempFunctionality}
					reasoning={tempReasoning}
					setReasoning={setTempReasoning}
					acceptanceCriteria={tempAcceptanceCriteria}
					setAcceptanceCriteria={setTempAcceptanceCriteria}
					priority={tempPriority}
					setPriority={setTempPriority}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleEditDialogClose}>
					Cancel
				</Button>
				<Button onClick={handleDeleteDialogOpen} color="error">
					Delete
				</Button>
				<Button onClick={handleSave} variant="contained" color="primary">
					Save
				</Button>
			</DialogActions>
		</Dialog>

		<Dialog
			open={editActionDialogOpen}
			onClose={handleEditActionDialogClose}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>Edit:</DialogTitle>
			<DialogContent>
				<ActionEditDialog
					selectedItem={tempActionType}
					setSelectedItem={setTempActionType}
					description={tempActionDescription}
					setDescription={setTempActionDescription}
					actionPriority={tempActionPriority}
					setActionPriority={setTempActionPriority}
					selectedItemError={false}
					setSelectedItemError={() => { }}
					actionPriorityError={false}
					setActionPriorityError={() => { }}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleEditActionDialogClose}>
					Cancel
				</Button>
				<Button onClick={handleDeleteDialogOpen} color="error">
					Delete
				</Button>
				<Button onClick={handleActionSave} variant="contained" color="primary">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	</>
}