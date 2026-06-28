import { Link } from 'react-router-dom';

const getHash = (str) => {
  let hash = 0;
  if (!str) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

const renderPlaceholderSVG = (post) => {
  const hash = getHash(post._id || post.slug || 'default');
  const hue1 = hash % 360;
  const hue2 = (hash + 75) % 360;
  const sat = 70 + (hash % 10);
  const light1 = 92 + (hash % 4);
  const light2 = 83 + (hash % 7);
  
  const shapeType = hash % 4;
  
  return (
    <svg className="w-full h-full object-cover" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`grad-${post._id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${hue1}, ${sat}%, ${light1}%)`} />
          <stop offset="100%" stopColor={`hsl(${hue2}, ${sat}%, ${light2}%)`} />
        </linearGradient>
        <pattern id={`grid-${post._id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(47, 111, 98, 0.06)" strokeWidth="1"/>
        </pattern>
      </defs>
      
      {/* Background */}
      <rect width="100%" height="100%" fill={`url(#grad-${post._id})`} />
      
      {/* Editorial Grid */}
      <rect width="100%" height="100%" fill={`url(#grid-${post._id})`} />
      
      {/* Dynamic Shapes */}
      {shapeType === 0 && (
        <>
          <circle cx={120 + (hash % 80)} cy={80 + (hash % 40)} r={35 + (hash % 25)} fill="rgba(47, 111, 98, 0.1)" />
          <circle cx={260 + (hash % 60)} cy={110 - (hash % 30)} r={55 + (hash % 20)} stroke="rgba(217, 154, 52, 0.16)" strokeWidth="1.5" />
          <circle cx={200 - (hash % 50)} cy={130 - (hash % 40)} r={12 + (hash % 10)} fill="rgba(181, 70, 47, 0.07)" />
        </>
      )}
      {shapeType === 1 && (
        <>
          <line x1="0" y1={50 + (hash % 60)} x2="400" y2={50 + (hash % 60)} stroke="rgba(47, 111, 98, 0.12)" strokeWidth="2" />
          <line x1={100 + (hash % 100)} y1="0" x2={100 + (hash % 100)} y2="200" stroke="rgba(217, 154, 52, 0.12)" strokeWidth="1.5" />
          <line x1="0" y1={110 + (hash % 50)} x2="400" y2={110 + (hash % 50)} stroke="rgba(181, 70, 47, 0.08)" strokeWidth="2.5" />
          <circle cx={100 + (hash % 100)} cy={50 + (hash % 60)} r="7" fill="var(--color-teal)" opacity="0.25" />
        </>
      )}
      {shapeType === 2 && (
        <>
          {Array.from({ length: 5 }).map((_, idx) => (
            <rect 
              key={idx} 
              x={50 + idx * 60 + (hash % 15)} 
              y={40 + (hash % 30) + (idx % 2) * 15} 
              width={25 + (hash % 20)} 
              height={25 + (hash % 20)} 
              fill="none" 
              stroke={idx % 2 === 0 ? "rgba(47, 111, 98, 0.12)" : "rgba(217, 154, 52, 0.16)"} 
              strokeWidth="1.5" 
            />
          ))}
          <circle cx={180 + (hash % 40)} cy={95} r="30" fill="rgba(47, 111, 98, 0.07)" />
        </>
      )}
      {shapeType === 3 && (
        <>
          <path d={`M 0 ${70 + (hash % 30)} C 120 ${130 + (hash % 20)}, 220 ${20 - (hash % 10)}, 400 ${150 + (hash % 30)}`} fill="none" stroke="rgba(47, 111, 98, 0.16)" strokeWidth="2.5" />
          <path d={`M 0 ${110 + (hash % 30)} C 140 ${50 - (hash % 20)}, 240 ${170 + (hash % 20)}, 400 ${90 - (hash % 15)}`} fill="none" stroke="rgba(217, 154, 52, 0.12)" strokeWidth="1.8" />
          <circle cx={220} cy={90} r="10" fill="rgba(181, 70, 47, 0.1)" />
        </>
      )}
    </svg>
  );
};

export default function PostCard({ post, featured = false }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate dynamic reading time
  const wordCount = post.content ? post.content.split(/\s+/).length : (post.excerpt ? post.excerpt.split(/\s+/).length : 0);
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  if (featured) {
    return (
      <article className="border border-hairline rounded-2xl overflow-hidden bg-paper flex flex-col md:flex-row h-full editorial-card shadow-sm hover:shadow-md animate-fade-in-up">
        {/* Cover Art Vector */}
        <div className="w-full md:w-3/5 h-64 md:h-auto min-h-[250px] relative overflow-hidden bg-panel">
          <Link to={`/posts/${post.slug}`} className="block w-full h-full">
            {renderPlaceholderSVG(post)}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent hover:from-black/0 transition-all duration-300" />
          </Link>
        </div>

        {/* Content Block */}
        <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-paper">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono text-ink-soft mb-3.5">
              <span className="bg-panel border border-hairline px-2 py-0.5 rounded text-[10px] uppercase font-semibold text-teal-dark tracking-wide">
                Featured Entry
              </span>
              <span>{date}</span>
              <span>·</span>
              <span>{readTime} min read</span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight mb-4">
              <Link
                to={`/posts/${post.slug}`}
                className="text-ink hover:text-teal transition-colors"
              >
                {post.title}
              </Link>
            </h2>

            <p className="text-ink-soft text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
              {post.excerpt}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {post.tags?.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono tracking-wider uppercase border border-hairline px-2.5 py-1 rounded-full bg-panel text-ink hover:bg-teal hover:text-paper hover:border-teal transition-all cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="pt-4 border-t border-hairline/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-dark text-paper font-display text-sm font-semibold flex items-center justify-center">
                  {post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-xs">
                  <p className="font-medium text-ink leading-tight">{post.author?.name || 'Unknown author'}</p>
                  <p className="text-xxs text-ink-soft font-mono">Contributor</p>
                </div>
              </div>
              
              <Link
                to={`/posts/${post.slug}`}
                className="text-xs font-mono font-medium text-teal hover:text-teal-dark flex items-center gap-1 group/btn"
              >
                Read Post
                <span className="transition-transform group-hover/btn:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard grid card
  return (
    <article className="border border-hairline rounded-xl overflow-hidden bg-paper flex flex-col h-full editorial-card shadow-sm animate-fade-in-up">
      {/* Cover Art Vector */}
      <div className="w-full h-44 relative overflow-hidden bg-panel border-b border-hairline">
        <Link to={`/posts/${post.slug}`} className="block w-full h-full">
          {renderPlaceholderSVG(post)}
        </Link>
      </div>

      {/* Content Block */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-ink-soft mb-2.5">
            <span>{date}</span>
            <span>·</span>
            <span>{readTime} min read</span>
          </div>

          <h2 className="font-display text-xl font-semibold leading-tight mb-3">
            <Link
              to={`/posts/${post.slug}`}
              className="text-ink hover:text-teal transition-colors line-clamp-2"
            >
              {post.title}
            </Link>
          </h2>

          <p className="text-ink-soft text-xs leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        <div>
          {post.tags?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-mono tracking-wide px-2 py-0.5 rounded-full border border-hairline bg-panel text-ink hover:bg-teal hover:text-paper hover:border-teal transition-all cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-hairline/60 flex items-center justify-between">
            <span className="text-xs text-ink-soft font-mono leading-none">
              By {post.author?.name || 'Unknown'}
            </span>
            <Link
              to={`/posts/${post.slug}`}
              className="text-xs font-mono font-medium text-teal hover:text-teal-dark flex items-center gap-1 group/btn"
            >
              Read <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
