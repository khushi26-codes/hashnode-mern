import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout() { logout(); navigate('/'); }
  return (
    <header className="topbar">
      <div className="nav-inner">
        <Link className="brand" to="/"><span className="brand-mark">h</span> hashnode</Link>
        <nav className="nav-links">
          <NavLink to="/tags">Explore tags</NavLink>
          {user ? <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink className="write-link" to="/editor/new">Write a post</NavLink>
            <Link to={`/profile/${user._id}`} className="nav-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</Link>
            <button className="text-button" onClick={handleLogout}>Log out</button>
          </> : <>
            <NavLink to="/login">Log in</NavLink>
            <Link className="button button-small" to="/register">Get started</Link>
          </>}
        </nav>
      </div>
    </header>
  );
}
