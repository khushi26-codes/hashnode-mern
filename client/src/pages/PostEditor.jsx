import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import MarkdownPreview from '../components/editor/MarkdownPreview';

const blank = { title: '', content: '', coverImage: '', tagsText: '', status: 'draft' };

export default function PostEditor() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!editing) return;
    api.get('/posts/mine').then(({ data }) => {
      const post = data.posts.find(item => item._id === id);
      if (!post) throw new Error('Post not found in your dashboard.');
      setForm({ title: post.title, content: post.content, coverImage: post.coverImage || '', tagsText: post.tags.map(tag => tag.name).join(', '), status: post.status });
    }).catch(e => setError(e.message || e.response?.data?.message || 'Could not load post.')).finally(() => setLoading(false));
  }, [id, editing]);
  function update(field, value) { setForm(current => ({ ...current, [field]: value })); }
  async function save(status) {
    setError('');
    if (!form.title.trim() || !form.content.trim()) { setError('Please add a title and some content.'); return; }
    setSaving(true);
    const payload = { title: form.title, content: form.content, coverImage: form.coverImage, tags: form.tagsText.split(',').map(t => t.trim()).filter(Boolean), status };
    try {
      const { data } = editing ? await api.put(`/posts/${id}`, payload) : await api.post('/posts', payload);
      navigate(status === 'published' ? `/post/${data.post.slug}` : '/dashboard');
    } catch (e) { setError(e.response?.data?.message || 'Could not save your post.'); }
    finally { setSaving(false); }
  }
  if (loading) return <div className="page-status">Loading editor…</div>;
  return <main className="container editor-container">
    <div className="editor-top"><Link to="/dashboard" className="back-link">← Dashboard</Link><span className="editor-mode">{editing ? 'EDIT STORY' : 'NEW STORY'}</span></div>
    <div className="editor-heading"><h1>{editing ? 'Edit your story' : 'Create a new story'}</h1><p>Write in Markdown. Your preview updates as you type.</p></div>
    {error && <div className="alert error">{error}</div>}
    <div className="editor-fields">
      <label>Post title<input className="title-input" maxLength="180" placeholder="A clear, helpful title…" value={form.title} onChange={e => update('title', e.target.value)} /></label>
      <label>Cover image URL <span className="optional">(optional)</span><input type="url" placeholder="https://example.com/cover.jpg" value={form.coverImage} onChange={e => update('coverImage', e.target.value)} /></label>
      <label>Tags <span className="optional">(comma-separated, up to 10)</span><input placeholder="javascript, webdev, career" value={form.tagsText} onChange={e => update('tagsText', e.target.value)} /></label>
    </div>
    <div className="editor-panels">
      <section className="editor-panel"><div className="panel-label">MARKDOWN EDITOR</div><textarea className="markdown-input" value={form.content} onChange={e => update('content', e.target.value)} placeholder={'# What I learned\n\nWrite your story here…\n\n```js\nconsole.log(\"Hello, world!\");\n```'} /></section>
      <section className="editor-panel preview-panel"><div className="panel-label">LIVE PREVIEW</div><MarkdownPreview content={form.content} /></section>
    </div>
    <div className="editor-bottom"><span className="draft-note">Your work is saved when you choose an action.</span><div className="editor-buttons"><button className="button button-outline" disabled={saving} onClick={() => save('draft')}>{saving ? 'Saving…' : 'Save draft'}</button><button className="button" disabled={saving} onClick={() => save('published')}>{saving ? 'Saving…' : editing && form.status === 'published' ? 'Update & publish' : 'Publish story'}</button></div></div>
  </main>;
}
