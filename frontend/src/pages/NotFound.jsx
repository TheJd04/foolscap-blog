import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <p className="font-display text-6xl font-semibold text-teal-dark mb-4">404</p>
      <h1 className="font-display text-2xl font-semibold mb-2">Page not found</h1>
      <p className="text-ink-soft mb-6">
        Nothing's here. The page may have been moved or never existed.
      </p>
      <Link to="/" className="text-teal-dark font-medium hover:underline">
        Back to the front page
      </Link>
    </div>
  );
}
