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
  Breadcrumbs,
  Chip,
  useTheme,
  alpha
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
  Home,
  NavigateNext
} from '@mui/icons-material'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { layoutStyles, drawerWidth, menuItems } from './Layout.styles'
import logoImage from '../../assets/images/logo.png'

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

  // Get current page title from path
  const getCurrentPageTitle = () => {
    const path = location.pathname
    const menuItem = menuItems.find(item => item.path === path)
    return menuItem ? menuItem.text : 'Dashboard'
  }

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '')
    const breadcrumbs = [{ label: 'Home', path: '/' }]
    
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/')
      const menuItem = menuItems.find(item => item.path === path)
      if (menuItem) {
        breadcrumbs.push({ label: menuItem.text, path })
      }
    })
    
    return breadcrumbs
  }

  const drawer = (
    <Box sx={layoutStyles.sidebarContainer}>
      {/* Sidebar Header with Logo */}
      <Box sx={layoutStyles.sidebarHeader}>
        <Box sx={layoutStyles.logoContainer}>
          <Box 
            component="img"
            src={logoImage}
            alt="Phone Store Logo"
            sx={layoutStyles.logoImage}
          />
          <Typography variant="h6" sx={layoutStyles.logoText}>
            Phone Store
          </Typography>
        </Box>
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
      
      {/* Spacer to push user menu to bottom */}
      <Box sx={{ flexGrow: 1 }} />
      
      {/* User menu in sidebar */}
      <Box sx={layoutStyles.sidebarFooter}>
        <Divider sx={{ borderColor: '#e2e8f0', mb: 2 }} />
        <Box sx={layoutStyles.userSection}>
          <Avatar sx={layoutStyles.userAvatar}>
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ ml: 2, flex: 1 }}>
            <Typography variant="body2" fontWeight={600} color="#2D3748">
              {user?.username}
            </Typography>
            <Typography variant="caption" color="#718096">
              {user?.email || 'admin@phonestore.com'}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleMenu}
            size="small"
            sx={{ color: '#718096' }}
          >
            <Settings />
          </IconButton>
        </Box>
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
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={layoutStyles.mobileMenuIcon}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Page title with logo */}
            <Box sx={layoutStyles.titleSection}>
              <Box 
                component="img"
                src={logoImage}
                alt="Logo"
                sx={layoutStyles.headerLogo}
              />
              <Typography variant="h5" sx={layoutStyles.pageTitle}>
                {getCurrentPageTitle()}
              </Typography>
            </Box>
            
            {/* Right side actions */}
            <Box sx={layoutStyles.headerActions}>
              <IconButton sx={layoutStyles.headerActionButton}>
                <Notifications />
              </IconButton>
              <IconButton sx={layoutStyles.headerActionButton}>
                <Settings />
              </IconButton>
              <Avatar sx={layoutStyles.headerAvatar}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          </Box>
        </Paper>
        
        {/* Breadcrumbs */}
        <Paper sx={layoutStyles.breadcrumbContainer} elevation={0}>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={layoutStyles.breadcrumbs}
          >
            {generateBreadcrumbs().map((crumb, index) => (
              <Typography
                key={crumb.path}
                color={index === generateBreadcrumbs().length - 1 ? "primary" : "text.secondary"}
                sx={layoutStyles.breadcrumbItem}
              >
                {crumb.label}
              </Typography>
            ))}
          </Breadcrumbs>
        </Paper>

        {/* Page Content */}
        <Box sx={layoutStyles.content}>
          <Outlet />
        </Box>

        {/* Footer */}
        <Paper component="footer" sx={layoutStyles.footer} elevation={0}>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 Phone Store Management System. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center">
            Built with Material-UI & React
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}
