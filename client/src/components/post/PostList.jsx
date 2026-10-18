import PostCard from './PostCard';
export default function PostList({ posts }) {
  if (!posts?.length) return <div className="empty-state"><div className="empty-icon">✦</div><h3>No stories found</h3><p>Try another search, or be the first to publish something.</p></div>;
  return <div className="post-list">{posts.map(post => <PostCard key={post._id} post={post} />)}</div>;
}
