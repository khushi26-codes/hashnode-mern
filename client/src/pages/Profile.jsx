import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import PostList from '../components/post/PostList';
import useAuth from '../hooks/useAuth';

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get(`/users/${id}`).then(({ data }) => { setProfile(data.user); setPosts(data.posts); })
      .catch(e => setError(e.response?.data?.message || 'Could not load profile.'));
  }, [id]);
  if (error) return <main className="container page-content"><div className="alert error">{error}</div></main>;
  if (!profile) return <div className="page-status">Loading profile…</div>;
  return <main className="container page-content">
    <section className="profile-card">
      {profile.avatarUrl ? <img className="profile-avatar" src={profile.avatarUrl} alt="" /> : <div className="profile-avatar profile-avatar-fallback">{profile.name?.[0]?.toUpperCase()}</div>}
      <div className="profile-info"><p className="eyebrow">DEVELOPER PROFILE</p><h1>{profile.name}</h1><p>{profile.bio || 'Curious developer. Sharing ideas and learning in public.'}</p><span className="profile-post-count">{posts.length} published {posts.length === 1 ? 'story' : 'stories'}</span></div>
      {user?._id === profile._id && <Link className="button button-outline" to="/settings">Edit profile</Link>}
    </section>
    <div className="section-heading profile-post-heading"><div><p className="eyebrow">FROM THIS AUTHOR</p><h2>Published stories</h2></div></div>
    <PostList posts={posts} />
  </main>;
}
