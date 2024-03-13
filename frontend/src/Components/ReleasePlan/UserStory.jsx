import { Card, CardContent, Typography } from '@mui/material';

const UserStory = ({userStoryText, storyPoints}) => {
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }

    const truncatedText = text.slice(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    const truncatedWithEllipsis = lastSpaceIndex !== -1 ? `${truncatedText.slice(0, lastSpaceIndex)} ...` : `${truncatedText} ...`;

    return truncatedWithEllipsis;
  };
  return (
    <Card
      sx={{
        marginBottom: 1,
        marginRight: 2,
        position: 'relative',
      }}
    >
      <CardContent sx={{minHeight: 128}}>
        <Typography
          variant="body1"
          textAlign={'left'}
          fontSize={14}
        >
          {userStoryText ? truncateText(userStoryText, 120): ''}
        </Typography>
        
        <Typography
          variant="body1"
          textAlign={'right'}
          fontSize={14}
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 12,
          }}
        >
          {storyPoints}
        </Typography>
      </CardContent>
    </Card>
  )
};

export default UserStory;
