import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import ToastContainer from '@/components/ToastContainer';
import { AccessibilityProvider, SkipToContent } from '@/components/AccessibilityProvider';

// Public pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Music from '@/pages/Music';
import Tour from '@/pages/Tour';
import Gallery from '@/pages/Gallery';
import Contact from '@/pages/Contact';

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
import AdminMembers from '@/pages/admin/Members';
import MemberNew from '@/pages/admin/MemberNew';
import MemberEdit from '@/pages/admin/MemberEdit';

const App = () => {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <AuthProvider>
          <Router>
            <SkipToContent />
            <ToastContainer />
            <div id="main-content">
              <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/music" element={<Music />} />
          <Route path="/tour" element={<Tour />} />
          <Route path="/gallery" element={<Gallery />} />
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
            <Route path="band-members" element={<AdminMembers />} />
            <Route path="band-members/new" element={<MemberNew />} />
            <Route path="band-members/edit/:id" element={<MemberEdit />} />
            <Route path="messages" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminMessages />
              </ProtectedRoute>
            } />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="gallery/new" element={<GalleryNew />} />
            <Route path="gallery/edit/:id" element={<GalleryEdit />} />
          </Route>
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </AccessibilityProvider>
    </ErrorBoundary>
  );
};

export default App;
