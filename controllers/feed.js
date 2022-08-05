const { validationResult } = require("express-validator/check");
const Post = require("../models/Post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: "Fetched Post",
        posts: posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 404;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Can not find the post");
        err.statusCode = 404;
        throw err;
      }
      res.status(200).json({
        message: "Post Fetched",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 404;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    next(error);
  }
  const { title, content } = req.body;
  // Create post in db
  const post = new Post({
    title: title,
    content: content,
    creator: { name: "Arslan Ahmed Arif" },
    imageUrl: "hell no",
  });
  post
    .save()
    .then((post) => {
      res.status(201).json({
        message: "Post created successfully!",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
