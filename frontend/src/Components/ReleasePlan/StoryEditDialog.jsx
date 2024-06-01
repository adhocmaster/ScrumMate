import { Typography, TextField, Box, } from "@mui/material";
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';

export default function StoryEditDialog({
	role,
	setRole,
	functionality,
	setFunctionality,
	reasoning,
	setReasoning,
	acceptanceCriteria,
	setAcceptanceCriteria,
	priority,
	setPriority,
}) {

	return <>
		<Box display="flex" alignItems="center" gap={1} mb={2}>
			<Typography variant="body2" component="span">
				As a(n)
			</Typography>
			<TextField
				size="small"
				label="Role"
				value={role}
				onChange={(e) => setRole(e.target.value)}
				fullWidth
			/>
			<Typography variant="body2" component="span">
				I want to be able to
			</Typography>
		</Box>

		<TextField
			autoFocus
			margin="dense"
			id="functionality-description"
			label="Functionality Description"
			type="text"
			fullWidth
			variant="outlined"
			multiline
			rows={4}
			value={functionality}
			onChange={(e) => setFunctionality(e.target.value)}
			sx={{ marginBottom: 2 }}
		/>

		<Typography variant="body2" component="span">
			so that
		</Typography>

		<TextField
			margin="dense"
			id="reasoning"
			label="Reasoning"
			type="text"
			fullWidth
			variant="outlined"
			multiline
			rows={4}
			value={reasoning}
			onChange={(e) => setReasoning(e.target.value)}
			sx={{ marginBottom: 2, marginTop: 2 }}
		/>

		<TextField
			margin="dense"
			id="acceptance-criteria"
			label="Acceptance Criteria"
			type="text"
			fullWidth
			variant="outlined"
			multiline
			rows={4}
			value={acceptanceCriteria}
			onChange={(e) => setAcceptanceCriteria(e.target.value)}
			sx={{ marginBottom: 2 }}
		/>

		<FormControl fullWidth>
			<InputLabel id="priority-select-label">Priority</InputLabel>
			<Select
				labelId="priority-select-label"
				id="demo-simple-select"
				value={priority}
				label="Priority"
				onChange={(event) => setPriority(event.target.value)}
			>
				<MenuItem value={4}>High</MenuItem>
				<MenuItem value={3}>Medium</MenuItem>
				<MenuItem value={2}>Low</MenuItem>
				<MenuItem value={1}>None</MenuItem>
			</Select>
		</FormControl>
	</>
}