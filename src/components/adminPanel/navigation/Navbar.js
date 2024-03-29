import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { Context } from '../../../App';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ROUTES } from '../../../utils/constants';
import Button from '@mui/material/Button';
import { ListItemButton } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import InventoryIcon from '@mui/icons-material/Inventory';

const drawerWidth = 240;

export const Navbar = props => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setMobileOpen(!mobileOpen);
  };

  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const signOut = async () => {
    auth.signOut();
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />

      <List component='nav' aria-label='main mailbox folders'>

        <ListItemButton
          component={Link}
          to={ROUTES.MAIN_PAGE_ROUTE}
          selected={selectedIndex === 1}
          onClick={event => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary='main' />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to={ROUTES.MANAGE_LOTS_ROUTE}
          selected={selectedIndex === 2}
          onClick={event => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText primary='manage lots' />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to={ROUTES.MANAGE_USERS_ROUTE}
          selected={selectedIndex === 3}
          onClick={event => handleListItemClick(event, 3)}
        >
          <ListItemIcon>
            <SupervisedUserCircleIcon />
          </ListItemIcon>
          <ListItemText primary='manage users' />
        </ListItemButton>

      </List>
      <Divider />
      <List component='nav' aria-label='secondary mailbox folder'>
        <ListItemButton
          selected={selectedIndex === 4}
          onClick={event => handleListItemClick(event, 4)}
        >
          <ListItemText primary='Trash' />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 5}
          onClick={event => handleListItemClick(event, 5)}
        >
          <ListItemText primary='Spam' />
        </ListItemButton>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            Auction House
          </Typography>

          {user && (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <p style={{ marginRight: '20px' }}>{user.email}</p>
              <Button onClick={signOut} color='inherit'>
                Exit
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
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
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component='main'
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
