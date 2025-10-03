import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Menu, MenuItem } from '@mui/material'
import { Dashboard, Inventory, ShoppingCart, People, Store, Assessment, Menu as MenuIcon, AccountCircle } from '@mui/icons-material'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { layoutStyles, drawerWidth, menuItems } from './Layout.styles'

// Icon mapping for menu items
const iconMap = {
  Dashboard: <Dashboard />,
  Store: <Store />,
  ShoppingCart: <ShoppingCart />,
  People: <People />,
  Inventory: <Inventory />,
  Assessment: <Assessment />,
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout()
    handleClose()
    navigate('/login')
  }

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Phone Store
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>{iconMap[item.icon]}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <Box sx={layoutStyles.root}>
      <AppBar position="fixed" sx={layoutStyles.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={layoutStyles.menuIcon}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={layoutStyles.title}>
            Phone Store Management System
          </Typography>
          <div>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Typography {...layoutStyles.userMenu}>{user?.username}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={layoutStyles.nav}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            ...layoutStyles.drawerTemporary,
            '& .MuiDrawer-paper': layoutStyles.drawerPaper,
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            ...layoutStyles.drawerPermanent,
            '& .MuiDrawer-paper': layoutStyles.drawerPaper,
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={layoutStyles.main}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
