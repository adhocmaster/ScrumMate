import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

const ContentBox = ({ title, isLocked }) => {

	const [content, setContent] = useState("");

	

	return (
		<>
			<Typography
				variant='body1'
				marginBottom={2}
				marginLeft={2}
				textAlign={'left'}
				fontWeight="bold"
				fontSize={14}
			>
				{title}
			</Typography>

			{console.log("is it locked?: " + isLocked)}

			{isLocked ?

				<Card
					sx={{
						minHeight: 100,
						// maxWidth: '95%',
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
				:
				<TextareaAutosize minRows={3} style={{ width: "1160px" }} />



			}
		</>
	);
};

export default ContentBox;
