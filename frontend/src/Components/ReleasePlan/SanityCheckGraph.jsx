import { Box, Paper, Typography } from '@mui/material';

const SanityCheckGraph = () => {
    //data for sanity check
    const barData = [
      {pointsCompleted: 20 },
      {pointsCompleted: 30 },
      {pointsCompleted: 40 },
      {pointsCompleted: 35 },
      {pointsCompleted: 45 },
    ];

  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        {barData.map((data, index) => (
          <Box key={index} display="flex" alignItems="center" marginBottom={1}>
            <Box width={data.pointsCompleted * 5} height={30} bgcolor="darkgrey" />
            <Typography marginLeft={2} variant="body2">
              {data.pointsCompleted}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default SanityCheckGraph;
