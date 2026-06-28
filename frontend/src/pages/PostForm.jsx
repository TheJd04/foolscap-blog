import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function PostForm({ mode }) {
  const isEdit = mode === 'edit';
  const { slug } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', coverImage: '', tags: '', published: true,
  });
  const [postId, setPostId] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${slug}`);
        setPostId(data.post._id);
        setForm({
          title: data.post.title,
          content: data.post.content,
          excerpt: data.post.excerpt || '',
          coverImage: data.post.coverImage || '',
          tags: (data.post.tags || []).join(', '),
          published: data.post.published,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load that post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [isEdit, slug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (isEdit) {
        const { data } = await api.put(`/posts/${postId}`, form);
        toast.success('Post updated');
        navigate(`/posts/${data.post.slug}`);
      } else {
        const { data } = await api.post('/posts', form);
        toast.success('Post published');
        navigate(`/posts/${data.post.slug}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center py-24 text-ink-soft font-mono text-sm">Loading…</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold mb-8">
        {isEdit ? 'Edit post' : 'Write a new post'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="title">Title</label>
          <input
            id="title" name="title" type="text" required
            value={form.title} onChange={handleChange}
            placeholder="Give your post a title"
            className="w-full border border-hairline rounded-lg px-4 py-2.5 font-display text-lg focus:border-teal outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="content">Content</label>
          <textarea
            id="content" name="content" required rows={14}
            value={form.content} onChange={handleChange}
            placeholder="Write your post here…"
            className="w-full border border-hairline rounded-lg px-4 py-3 leading-relaxed focus:border-teal outline-none resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="excerpt">
            Excerpt <span className="text-ink-soft font-normal">(optional — auto-generated if left blank)</span>
          </label>
          <input
            id="excerpt" name="excerpt" type="text"
            value={form.excerpt} onChange={handleChange}
            maxLength={300}
            className="w-full border border-hairline rounded-lg px-4 py-2.5 focus:border-teal outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="coverImage">
            Cover image URL <span className="text-ink-soft font-normal">(optional)</span>
          </label>
          <input
            id="coverImage" name="coverImage" type="url"
            value={form.coverImage} onChange={handleChange}
            placeholder="https://…"
            className="w-full border border-hairline rounded-lg px-4 py-2.5 focus:border-teal outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="tags">
            Tags <span className="text-ink-soft font-normal">(comma-separated)</span>
          </label>
          <input
            id="tags" name="tags" type="text"
            value={form.tags} onChange={handleChange}
            placeholder="travel, food, life"
            className="w-full border border-hairline rounded-lg px-4 py-2.5 focus:border-teal outline-none"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox" name="published"
            checked={form.published} onChange={handleChange}
            className="accent-teal"
          />
          Publish immediately
        </label>

        {error && <p className="text-rust text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit" disabled={submitting}
            className="rounded-full bg-ink text-paper px-6 py-2.5 font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Publish post'}
          </button>
          <button
            type="button" onClick={() => navigate(-1)}
            className="rounded-full border border-hairline px-6 py-2.5 font-medium hover:border-rust hover:text-rust transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
