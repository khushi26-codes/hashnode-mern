import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/tags').then(({ data }) => setTags(data.tags)).catch(() => setTags([])).finally(() => setLoading(false)); }, []);
  return <main className="container page-content">
    <div className="page-title-block"><p className="eyebrow">DISCOVER</p><h1>Explore topics</h1><p>Find the ideas and technologies you care about.</p></div>
    {loading ? <div className="page-status">Loading tags…</div> : tags.length ? <div className="tag-grid">{tags.map(tag => <Link className="tag-card" key={tag._id} to={`/tag/${tag.slug}`}><span className="tag-symbol">#</span><span className="tag-card-name">{tag.name}</span><span className="tag-count">{tag.postCount} {tag.postCount === 1 ? 'post' : 'posts'}</span></Link>)}</div> : <div className="empty-state"><h3>No tags yet</h3><p>Tags appear here when authors create posts.</p></div>}
  </main>;
}
