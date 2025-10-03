export const layoutStyles = {
  root: {
    display: 'flex',
  },
  appBar: {
    position: 'fixed',
    zIndex: (theme) => theme.zIndex.drawer + 1,
  },
  menuIcon: {
    mr: 2,
    display: { sm: 'none' },
  },
  title: {
    flexGrow: 1,
  },
  nav: {
    width: { sm: 240 },
    flexShrink: { sm: 0 },
  },
  drawerPaper: {
    boxSizing: 'border-box',
    width: 240,
  },
  drawerTemporary: {
    display: { xs: 'block', sm: 'none' },
  },
  drawerPermanent: {
    display: { xs: 'none', sm: 'block' },
  },
  main: {
    flexGrow: 1,
    p: 3,
    width: { sm: 'calc(100% - 240px)' },
  },
  userMenu: {
    variant: 'body2',
  },
}

export const drawerWidth = 240

export const menuItems = [
  { text: 'Dashboard', icon: 'Dashboard', path: '/' },
  { text: 'Products', icon: 'Store', path: '/products' },
  { text: 'Orders', icon: 'ShoppingCart', path: '/orders' },
  { text: 'Customers', icon: 'People', path: '/customers' },
  { text: 'Inventory', icon: 'Inventory', path: '/inventory' },
  { text: 'Reports', icon: 'Assessment', path: '/reports' },
]
