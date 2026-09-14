const fs = require('fs');
const path = require('path');
const User = require('../models/User.model');
const Session = require('../models/Session.model');
const AppError = require('../utils/AppError');
const cloudinary = require('../config/cloudinary');

// ─── GET /api/users/profile ───────────────────────────────────────
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({ path: 'resumes', select: 'fileName originalName isDefault parseStatus createdAt' });

  res.status(200).json({ success: true, user });
};

// ─── PUT /api/users/profile ───────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  const { name, avatar, bio, summary, linkedin, github, leetcode } = req.body;

  const allowedFields = {};
  if (name !== undefined) allowedFields.name = name.trim();
  if (avatar !== undefined) allowedFields.avatar = avatar;
  if (bio !== undefined) allowedFields.bio = bio;
  if (summary !== undefined) {
    allowedFields.summary = summary;
    if (bio === undefined) allowedFields.bio = summary;
  } else if (bio !== undefined && summary === undefined) {
    allowedFields.summary = bio;
  }
  if (linkedin !== undefined) allowedFields.linkedin = linkedin.trim();
  if (github !== undefined) allowedFields.github = github.trim();
  if (leetcode !== undefined) allowedFields.leetcode = leetcode.trim();

  const user = await User.findByIdAndUpdate(req.user._id, allowedFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user });
};

// ─── POST /api/users/avatar ───────────────────────────────────────
exports.uploadAvatar = async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please select an image to upload.', 400));
  }

  const { filename, path: localFilePath } = req.file;

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  let avatarUrl = `${baseUrl}/uploads/avatars/${filename}`;

  // Attempt Cloudinary upload if configured — gracefully falls back to local storage.
  // The wrapper function ensures that ANY stream error event (including ones emitted
  // after the Promise has already settled) is always consumed by a listener so Node
  // never sees an unhandled 'error' event that would crash the process.
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    const tryCloudinaryUpload = () =>
      new Promise((resolve, reject) => {
        let settled = false;

        // After first settlement, further calls become silent noops —
        // but the listener REMAINS attached so the stream/readStream never
        // emits an unhandled 'error' event.
        const onError = (err) => { if (!settled) { settled = true; reject(err); } };
        const onResult = (err, result) => {
          if (err) return onError(err);
          if (!settled) { settled = true; resolve(result); }
        };

        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'ai-interview/avatars',
            resource_type: 'image',
            transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
            public_id: `avatar-${req.user._id}-${Date.now()}`,
          },
          onResult
        );

        // Permanent listeners — still active after settlement, so no unhandled events.
        stream.on('error', onError);

        const readStream = fs.createReadStream(localFilePath);
        readStream.on('error', onError);
        readStream.pipe(stream);
      });

    try {
      const result = await tryCloudinaryUpload();
      if (result && result.secure_url) {
        avatarUrl = result.secure_url;
        // Remove local temp file after a successful Cloudinary upload
        try { fs.unlinkSync(localFilePath); } catch (_) {}
      }
    } catch (cloudErr) {
      console.warn('[AvatarUpload] Cloudinary upload skipped, using local storage:', cloudErr.message);
      // Local file is kept as the fallback — nothing to clean up
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatarUrl },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile photo updated successfully.',
    avatarUrl,
    user,
  });
};

// ─── DELETE /api/users/avatar ─────────────────────────────────────
exports.deleteAvatar = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError('User not found.', 404));

  user.avatar = null;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile photo removed successfully.',
    user,
  });
};

// ─── PUT /api/users/change-password ───────────────────────────────
exports.changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully.' });
};

// ─── GET /api/users/dashboard ─────────────────────────────────────
exports.getDashboard = async (req, res) => {
  const userId = req.user._id;

  const [totalSessions, completedSessions, recentSessions] = await Promise.all([
    Session.countDocuments({ userId }),
    Session.countDocuments({ userId, status: 'completed' }),
    Session.find({ userId, status: 'completed' })
      .sort('-createdAt')
      .limit(5)
      .populate({ path: 'interviewId', select: 'jobTitle company experienceLevel' }),
  ]);

  const scoreAgg = await Session.aggregate([
    { $match: { userId, status: 'completed', overallScore: { $ne: null } } },
    { $group: { _id: null, avgScore: { $avg: '$overallScore' }, maxScore: { $max: '$overallScore' } } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalSessions,
      completedSessions,
      averageScore: scoreAgg[0]?.avgScore?.toFixed(1) ?? 0,
      bestScore: scoreAgg[0]?.maxScore ?? 0,
      recentSessions,
    },
  });
};
