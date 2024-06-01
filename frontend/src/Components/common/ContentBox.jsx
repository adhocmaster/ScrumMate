import { Card, CardContent, Typography } from '@mui/material';

const ContentBox = ({ content }) => {
	return (
		<>
			<Card
				sx={{
					minHeight: 100,
					marginLeft: 2,
					marginBottom: 2,
					backgroundColor: 'lightgray',
				}}
			>
				<CardContent>
					<Typography variant='body1' textAlign='left' fontSize={14}>
						{content}
					</Typography>
				</CardContent>
			</Card>

		</>
	);
};

export default ContentBox;
