import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import MarkdownPreview from '../components/editor/MarkdownPreview';
import TagPill from '../components/post/TagPill';
import useAuth from '../hooks/useAuth';

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get(`/posts/${slug}`).then(({ data }) => setPost(data.post))
      .catch(err => setError(err.response?.data?.message || 'Could not load this post.'));
  }, [slug]);
  if (error) return <main className="container narrow"><div className="alert error">{error}</div><Link to="/">← Back to feed</Link></main>;
  if (!post) return <div className="page-status">Loading article…</div>;
  return <main className="container article-container">
    <article className="article">
      <div className="article-kicker">DEVELOPER STORY</div>
      <h1 className="article-title">{post.title}</h1>
      <div className="article-author">
        <span className="avatar large">{post.author?.name?.[0]?.toUpperCase() || 'D'}</span>
        <div><Link to={`/profile/${post.author?._id}`} className="author-name">{post.author?.name}</Link><p>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
        {user?._id === post.author?._id && <Link className="button button-outline button-small edit-article" to={`/editor/${post._id}`}>Edit post</Link>}
      </div>
      {post.coverImage && <img className="article-cover" src={post.coverImage} alt="" />}
      <div className="article-tags">{post.tags?.map(tag => <TagPill key={tag._id} tag={tag} />)}</div>
      <MarkdownPreview content={post.content} />
    </article>
  </main>;
}
