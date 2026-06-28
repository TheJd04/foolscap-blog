import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const { data } = await api.get('/posts', { params: { mine: true, limit: 50 } });
        setPosts(data.posts);
      } catch (err) {
        toast.error('Could not load your posts');
      } finally {
        setLoading(false);
      }
    };
    fetchMine();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
      toast.success('Post deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete post');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-1">Your posts</h1>
          <p className="text-ink-soft">Signed in as {user?.name}</p>
        </div>
        <Link
          to="/new"
          className="rounded-full bg-ink text-paper px-5 py-2.5 text-sm font-medium hover:bg-teal-dark transition-colors"
        >
          + New post
        </Link>
      </div>

      {loading && <p className="text-ink-soft font-mono text-sm">Loading…</p>}

      {!loading && posts.length === 0 && (
        <div className="border border-dashed border-hairline rounded-lg py-16 text-center">
          <p className="text-ink-soft mb-4">You haven't written anything yet.</p>
          <Link to="/new" className="text-teal-dark font-medium hover:underline">
            Write your first post
          </Link>
        </div>
      )}

      <div className="divide-y divide-hairline">
        {posts.map((post) => (
          <div key={post._id} className="py-5 flex items-center justify-between gap-4">
            <div>
              <Link
                to={`/posts/${post.slug}`}
                className="font-display text-lg font-semibold hover:text-teal-dark transition-colors"
              >
                {post.title}
              </Link>
              <div className="flex items-center gap-2 text-xs font-mono text-ink-soft mt-1">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>·</span>
                <span className={post.published ? 'text-teal-dark' : 'text-amber'}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <div className="flex gap-3 text-sm whitespace-nowrap">
              <Link to={`/posts/${post.slug}/edit`} className="text-teal-dark hover:underline">
                Edit
              </Link>
              <button onClick={() => handleDelete(post._id)} className="text-rust hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
