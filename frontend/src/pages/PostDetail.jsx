import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import toast from 'react-hot-toast';

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/posts/${slug}`);
        setPost(data.post);
        const commentsRes = await api.get(`/posts/${data.post._id}/comments`);
        setComments(commentsRes.data.comments);
      } catch (err) {
        setError(err.response?.data?.message || 'Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success('Post deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete post');
    }
  };

  if (loading) {
    return <p className="text-center py-24 text-ink-soft font-mono text-sm">Loading…</p>;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-rust mb-4">{error}</p>
        <Link to="/" className="text-teal-dark hover:underline">Back to all posts</Link>
      </div>
    );
  }

  const isOwner = user && post.author?._id === user._id;
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <article className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-xs font-mono text-ink-soft mb-4">{date}</div>

      <h1 className="font-display text-4xl font-semibold leading-tight mb-3">{post.title}</h1>

      <div className="flex items-center justify-between mb-8 pb-6 border-b border-hairline">
        <p className="text-sm text-ink-soft">
          By <span className="font-medium text-ink">{post.author?.name}</span>
        </p>
        {isOwner && (
          <div className="flex gap-3 text-sm">
            <Link to={`/posts/${post.slug}/edit`} className="text-teal-dark hover:underline">
              Edit
            </Link>
            <button onClick={handleDelete} className="text-rust hover:underline">
              Delete
            </button>
          </div>
        )}
      </div>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt=""
          className="w-full rounded-lg mb-8 border border-hairline"
        />
      )}

      <div className="prose-content drop-cap text-ink whitespace-pre-wrap">
        {post.content}
      </div>

      {post.tags?.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-soft text-ink-soft"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <CommentSection postId={post._id} comments={comments} setComments={setComments} />
    </article>
  );
}
