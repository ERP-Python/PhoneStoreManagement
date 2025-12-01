import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AlertProvider } from './context/AlertContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Products from './pages/Products/Products'
import Brands from './pages/Brands/Brands'
import Orders from './pages/Orders/Orders'
import Customers from './pages/Customers/Customers'
import Inventory from './pages/Inventory/Inventory'
import Suppliers from './pages/Suppliers/Suppliers'
import PurchaseOrders from './pages/PurchaseOrders/PurchaseOrders'
import StockIn from './pages/StockIn/StockIn'
import Reports from './pages/Reports/Reports'

// Protected Route Component
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AlertProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="brands" element={<Brands />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="stock-in" element={<StockIn />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </AlertProvider>
  )
}

export default App 