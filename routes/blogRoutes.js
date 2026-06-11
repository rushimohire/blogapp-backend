const express = require("express");
const router = express.Router();

const Blog = require("../models/Blog");
const upload = require("../multerConfig");
const authMiddleware = require("../middleware/authMiddleware");


// ====================================
// Create Blog
// ====================================

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
        image: req.file ? req.file.path : "",
        author: req.user.id,
      });

      await blog.save();

      const populatedBlog =
        await Blog.findById(blog._id).populate(
          "author",
          "name email"
        );

      res.status(201).json(populatedBlog);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// ====================================
// Get All Blogs
// ====================================

router.get("/", async (req, res) => {
    try {

        const blogs = await Blog.find()
            .populate(
                "author",
                "name email"
            )
            .sort({
                createdAt: -1,
            });

        res.json(blogs);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
});


// ====================================
// Get Single Blog
// ====================================

router.get("/:id", async (req, res) => {
    try {

        const blog =
            await Blog.findById(
                req.params.id
            ).populate(
                "author",
                "name email"
            );

        if (!blog) {
            return res.status(404).json({
                message:
                    "Blog not found",
            });
        }

        res.json(blog);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
});


// ====================================
// Update Blog
// ====================================

router.put(
    "/:id",
    authMiddleware,
    upload.single("image"),
    async (req, res) => {
        try {

            const existingBlog =
                await Blog.findById(
                    req.params.id
                );

            if (!existingBlog) {
                return res.status(404).json({
                    message: "Blog not found",
                });
            }

            if (
                existingBlog.author.toString() !==
                req.user.id
            ) {
                return res.status(403).json({
                    message:
                        "You are not authorized to edit this blog",
                });
            }

            const updatedBlog =
                await Blog.findByIdAndUpdate(
                    req.params.id,
                    {
                        title: req.body.title,
                        content: req.body.content,

                        image: req.file
                            ? req.file.filename
                            : existingBlog.image,
                    },
                    {
                        new: true,
                    }
                ).populate(
                    "author",
                    "name email"
                );

            res.json(updatedBlog);

        } catch (error) {

            res.status(500).json({
                message: error.message,
            });
        }
    }
);

// ====================================
// Delete Blog
// ====================================

router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {

            const blog =
                await Blog.findById(
                    req.params.id
                );

            if (!blog) {
                return res.status(404).json({
                    message: "Blog not found",
                });
            }

            if (
                blog.author.toString() !==
                req.user.id
            ) {
                return res.status(403).json({
                    message:
                        "You are not authorized to delete this blog",
                });
            }

            await Blog.findByIdAndDelete(
                req.params.id
            );

            res.json({
                message:
                    "Blog Deleted Successfully",
            });

        } catch (error) {

            res.status(500).json({
                message: error.message,
            });
        }
    }
);
module.exports = router;