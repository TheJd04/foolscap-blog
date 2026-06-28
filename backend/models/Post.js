const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    coverImage: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Build a unique, URL-friendly slug from the title
postSchema.pre('save', async function (next) {
  if (!this.isModified('title') && this.slug) return next();

  const base = slugify(this.title, { lower: true, strict: true });
  let candidate = base;
  let counter = 1;

  // Guarantee uniqueness even if two posts share a title
  while (
    await mongoose.models.Post.findOne({
      slug: candidate,
      _id: { $ne: this._id },
    })
  ) {
    candidate = `${base}-${counter++}`;
  }

  this.slug = candidate;

  if (!this.excerpt) {
    const plainText = this.content.replace(/[#_*`>\n]/g, ' ').trim();
    this.excerpt = plainText.slice(0, 160) + (plainText.length > 160 ? '…' : '');
  }

  next();
});

postSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);
