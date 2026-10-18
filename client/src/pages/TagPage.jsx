import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import PostList from '../components/post/PostList';

export default function TagPage() {
  const { slug } = useParams();
  const [data, setData] = useState({ tag: null, posts: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api.get(`/tags/${slug}/posts`).then(({ data }) => setData(data)).catch(() => setData({ tag: null, posts: [] })).finally(() => setLoading(false));
  }, [slug]);
  return <main className="container page-content">
    <Link className="back-link" to="/tags">← All tags</Link>
    <div className="page-title-block"><p className="eyebrow">TOPIC</p><h1>#{data.tag?.name || slug}</h1><p>Stories from developers exploring this topic.</p></div>
    {loading ? <div className="page-status">Loading topic…</div> : <PostList posts={data.posts} />}
  </main>;
}
