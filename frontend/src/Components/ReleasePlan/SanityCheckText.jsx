import { Typography, Paper } from '@mui/material';

const SanityCheckText = ({text}) => {
  return (
    <Paper elevation={3} style={{ padding: '20px', backgroundColor: 'lightgray', height: '200px' }}>
      <Typography variant="body1" align="left">
        {text}
      </Typography>
    </Paper>
  );
};

export default SanityCheckText;
