import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Drawer, IconButton, Typography } from "@mui/material";
import { List, ListItem, ListItemButton } from "@mui/material";

const Sidebar = ({ open, toggleDrawer, title, items, itemClick }) => {
  return (
    <Drawer
      open={true}
      variant="persistent"
      anchor="left"
      sx={{
        height: 16,
        width: open ? 250 : 40,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          marginTop: 10,
          width: open ? 250 : 40,
          boxSizing: 'border-box',
        },
      }}
    >

      <List>
        <ListItem disablePadding>
          {open &&
            <Typography
              variant='body'
              sx={{
                marginLeft: 9,
                fontWeight: 'bold',
                fontSize: 24,
              }}
            >
              {title}
            </Typography>
          }

          {open ? 
            <IconButton 
              onClick={toggleDrawer}
              sx={{ 
                marginLeft: 'auto',
              }}
            >
              <ChevronLeftIcon />
            </IconButton> 
            :
            <IconButton 
              onClick={toggleDrawer}
              sx={{ 
                marginLeft: 'auto',
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          }
        </ListItem>

        {open &&
          <ListItemButton
              onClick={itemClick}
          >
            {/* Revision Placeholder */}
            <Typography 
              fontSize={16}
              sx={{margin: 'auto'}}
            >
              {items}
            </Typography>
          </ListItemButton>
        }
      </List>
    </Drawer>
  );
}

export default Sidebar;
