const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Post = require("../models/Post");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Get published posts (public)
router.get("/public", async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10 } = req.query;
    let query = { status: "published" };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const posts = await Post.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalPosts: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single published post (public)
router.get("/public/:id", async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      status: "published",
    }).populate("author", "name email");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single published post by slug (public)
router.get("/public/slug/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      status: "published",
    }).populate("author", "name email");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all posts (public for published, user's own for drafts)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find({
      $or: [{ status: "published" }, { author: req.user.userId }],
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single post
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user can view this post
    if (
      post.status === "draft" &&
      post.author._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new post
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, content, excerpt, status, category, tags } = req.body;

      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const post = new Post({
        title,
        content,
        excerpt,
        image: req.file ? "/uploads/" + req.file.filename : undefined,
        category: category || "Anime",
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        slug,
        status: status || "draft",
        author: req.user.userId,
      });

      await post.save();
      await post.populate("author", "name email");

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Update post
router.put(
  "/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if user owns the post
      if (post.author.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { title, content, excerpt, status, category, tags } = req.body;
      post.title = title || post.title;
      post.content = content || post.content;
      post.excerpt = excerpt || post.excerpt;
      post.image = req.file ? "/uploads/" + req.file.filename : post.image;
      post.status = status || post.status;
      post.category = category || post.category;
      post.tags = tags ? tags.split(",").map((tag) => tag.trim()) : post.tags;

      // Regenerate slug if title changed
      if (title) {
        post.slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      await post.save();
      await post.populate("author", "name email");

      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Delete post
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
