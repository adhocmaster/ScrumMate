import { Card, CardContent, Typography } from '@mui/material';

const ContentBox = ({title, content}) => {
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
    </>
  );
};

export default ContentBox;
