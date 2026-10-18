import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Feed from './pages/Feed';
import PostDetail from './pages/PostDetail';
import TagPage from './pages/TagPage';
import Tags from './pages/Tags';
import { Login, Register } from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import PostEditor from './pages/PostEditor';
import Profile from './pages/Profile';
import ProfileSettings from './pages/ProfileSettings';

function NotFound() {
  return <main className="container page-content not-found"><div className="empty-icon">404</div><h1>Page not found</h1><p>This page may have moved, or the link may be incorrect.</p><a className="button" href="/">Back to home</a></main>;
}

export default function App() {
  return <BrowserRouter><AuthProvider><div className="app-shell"><Navbar /><Routes>
    <Route path="/" element={<Feed />} />
    <Route path="/post/:slug" element={<PostDetail />} />
    <Route path="/tag/:slug" element={<TagPage />} />
    <Route path="/tags" element={<Tags />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/profile/:id" element={<Profile />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/editor/new" element={<PostEditor />} />
      <Route path="/editor/:id" element={<PostEditor />} />
      <Route path="/settings" element={<ProfileSettings />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes><Footer /></div></AuthProvider></BrowserRouter>;
}
