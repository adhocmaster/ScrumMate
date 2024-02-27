import { Card, CardContent, Typography } from '@mui/material';

const UserStory = ({userStoryText}) => {
  return (
    <Card
      sx={{
        minHeight: 200,
        marginBottom: 1,
        marginRight: 2,
      }}
    >
      <CardContent>
        <Typography
          variant="body1"
          textAlign={'left'}
          fontSize={16}
        >
          {userStoryText}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default UserStory
