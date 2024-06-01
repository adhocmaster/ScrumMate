import { TextField, FormHelperText, } from "@mui/material";
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';

export default function ActionEditDialog({
	selectedItem,
	setSelectedItem,
	description,
	setDescription,
	actionPriority,
	setActionPriority,
	selectedItemError,
	setSelectedItemError,
	actionPriorityError,
	setActionPriorityError,
}) {

	const ActionTypeEnum = {
		BUG: 1,
		SYSTEMFEATURE: 2,
		SPIKE: 3,
		INFRASTRUCTURE: 4,
	}

	const handleSelectChange = (event) => {
		setSelectedItem(event.target.value);
		setSelectedItemError(false);
	};

	const handleSelectChangePriority = (event) => {
		setActionPriority(event.target.value);
		setActionPriorityError(false);
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
	};

	return <>
		<FormControl fullWidth margin="dense">
			<InputLabel id="item-select-label">Item</InputLabel>
			<Select
				labelId="item-select-label"
				id="item-select"
				label="Item"
				value={selectedItem}
				error={selectedItemError}
				onChange={handleSelectChange}
				defaultValue=""
			>
				<MenuItem value={ActionTypeEnum.BUG}>Bug</MenuItem>
				<MenuItem value={ActionTypeEnum.INFRASTRUCTURE}>Infrastructure</MenuItem>
				<MenuItem value={ActionTypeEnum.SYSTEMFEATURE}>System Feature</MenuItem>
				<MenuItem value={ActionTypeEnum.SPIKE}>Spike</MenuItem>
			</Select>
			{selectedItemError && (
				<FormHelperText>Please select an item.</FormHelperText>
			)}
		</FormControl>

		<TextField
			fullWidth
			margin="dense"
			id="action-item-description"
			label="Description"
			type="text"
			variant="outlined"
			multiline
			rows={4}
			value={description}
			onChange={handleDescriptionChange}
		/>

		<FormControl fullWidth sx={{ marginTop: 2 }}>
			<InputLabel id="priority-select-label">Priority</InputLabel>
			<Select
				labelId="priority-select-label"
				id="priority-select"
				value={actionPriority}
				label="Priority"
				onChange={handleSelectChangePriority}
				error={actionPriorityError}
				defaultValue=""
			>
				<MenuItem value={4}>High</MenuItem>
				<MenuItem value={3}>Medium</MenuItem>
				<MenuItem value={2}>Low</MenuItem>
				<MenuItem value={1}>None</MenuItem>
			</Select>
			{actionPriorityError && (
				<FormHelperText>Please select a priority.</FormHelperText>
			)}
		</FormControl>
	</>
}
