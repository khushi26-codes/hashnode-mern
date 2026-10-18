import { Link } from 'react-router-dom';
import TagPill from './TagPill';

function dateLabel(date) {
  return date ? new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
}
export default function PostCard({ post }) {
  const author = post.author || {};
  return (
    <article className="post-card">
      {post.coverImage && <Link to={`/post/${post.slug}`} className="cover-wrap"><img src={post.coverImage} alt="" className="post-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} /></Link>}
      <div className="post-card-body">
        <div className="author-row">
          <span className="avatar">{author.name?.[0]?.toUpperCase() || 'D'}</span>
          <Link to={`/profile/${author._id}`} className="author-name">{author.name || 'Developer'}</Link>
          <span className="dot">·</span><time>{dateLabel(post.createdAt)}</time>
        </div>
        <h2><Link to={`/post/${post.slug}`}>{post.title}</Link></h2>
        <p className="excerpt">{post.excerpt || post.content?.slice(0, 180)}</p>
        <div className="tag-row">{(post.tags || []).map(tag => <TagPill key={tag._id || tag.slug} tag={tag} />)}</div>
      </div>
    </article>
  );
}
