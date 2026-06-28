import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PostCard from '../components/PostCard';

const SkeletonCard = () => (
  <div className="border border-hairline rounded-xl overflow-hidden bg-paper animate-pulse h-full">
    <div className="w-full h-44 bg-hairline/40" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-1/3 bg-hairline/50 rounded" />
      <div className="h-6 w-3/4 bg-hairline/60 rounded" />
      <div className="h-4 w-5/6 bg-hairline/50 rounded" />
      <div className="pt-4 border-t border-hairline/50 flex justify-between items-center">
        <div className="h-3 w-1/4 bg-hairline/50 rounded" />
        <div className="h-3 w-1/6 bg-hairline/60 rounded" />
      </div>
    </div>
  </div>
);

const SkeletonFeatured = () => (
  <div className="border border-hairline rounded-2xl overflow-hidden bg-paper flex flex-col md:flex-row animate-pulse h-full min-h-[300px]">
    <div className="w-full md:w-3/5 h-64 md:h-auto bg-hairline/40" />
    <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <div className="h-4 w-1/3 bg-hairline/50 rounded" />
        <div className="h-8 w-4/5 bg-hairline/60 rounded" />
        <div className="h-4 w-full bg-hairline/50 rounded" />
        <div className="h-4 w-5/6 bg-hairline/50 rounded" />
      </div>
      <div className="pt-4 border-t border-hairline/50 flex justify-between items-center">
        <div className="h-6 w-1/3 bg-hairline/50 rounded-full" />
        <div className="h-4 w-1/4 bg-hairline/60 rounded" />
      </div>
    </div>
  </div>
);

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag') || '';
  const [searchInput, setSearchInput] = useState(search);
  
  // Newsletter state
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (tag) params.tag = tag;
      
      const { data } = await api.get('/posts', { params });
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load posts');
    } finally {
      setLoading(false);
    }
  }, [search, tag]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Sync search input when search param changes externally (e.g. back button)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchInput.trim()) params.search = searchInput.trim();
    if (tag) params.tag = tag;
    setSearchParams(params);
  };

  const handleTagClick = (clickedTag) => {
    const params = {};
    if (search) params.search = search;
    if (tag !== clickedTag) params.tag = clickedTag;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    setNewsletterError('');
    
    // Simulate API registration
    setTimeout(() => {
      setSubmitting(false);
      setSubscribed(true);
      setEmail('');
    }, 1200);
  };

  // Collect top tags from loaded posts to offer quick filters
  const extractedTags = posts.reduce((acc, post) => {
    if (post.tags) {
      post.tags.forEach((t) => {
        const clean = t.trim();
        if (clean && !acc.includes(clean)) acc.push(clean);
      });
    }
    return acc;
  }, []);

  const hasFilters = search || tag;
  const showHero = !hasFilters;
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="w-full">
      {/* 1. Hero Section (Editorial Intro) */}
      {showHero && (
        <section className="bg-panel border-b border-hairline py-20 md:py-28 px-6 text-center animate-fade-in relative overflow-hidden">
          {/* Subtle art elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-ink)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-grid)" />
            </svg>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-ink leading-tight tracking-tight mb-6 max-w-3xl mx-auto">
              Thoughts, essays & journals.<br />
              <span className="text-teal font-medium italic">Beautifully set in ink.</span>
            </h1>
            
            <p className="text-ink-soft text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto mb-10">
              A premium, distraction-free home for fine writing and independent ideas. Read stories from a creative community of writers, or start sharing your own.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to="/new"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-ink text-paper text-sm font-semibold tracking-wide hover:bg-teal transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 text-center cursor-pointer"
                >
                  Write a Post
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-ink text-paper text-sm font-semibold tracking-wide hover:bg-teal transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 text-center cursor-pointer"
                >
                  Start Writing
                </Link>
              )}
              
              <button
                onClick={() => {
                  document.getElementById('feed-start')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-hairline text-ink text-sm font-semibold hover:border-ink hover:bg-paper/50 transition-all duration-300 text-center cursor-pointer"
              >
                Browse Articles
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main content Area */}
      <div id="feed-start" className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        
        {/* 2. Controls Area (Search & Tag Filtering) */}
        <div className="mb-12 border-b border-hairline/60 pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink">
                {hasFilters ? (
                  search ? `Search results for "${search}"` : `Entries tagged #${tag}`
                ) : (
                  'Latest entries'
                )}
              </h2>
              <p className="text-xs text-ink-soft mt-1">
                {hasFilters ? 'Displaying filtered collection of writing.' : 'Fresh writing from the Foolscap community.'}
              </p>
            </div>

            {/* Clean, custom Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search title, content, tags…"
                  className="w-full border border-hairline rounded-full px-5 py-2.5 pl-11 text-xs focus:border-teal bg-paper focus:bg-paper transition-all outline-none"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft opacity-60">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
              </div>
              <button
                type="submit"
                className="rounded-full bg-ink text-paper px-6 py-2.5 text-xs font-semibold hover:bg-teal transition-all duration-300 cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Dynamic Categories / Tag Filtering Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xxs uppercase tracking-wider font-mono text-ink-soft mr-2">
              Browse tags:
            </span>
            <button
              onClick={() => setSearchParams(search ? { search } : {})}
              className={`text-xxs font-mono px-3 py-1 rounded-full border transition-all ${
                !tag
                  ? 'bg-teal border-teal text-paper'
                  : 'border-hairline text-ink-soft hover:border-ink hover:text-ink bg-paper'
              }`}
            >
              All
            </button>
            
            {extractedTags.slice(0, 10).map((t) => (
              <button
                key={t}
                onClick={() => handleTagClick(t)}
                className={`text-xxs font-mono px-3 py-1 rounded-full border transition-all ${
                  tag === t
                    ? 'bg-teal border-teal text-paper'
                    : 'border-hairline text-ink-soft hover:border-ink hover:text-ink bg-paper'
                }`}
              >
                #{t}
              </button>
            ))}

            {hasFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xxs font-mono text-rust hover:underline ml-auto flex items-center gap-1"
              >
                Clear all filters ✕
              </button>
            )}
          </div>
        </div>

        {/* 3. Post Feed & Load States */}
        {loading ? (
          <div className="space-y-10">
            {!hasFilters && <SkeletonFeatured />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : error ? (
          <div className="border border-rust/20 bg-rust/5 rounded-xl py-6 px-8 text-center max-w-lg mx-auto">
            <p className="text-rust text-sm font-medium">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-3 text-xs font-mono text-teal hover:underline"
            >
              Try reloading
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="border border-dashed border-hairline rounded-2xl py-24 text-center max-w-xl mx-auto">
            <span className="text-4xl">✒</span>
            <p className="text-ink-soft text-sm mt-4 font-display italic">
              {hasFilters ? 'Nothing matches that search criteria yet.' : 'No posts have been published yet.'}
            </p>
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-4 inline-block text-xs font-mono bg-ink text-paper px-4 py-2 rounded-full hover:bg-teal transition-all"
              >
                Reset Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Show Featured Post at the top ONLY if no filters are active */}
            {!hasFilters && featuredPost && (
              <div className="mb-14">
                <PostCard post={featuredPost} featured={true} />
              </div>
            )}

            {/* Remaining Posts in clean modern Grid */}
            <div>
              {!hasFilters && remainingPosts.length > 0 && (
                <div className="border-b border-hairline/60 pb-3 mb-8">
                  <h3 className="text-xxs uppercase tracking-wider font-mono font-semibold text-ink-soft">
                    More from the archives
                  </h3>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(hasFilters ? posts : remainingPosts).map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Newsletter Panel (Bottom of feed) */}
        <section className="mt-24 md:mt-32 border border-hairline rounded-2xl p-8 md:p-12 bg-panel relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <span className="text-[10px] font-mono tracking-wider uppercase bg-amber-soft text-ink-soft px-2.5 py-1 rounded">
              Foolscap Gazette
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink mt-3.5 mb-2 leading-tight">
              Read wider. Think deeper.
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Get an occasional selection of essays, writings, and cultural logs. No spam, just beautiful literature delivered to your inbox.
            </p>
          </div>

          <div className="w-full md:w-auto max-w-sm flex-shrink-0">
            {subscribed ? (
              <div className="bg-teal/10 border border-teal/20 text-teal-dark p-6 rounded-xl text-center md:text-left animate-fade-in">
                <p className="font-semibold text-sm mb-1 flex items-center justify-center md:justify-start gap-1.5">
                  <span>✓</span> You're subscribed!
                </p>
                <p className="text-xs opacity-90">Thank you. Check your mailbox soon for confirmation.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={submitting}
                    className="border border-hairline rounded-full px-5 py-2.5 text-xs focus:border-teal outline-none bg-paper min-w-[240px] flex-1 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-ink text-paper px-6 py-2.5 text-xs font-semibold hover:bg-teal transition-all duration-300 disabled:opacity-50 cursor-pointer flex-shrink-0"
                  >
                    {submitting ? 'Signing up…' : 'Subscribe'}
                  </button>
                </div>
                {newsletterError && (
                  <p className="text-rust text-[10px] font-mono pl-3">{newsletterError}</p>
                )}
              </form>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
