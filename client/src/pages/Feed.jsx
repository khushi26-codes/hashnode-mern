import { useEffect, useState } from 'react';
import api from '../api/axios';
import PostList from '../components/post/PostList';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get('/posts', { params: search.trim() ? { search: search.trim() } : {} });
        if (active) setPosts(data.posts);
      } catch (e) { if (active) setError(e.response?.data?.message || 'Could not load posts. Check that the backend is running.'); }
      finally { if (active) setLoading(false); }
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [search]);

  return <main className="container">
    <section className="hero">
      <div className="hero-badge"><span className="pulse-dot" /> A home for developer stories</div>
      <h1>Ideas worth <span>sharing.</span></h1>
      <p>Discover practical guides, lessons learned, and fresh ideas from the developer community.</p>
      <div className="hero-search"><span>⌕</span><input aria-label="Search posts by title" placeholder="Search stories by title…" value={search} onChange={e => setSearch(e.target.value)} /><kbd>↵</kbd></div>
    </section>
    <section className="feed-section">
      <div className="section-heading"><div><p className="eyebrow">THE COMMUNITY</p><h2>Latest stories</h2></div><span className="count-label">{posts.length} {posts.length === 1 ? 'story' : 'stories'}</span></div>
      {loading ? <div className="page-status">Loading stories…</div> : error ? <div className="alert error">{error}</div> : <PostList posts={posts} />}
    </section>
  </main>;
}
