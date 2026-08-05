import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import MainLayout from './layouts/MainLayout';
import ChatPage from './pages/ChatPage';
import CallsPage from './pages/CallsPage';
import StatusPage from './pages/StatusPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
            <Route path="/calls" element={<CallsPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
