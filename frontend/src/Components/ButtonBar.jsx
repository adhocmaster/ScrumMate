import { Button, ButtonGroup, Typography } from '@mui/material';

const ButtonBar = ({text1, text2, text3, text4, text1Click, text2Click, text3Click, text4Click}) => {
  return (
    <ButtonGroup 
            fullWidth
            variant="contained" 
            sx={{
              margin: '5px 10px',
              height: '40px',
            }}
          >
            <Button
              onClick={text1Click}
            >
              <Typography fontWeight="bold">
                {text1}
              </Typography>
              
            </Button>

            <Button
              onClick={text2Click}
            >
              <Typography fontWeight="bold">
                {text2}
              </Typography>
            </Button>

            <Button
              onClick={text3Click}
            >
              <Typography fontWeight="bold">
                {text3}
              </Typography>
            </Button>

            <Button
              onClick={text4Click}
            >
              <Typography fontWeight="bold">
                {text4}
              </Typography>
            </Button>
          </ButtonGroup>
  );
};

export default ButtonBar;
