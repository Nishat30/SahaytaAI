import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import GamesPage from './pages/GamesPage';
import UploadPage from './pages/UploadPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
