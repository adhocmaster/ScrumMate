import { Box, Paper, Typography } from '@mui/material';

const SanityCheckGraph = ({ sprints }) => {
	const spTotals = sprints.map(sprint => sprint.todos.reduce((acc, item) => acc + Number(item.name === "Story" ? item.size : 0), 0));
	const maxSP = Math.max(...spTotals, 10);
	return (
		<Paper elevation={3} style={{ padding: '20px', width: '100%', maxWidth: '600px' }}>
			<Box display="flex" flexDirection="column" alignItems="flex-start">
				{spTotals.map((sp, index) => (
					<Box key={index} display="flex" width="100%" alignItems="center" mb={1} position="relative">
						<Typography variant="body2" style={{ textAlign: 'left', marginRight: '10px', minWidth: '80px' }}>
							Sprint {index + 1}
						</Typography>
						<Box style={{ flexGrow: 1, backgroundColor: '#bdbdbd', height: '30px', display: 'flex', alignItems: 'center' }}>
							<Box style={{ width: `${(sp / maxSP) * 100}%`, backgroundColor: 'rgba(0, 0, 0, 0.3)', height: '30px' }} />
						</Box>
						<Typography variant="body2" style={{ position: 'absolute', left: 90, marginLeft: '10px' }}>{sp} SP</Typography>
					</Box>
				))}
			</Box>
		</Paper>
	);
};

export default SanityCheckGraph;
