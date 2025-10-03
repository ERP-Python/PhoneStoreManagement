import { alpha } from '@mui/material'

export const layoutStyles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#FAFBFC',
  },

  // Sidebar styles
  nav: {
    width: { sm: 280 },
    flexShrink: { sm: 0 },
  },
  drawerPaper: {
    boxSizing: 'border-box',
    width: 280,
    background: '#F5F6FA',
    borderRight: '1px solid #e2e8f0',
    boxShadow: 'none',
  },
  drawerTemporary: {
    display: { xs: 'block', sm: 'none' },
  },
  drawerPermanent: {
    display: { xs: 'none', sm: 'block' },
  },
  sidebarContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F5F6FA',
  },
  sidebarHeader: {
    p: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F6FA',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#667eea',
    fontSize: '1.2rem',
    color: '#fff',
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 2,
    objectFit: 'contain',
  },
  logoText: {
    color: '#2D3748',
    fontWeight: 700,
    fontSize: '1.3rem',
  },
  navList: {
    px: 2,
    flex: 1,
  },
  navItem: {
    borderRadius: 2,
    mb: 0.5,
    px: 2,
    py: 1.5,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#E8EAF6',
      transform: 'translateX(4px)',
    },
  },
  navItemActive: {
    backgroundColor: '#ECEFF4',
    color: '#2D3748',
    '&:hover': {
      backgroundColor: '#E2E8F0',
    },
  },
  navIcon: {
    color: '#718096',
    minWidth: 40,
    transition: 'color 0.3s ease',
  },
  navIconActive: {
    color: '#667eea',
  },
  navText: {
    '& .MuiListItemText-primary': {
      color: '#4A5568',
      fontWeight: 500,
      fontSize: '0.95rem',
    },
  },
  navTextActive: {
    '& .MuiListItemText-primary': {
      color: '#2D3748',
      fontWeight: 600,
    },
  },


  // Main content styles
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: { sm: 'calc(100% - 280px)' },
    minHeight: '100vh',
  },

  // New Header in main content
  mainHeader: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    px: 3,
    py: 2,
  },
  mobileMenuIcon: {
    mr: 2,
    display: { sm: 'none' },
    color: '#2D3748',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  headerActionButton: {
    p: 1,
    color: '#718096',
    '&:hover': {
      backgroundColor: '#F7FAFC',
      color: '#2D3748',
    },
  },
  headerAvatar: {
    width: 32,
    height: 32,
    backgroundColor: '#667eea',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 600,
    ml: 1,
  },
  breadcrumbContainer: {
    mx: 3,
    mt: 0,
    p: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  breadcrumbs: {
    '& .MuiBreadcrumbs-separator': {
      color: '#94a3b8',
    },
  },
  breadcrumbItem: {
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  content: {
    flex: 1,
    p: 3,
  },

  // Footer styles
  footer: {
    mt: 'auto',
    py: 3,
    px: 3,
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #E2E8F0',
    '& .MuiTypography-root': {
      mb: 0.5,
    },
  },

  // User menu styles
  userMenu: {
    '& .MuiPaper-root': {
      borderRadius: 2,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      border: '1px solid #e2e8f0',
      minWidth: 200,
    },
  },
  userMenuItem: {
    '&.Mui-disabled': {
      opacity: 1,
    },
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  menuItem: {
    py: 1.5,
    '&:hover': {
      backgroundColor: alpha('#667eea', 0.05),
    },
  },
}

export const drawerWidth = 280

export const menuItems = [
  { text: 'Dashboard', icon: 'Dashboard', path: '/' },
  { text: 'Products', icon: 'Store', path: '/products' },
  { text: 'Orders', icon: 'ShoppingCart', path: '/orders' },
  { text: 'Customers', icon: 'People', path: '/customers' },
  { text: 'Inventory', icon: 'Inventory', path: '/inventory' },
  { text: 'Reports', icon: 'Assessment', path: '/reports' },
]
