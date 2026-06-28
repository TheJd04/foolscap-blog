import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Welcome to Foolscap!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-semibold mb-2">Create an account</h1>
      <p className="text-ink-soft mb-8">Start writing on Foolscap in under a minute.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border border-hairline rounded-lg px-4 py-2.5 focus:border-teal outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border border-hairline rounded-lg px-4 py-2.5 focus:border-teal outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="w-full border border-hairline rounded-lg px-4 py-2.5 focus:border-teal outline-none"
          />
          <p className="text-xs text-ink-soft mt-1">At least 6 characters.</p>
        </div>

        {error && <p className="text-rust text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink text-paper py-2.5 font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
        >
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-teal-dark font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
