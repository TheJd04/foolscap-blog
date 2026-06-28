import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CommentSection({ postId, comments, setComments }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { content });
      setComments([data.comment, ...comments]);
      setContent('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not post your comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete comment');
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-hairline">
      <h2 className="font-display text-xl font-semibold mb-5">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add to the discussion…"
            rows={3}
            className="w-full border border-hairline rounded-lg px-4 py-3 text-sm focus:border-teal outline-none resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="mt-2 rounded-full bg-ink text-paper px-5 py-2 text-sm font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
          >
            {submitting ? 'Posting…' : 'Post comment'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-ink-soft mb-8">
          Log in to join the discussion.
        </p>
      )}

      <ul className="space-y-5">
        {comments.map((comment) => (
          <li key={comment._id} className="text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-ink">{comment.author?.name || 'Unknown'}</span>
              <div className="flex items-center gap-3 text-xs text-ink-soft font-mono">
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                {user && comment.author?._id === user._id && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-rust hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            <p className="text-ink-soft leading-relaxed">{comment.content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
