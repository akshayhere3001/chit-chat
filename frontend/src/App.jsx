import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import { HomePage, SignupPage, LoginPage, ProfilePage } from './pages/index.js';
import { useAuthStore } from './store/useAuthStore.js';

import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Hide Navbar for specific routes
  const hideNavbar = ['/login', '/signup'].includes(location.pathname);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
