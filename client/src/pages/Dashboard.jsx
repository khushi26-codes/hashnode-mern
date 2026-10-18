import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  async function load() {
    try { const { data } = await api.get('/posts/mine'); setPosts(data.posts); }
    catch (e) { setError(e.response?.data?.message || 'Could not load your posts.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  async function removePost(post) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try { await api.delete(`/posts/${post._id}`); setPosts(current => current.filter(item => item._id !== post._id)); }
    catch (e) { setError(e.response?.data?.message || 'Delete failed.'); }
  }
  return <main className="container page-content">
    <div className="dashboard-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>My dashboard</h1><p>Manage your drafts and published stories.</p></div><Link className="button" to="/editor/new">＋ Write a post</Link></div>
    {error && <div className="alert error">{error}</div>}
    {loading ? <div className="page-status">Loading your posts…</div> : !posts.length ? <div className="empty-state"><div className="empty-icon">✎</div><h3>Your story starts here</h3><p>You haven't written a post yet. Share something you have learned.</p><Link className="button" to="/editor/new">Create your first post</Link></div> :
      <div className="dashboard-list">{posts.map(post => <div className="dashboard-item" key={post._id}>
        <div className="dashboard-item-main"><span className={`status status-${post.status}`}>{post.status}</span><h3>{post.title}</h3><p>Last updated {new Date(post.updatedAt).toLocaleDateString()}</p></div>
        <div className="dashboard-actions">{post.status === 'published' && <Link to={`/post/${post.slug}`}>View</Link>}<button className="button button-outline button-small" onClick={() => navigate(`/editor/${post._id}`)}>Edit</button><button className="button button-danger button-small" onClick={() => removePost(post)}>Delete</button></div>
      </div>)}</div>}
  </main>;
}
