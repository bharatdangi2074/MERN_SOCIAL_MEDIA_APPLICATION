const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getUserByUsername = async (req, res, next, username) => {
  try {
    const user = await User.findOne({ username: username });
    req.profile = user;
  } catch (error) {
    res.status(500).json(error);
  }
  next();
};

exports.updateUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(403).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({
        message: "Your account has been updated",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json({
      error: "You can update only your account!",
    });
  }
};

exports.deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: "Your account has been deleted",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json({
      error: "You can delete only your account!",
    });
  }
};

exports.getUser = async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.followUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json({
          message: "User has been followed",
        });
      } else {
        res.status(403).json({
          error: "You already follow this user",
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json({
      error: "You cannot follow yourself",
    });
  }
};

exports.unFollowUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json({
          message: "User has been unfollowed",
        });
      } else {
        res.status(403).json({
          error: "You doesnot follow this user",
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json({
      error: "You cannot follow yourself",
    });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.uploadImage = async (req, res) => {
  const { username } = req.params;
  const profile = req.body.profile;

  if (!req.file) {
    res.status(404).json({ error: "No file uploaded!" });
  }

  if (profile) {
    try {
      const user = await User.findOne({ username: username });

      await user.updateOne({
        $set: { profilePicture: req.file.path },
      });
      res.status(200).json({ username, url: req.file.path, profile: true });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    try {
      const user = await User.findOne({ username: username });
      await user.updateOne({
        $set: { coverPicture: req.file.path },
      });
      res.status(200).json({ username, url: req.file.path, profile: false });
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

exports.getFriendSuggestion = async (req, res) => {
  try {
    const totalUsers = await User.find();
    const friendSuggestion = totalUsers.filter(
      (user) =>
        !req.profile.followings.includes(user._id) &&
        user.username !== req.profile.username
    );
    res.status(200).json(friendSuggestion);
  } catch (error) {
    res.status(500).json(error);
  }
};
