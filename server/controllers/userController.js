const User = require('../models/User');
const Post = require('../models/Post');

exports.getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name bio avatarUrl createdAt');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const posts = await Post.find({ author: user._id, status: 'published' })
      .populate('author', 'name bio avatarUrl').populate('tags', 'name slug').sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch (error) { next(error); }
};

exports.updateMyProfile = async (req, res, next) => {
  try {
    const { name, bio, avatarUrl } = req.body;
    if (name !== undefined && !name.trim()) return res.status(400).json({ message: 'Name cannot be empty.' });
    if (name !== undefined) req.user.name = name.trim();
    if (bio !== undefined) req.user.bio = String(bio).slice(0, 200);
    if (avatarUrl !== undefined) req.user.avatarUrl = avatarUrl.trim();
    await req.user.save();
    res.json({ user: { _id: req.user._id, name: req.user.name, email: req.user.email, bio: req.user.bio, avatarUrl: req.user.avatarUrl } });
  } catch (error) { next(error); }
};
