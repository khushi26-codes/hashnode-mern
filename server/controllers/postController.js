const Post = require('../models/Post');
const Tag = require('../models/Tag');
const slugify = require('slugify');

const populatePost = (query) => query.populate('author', 'name bio avatarUrl').populate('tags', 'name slug');

async function makeUniqueSlug(title, currentId = null) {
  const base = slugify(title, { lower: true, strict: true }) || 'untitled-post';
  let slug = base;
  let count = 1;
  while (await Post.findOne({ slug, ...(currentId ? { _id: { $ne: currentId } } : {}) })) {
    count += 1;
    slug = `${base}-${count}`;
  }
  return slug;
}

async function resolveTags(tagNames = []) {
  const names = [...new Set(tagNames.map(tag => String(tag).trim().toLowerCase()).filter(Boolean))].slice(0, 10);
  const ids = [];
  for (const name of names) {
    const slug = slugify(name, { lower: true, strict: true }) || 'topic';
    let tag = await Tag.findOne({ name });
    if (!tag) {
      let uniqueSlug = slug;
      let suffix = 1;
      while (await Tag.findOne({ slug: uniqueSlug })) uniqueSlug = `${slug}-${++suffix}`;
      tag = await Tag.create({ name, slug: uniqueSlug });
    }
    ids.push(tag._id);
  }
  return ids;
}

exports.listPublished = async (req, res, next) => {
  try {
    const filter = { status: 'published' };
    if (req.query.search) filter.title = { $regex: escapeRegex(req.query.search), $options: 'i' };
    if (req.query.tag) {
      const tag = await Tag.findOne({ slug: req.query.tag.toLowerCase() });
      if (!tag) return res.json({ posts: [] });
      filter.tags = tag._id;
    }
    const posts = await populatePost(Post.find(filter).sort({ createdAt: -1 }));
    res.json({ posts });
  } catch (error) { next(error); }
};

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.getPublishedBySlug = async (req, res, next) => {
  try {
    const post = await populatePost(Post.findOne({ slug: req.params.slug, status: 'published' }));
    if (!post) return res.status(404).json({ message: 'Published post not found.' });
    res.json({ post });
  } catch (error) { next(error); }
};

exports.getMine = async (req, res, next) => {
  try {
    const posts = await populatePost(Post.find({ author: req.user._id }).sort({ updatedAt: -1 }));
    res.json({ posts });
  } catch (error) { next(error); }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, tags = [], coverImage = '', status = 'draft' } = req.body;
    if (!title?.trim() || !content?.trim()) return res.status(400).json({ message: 'Title and content are required.' });
    if (!['draft', 'published'].includes(status)) return res.status(400).json({ message: 'Status must be draft or published.' });
    const tagIds = await resolveTags(Array.isArray(tags) ? tags : String(tags).split(','));
    const excerpt = content.replace(/[#>*_`[\]()!-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 240);
    const post = await Post.create({
      title: title.trim(), slug: await makeUniqueSlug(title), content, excerpt, coverImage: coverImage.trim(),
      status, author: req.user._id, tags: tagIds
    });
    res.status(201).json({ post: await populatePost(Post.findById(post._id)) });
  } catch (error) { next(error); }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    if (String(post.author) !== String(req.user._id)) return res.status(403).json({ message: 'You can only edit your own posts.' });
    const { title, content, tags = [], coverImage = '', status = post.status } = req.body;
    if (title !== undefined && !title.trim()) return res.status(400).json({ message: 'Title cannot be empty.' });
    if (content !== undefined && !content.trim()) return res.status(400).json({ message: 'Content cannot be empty.' });
    if (!['draft', 'published'].includes(status)) return res.status(400).json({ message: 'Status must be draft or published.' });
    if (title !== undefined && title.trim() !== post.title) {
      post.title = title.trim();
      post.slug = await makeUniqueSlug(title, post._id);
    }
    if (content !== undefined) {
      post.content = content;
      post.excerpt = content.replace(/[#>*_`[\]()!-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 240);
    }
    if (Array.isArray(tags)) post.tags = await resolveTags(tags);
    if (coverImage !== undefined) post.coverImage = coverImage.trim();
    post.status = status;
    await post.save();
    res.json({ post: await populatePost(Post.findById(post._id)) });
  } catch (error) { next(error); }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    if (String(post.author) !== String(req.user._id)) return res.status(403).json({ message: 'You can only delete your own posts.' });
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully.' });
  } catch (error) { next(error); }
};
