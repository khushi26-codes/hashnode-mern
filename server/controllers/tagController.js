const Tag = require('../models/Tag');
const Post = require('../models/Post');

exports.listTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().sort({ name: 1 }).lean();
    const counts = await Post.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } }
    ]);
    const countMap = new Map(counts.map(item => [String(item._id), item.count]));
    res.json({ tags: tags.map(tag => ({ ...tag, postCount: countMap.get(String(tag._id)) || 0 })) });
  } catch (error) { next(error); }
};

exports.postsByTag = async (req, res, next) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });
    if (!tag) return res.json({ tag: null, posts: [] });
    const posts = await Post.find({ status: 'published', tags: tag._id })
      .populate('author', 'name bio avatarUrl').populate('tags', 'name slug').sort({ createdAt: -1 });
    res.json({ tag, posts });
  } catch (error) { next(error); }
};
