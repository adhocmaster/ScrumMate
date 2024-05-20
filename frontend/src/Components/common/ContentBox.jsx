import { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

const ContentBox = ({ title, content }) => {

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
