import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import Login from './pages/Login';
import VerifyWhatsApp from './pages/VerifyWhatsApp';
import Home from './pages/Home';
import CategoryProducts from './pages/CategoryProducts';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
       
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-whatsapp" element={<VerifyWhatsApp />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:category_slug"
            element={
              <ProtectedRoute>
                 <Navbar />
                <CategoryProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:product_slug"
            element={
              <ProtectedRoute>
                 <Navbar />
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                 <Navbar />
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                 <Navbar />
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;