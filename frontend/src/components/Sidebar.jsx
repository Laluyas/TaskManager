import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Menu } from '@mui/material';
import { IoMenu } from "react-icons/io5";
import Container from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate()

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSignOut = () =>{
    // Clear stored email from localStorage
    localStorage.removeItem('email');
    navigate('/')
  }
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Home', 'Tasks', 'Users'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={Link} to={`/authenticated/${text.toLowerCase()}`}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <hr/>
      <List>
        {['Signout'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={handleSignOut}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
    </Box>
  );

  return (
    <div>
      <Button variant='primary' onClick={toggleDrawer(true)}>
        <IoMenu style={{fontSize:"40px"}} />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
