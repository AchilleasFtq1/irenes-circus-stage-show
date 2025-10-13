import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import ToastContainer from '@/components/ToastContainer';
import { AccessibilityProvider, SkipToContent } from '@/components/AccessibilityProvider';

// Public pages
import Home from '@/pages/Home';
import Music from '@/pages/Music';
import Tour from '@/pages/Tour';
import Gallery from '@/pages/Gallery';
import Contact from '@/pages/Contact';
import Shop from '@/pages/Shop';
import ShopSuccess from '@/pages/ShopSuccess';
import ShopCancel from '@/pages/ShopCancel';
import Product from '@/pages/Product';
import Checkout from '@/pages/Checkout';
import OrderTracking from '@/pages/OrderTracking';

// Admin pages
import AdminLayout from '@/components/AdminLayout';
import AdminLogin from '@/pages/admin/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminEvents from '@/pages/admin/Events';
import AdminMessages from '@/pages/admin/Messages';
import AdminGallery from '@/pages/admin/Gallery';
import GalleryNew from '@/pages/admin/GalleryNew';
import GalleryEdit from '@/pages/admin/GalleryEdit';
import AdminTracks from '@/pages/admin/Tracks';
import AdminOrders from '@/pages/admin/Orders';
import AdminProducts from '@/pages/admin/Products';
// Removed band members admin pages

const App = () => {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <AuthProvider>
          <CartProvider>
          <Router>
            <SkipToContent />
            <ToastContainer />
            <div id="main-content">
              <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Music />} />
          <Route path="/tour" element={<Tour />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:slug" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/shop/success" element={<ShopSuccess />} />
          <Route path="/shop/cancel" element={<ShopCancel />} />
          <Route path="/orders/track" element={<OrderTracking />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tracks" element={<AdminTracks />} />
            <Route path="events" element={<AdminEvents />} />
            {/* Band members admin pages removed */}
            <Route path="messages" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminMessages />
              </ProtectedRoute>
            } />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="gallery/new" element={<GalleryNew />} />
            <Route path="gallery/edit/:id" element={<GalleryEdit />} />
            <Route path="products" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminProducts />
              </ProtectedRoute>
            } />
            <Route path="orders" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminOrders />
              </ProtectedRoute>
            } />
          </Route>
                </Routes>
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
        </AccessibilityProvider>
    </ErrorBoundary>
  );
};

export default App;
