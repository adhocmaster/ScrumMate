import { Card, CardContent, Typography } from '@mui/material';

const UserStory = ({userStoryText, storyPoints}) => {
  return (
    <Card
      sx={{
        marginBottom: 1,
        marginRight: 2,
        position: 'relative',
      }}
    >
      <CardContent sx={{minHeight: 100}}>
        <Typography
          variant="body1"
          textAlign={'left'}
          // fontSize={16}
        >
          {userStoryText}
        </Typography>
        
        <Typography
          variant="body1"
          textAlign={'right'}
          // fontSize={16}
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
}

export default UserStory
