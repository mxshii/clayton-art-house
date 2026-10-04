import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './components/common/PublicLayout';

// Public Pages
import { Home } from './pages/Home';
import { Workshops } from './pages/Workshops';
import { WorkshopDetail } from './pages/WorkshopDetail';
import { BookingPage } from './pages/BookingPage';
import { About } from './pages/About';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { PrivateEvents } from './pages/PrivateEvents';
import { Events } from './pages/Events';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminWorkshops } from './pages/admin/AdminWorkshops';
import { AdminSessions } from './pages/admin/AdminSessions';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminInquiries } from './pages/admin/AdminInquiries';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminManagement } from './pages/admin/AdminManagement';
import { AdminAccountSettings } from './pages/admin/AdminAccountSettings';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/workshops/:slug" element={<WorkshopDetail />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<Events />} />
          <Route path="/private-events" element={<Events />} />
          <Route path="/our-journey" element={<About />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="workshops" element={<AdminWorkshops />} />
          <Route path="sessions" element={<AdminSessions />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="admins" element={<AdminManagement />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="settings/account" element={<AdminAccountSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
