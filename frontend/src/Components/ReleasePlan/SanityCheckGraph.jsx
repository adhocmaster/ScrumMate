import { Box, Paper, Typography } from '@mui/material';

const SanityCheckGraph = ({ sprints }) => {
	console.log("sc", sprints)
	console.log(sprints.map((sprint, index) => (sprint.todos.reduce((accumulator, backlogItem) => accumulator + Number(backlogItem.storyPoints), 0))))
	const spTotals = sprints.map((sprint, index) => (sprint.todos.reduce((accumulator, backlogItem) => accumulator + Number(backlogItem.storyPoints), 0)))
	return (
		<Paper elevation={3} style={{ padding: '20px' }}>
			<Box display="flex" flexDirection="column" alignItems="flex-start">
				{spTotals.map((sp, index) => (
					<Box key={index} display="flex" alignItems="center" marginBottom={1}>
						<Box width={sp * 5} height={30} bgcolor="darkgrey" />
						<Typography marginLeft={2} variant="body2">
							{sp}
						</Typography>
					</Box>
				))}
			</Box>
		</Paper>
	);
};

export default SanityCheckGraph;
