import { Card, CardContent, Typography } from '@mui/material';

const UserStory = ({ userStoryText = '', storyPoints = '0' }) => {
    userStoryText = typeof userStoryText === 'string' ? userStoryText : String(userStoryText);
    
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }

        const truncatedText = text.slice(0, maxLength);
        const lastSpaceIndex = truncatedText.lastIndexOf(' ');
        return lastSpaceIndex !== -1 ? `${truncatedText.slice(0, lastSpaceIndex)}...` : `${truncatedText}...`;
    };

    // Safe-guarding and ensuring all text are strings for .slice() to work
    const displayText = truncateText(userStoryText, 120);

    return (
        <Card sx={{ marginBottom: 1, marginRight: 2, position: 'relative' }}>
            <CardContent sx={{ minHeight: 128 }}>
                <Typography variant="body1" textAlign="left" fontSize={14}>
                    {displayText}
                </Typography>
                <Typography variant="body1" textAlign="right" fontSize={14} sx={{ position: 'absolute', bottom: 10, right: 12 }}>
                    Points: {storyPoints}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default UserStory;

