import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Paper,
  Chip,
  useTheme,
  alpha,
  InputBase
} from '@mui/material'
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  People,
  Store,
  Assessment,
  Menu as MenuIcon,
  AccountCircle,
  Notifications,
  Settings,
  Logout,
  Category,
  Business,
  LocalShipping,
  MoveToInbox,
  Search
} from '@mui/icons-material'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { layoutStyles, drawerWidth, menuItems } from './Layout.styles'
import logoImage from '../../assets/images/logo.png'

// Icon mapping for menu items
const iconMap = {
  Dashboard: <Dashboard />,
  Store: <Store />,
  Category: <Category />,
  ShoppingCart: <ShoppingCart />,
  People: <People />,
  Inventory: <Inventory />,
  Business: <Business />,
  LocalShipping: <LocalShipping />,
  MoveToInbox: <MoveToInbox />,
  Assessment: <Assessment />,
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()

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
    <Box sx={layoutStyles.sidebarContainer}>
      {/* Sidebar Header */}
      <Box sx={layoutStyles.sidebarHeader}>
        {/* <Typography variant="h6" sx={layoutStyles.sidebarTitle}>
          Menu
        </Typography> */}
        <img
          src={logoImage}
          alt="Phone Store Logo"
          style={{ width: '70%', height: '50%%', objectFit: 'contain' }}
        />
      </Box>

      <Divider sx={{ borderColor: '#e2e8f0' }} />

      {/* Navigation Menu */}
      <List sx={layoutStyles.navList}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  ...layoutStyles.navItem,
                  ...(isActive ? layoutStyles.navItemActive : {}),
                }}
              >
                <ListItemIcon sx={{
                  ...layoutStyles.navIcon,
                  ...(isActive ? layoutStyles.navIconActive : {}),
                }}>
                  {iconMap[item.icon]}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    ...layoutStyles.navText,
                    ...(isActive ? layoutStyles.navTextActive : {}),
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

    </Box>
  )

  return (
    <Box sx={layoutStyles.root}>
      {/* Sidebar Navigation */}
      <Box component="nav" sx={layoutStyles.nav}>
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

      {/* Main Content Area */}
      <Box component="main" sx={layoutStyles.main}>
        {/* New Header inside main content */}
        <Paper sx={layoutStyles.mainHeader} elevation={0}>
          <Box sx={layoutStyles.headerContent}>
            {/* Logo in navbar - leftmost position */}
            <Box sx={layoutStyles.navbarLogoContainer}>
              {/* <Box
                component="img"
                src={logoImage}
                alt="Phone Store Logo"
                sx={layoutStyles.navbarLogoImage}
              />
              <Typography variant="h6" sx={layoutStyles.navbarLogoText}>
                Phone Store
              </Typography> */}
            </Box>

            {/* Central Search Bar */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', px: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: '#f1f5f9', 
                borderRadius: '12px', 
                px: 2, 
                py: 1, 
                width: '100%', 
                maxWidth: 500,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                },
                '&:focus-within': {
                  bgcolor: '#fff',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  border: '1px solid #e2e8f0'
                }
              }}>
                <Search sx={{ color: '#94a3b8', mr: 1 }} />
                <InputBase 
                  placeholder="Tìm kiếm..." 
                  sx={{ flex: 1, fontSize: '0.95rem' }} 
                />
              </Box>
            </Box>

            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={layoutStyles.mobileMenuIcon}
            >
              <MenuIcon />
            </IconButton>

            {/* Right side actions */}
            <Box sx={layoutStyles.headerActions}>
              <IconButton sx={layoutStyles.headerActionButton}>
                <Notifications />
              </IconButton>
              <IconButton sx={layoutStyles.headerActionButton}>
                <Settings />
              </IconButton>
              <IconButton
                onClick={handleMenu}
                sx={{ p: 0.5 }}
              >
                <Avatar sx={layoutStyles.headerAvatar}>
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>

            {/* User menu dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={layoutStyles.userMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleClose} sx={layoutStyles.menuItem}>
                <Settings sx={{ mr: 2 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={layoutStyles.menuItem}>
                <Logout sx={{ mr: 2 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Paper>

        {/* Page Content */}
        <Box sx={layoutStyles.content}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
