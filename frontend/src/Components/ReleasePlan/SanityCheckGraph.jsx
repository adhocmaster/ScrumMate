import { Box, Paper, Typography } from '@mui/material';

const SanityCheckGraph = ({ sprints }) => {
	const spTotals = sprints.map(sprint => sprint.todos.reduce((acc, item) => acc + Number(item.storyPoints), 0));
	const maxSP = Math.max(...spTotals, 10);
	return (
		<Paper elevation={3} style={{ padding: '20px', width: '100%', maxWidth: '600px' }}>
			<Box display="flex" flexDirection="column" alignItems="flex-start">
				{spTotals.map((sp, index) => (
					<Box key={index} display="flex" width="100%" alignItems="center" mb={1}>
						<Typography variant="body2" style={{ minWidth: '80px', textAlign: 'left', marginRight: '10px' }}>
							Sprint {index + 1}
						</Typography>
						<Box style={{ flexGrow: 1, backgroundColor: '#E0E0E0', height: '30px' }}>
							<Box style={{ width: `${(sp / maxSP) * 100}%`, backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '30px', display: 'flex', alignItems: 'center' }}>
								<Typography variant="body2" style={{ marginLeft: '5px', color: 'white' }}>{sp} SP</Typography>
							</Box>
						</Box>
					</Box>
				))}
			</Box>
		</Paper>
	);
};

export default SanityCheckGraph;

