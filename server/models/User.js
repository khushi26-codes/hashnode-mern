const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  bio: { type: String, maxlength: 200, default: '' },
  avatarUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
