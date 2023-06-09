import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import AddIcon from '@mui/icons-material/Add';
import Toolbar from '@mui/material/Toolbar';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import Link from 'next/link';
const drawerWidth = 240;
import { MAIN_MENU } from '../../constants/menu.constant';
const Menu = () => {
  return (
    <div>
      <Toolbar />
      {/* <Divider /> */}

      {MAIN_MENU.map(subMenu => 
       <div key={subMenu.subMenu}> 
        <List >
          {subMenu.menu.map(menu =>  <ListItem key={menu.label} disablePadding>
          <Link href={menu.link}>
            <ListItemButton>
              <ListItemIcon>
                {menu.icon}
              </ListItemIcon>
              <ListItemText>{menu.label}</ListItemText>
            </ListItemButton>
          </Link>
        </ListItem>)}
        </List>
        <Divider/>
        </div>
      )}
   
     
    </div>
  );
};
const SideNav = ({ mobileOpen, handleDrawerToggle, window }) => {
  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <Box
      component='nav'
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label='mailbox folders'
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant='temporary'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Menu />
      </Drawer>
      <Drawer
        variant='permanent'
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        <Menu />
      </Drawer>
    </Box>
  );
};

export default SideNav;
