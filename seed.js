const mongoose = require("mongoose");
const Post = require("./models/Post");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/blogdb";

async function seedData() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB for seeding");

    // Create a default admin user if not exists
    const defaultPassword = "AnimeInsights2024!";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    let adminUser = await User.findOne({ email: "admin@animeinsights.com" });
    if (!adminUser) {
      adminUser = new User({
        name: "Anime Insights Admin",
        email: "admin@animeinsights.com",
        password: hashedPassword,
      });
      await adminUser.save();
      console.log(
        "Admin user created: admin@animeinsights.com / AnimeInsights2024!"
      );
    }

    // Delete existing posts
    await Post.deleteMany({});
    console.log("Existing posts deleted");

    // Sample posts data
    const samplePosts = [
      {
        title: "How Anime Openings Reflect Character Growth",
        excerpt:
          "Discover how iconic anime openings mirror the themes and growth of the characters you love.",
        content:
          "Anime openings are more than just catchy tunes accompanied by flashy visuals—they're a reflection of a character's journey, personality, and growth over the series. A well-crafted opening can give the audience subtle insights into the protagonist's mindset, foreshadow story developments, or reflect the emotional tone of the series. From Naruto's energetic themes to Attack on Titan's intense visuals, openings set the stage for the emotional rollercoaster ahead.",
        image: null, // No image upload in seed
        status: "published",
        author: adminUser._id,
      },
      {
        title: "Productivity Lessons From Naruto's Training Arcs",
        excerpt:
          "Learn how Naruto's determination and training routines can inspire your own productivity.",
        content:
          "Naruto's journey from an underdog to a legendary ninja offers a masterclass in perseverance, discipline, and productivity. His training arcs provide actionable lessons that can be applied in daily life to enhance personal and professional growth. Whether it's the classic 'never give up' attitude or the importance of consistent practice, Naruto teaches us that true power comes from relentless effort and belief in oneself.",
        image: null,
        status: "published",
        author: adminUser._id,
      },
      {
        title: "90s Anime Nostalgia: Why Old Classics Still Hit Different",
        excerpt:
          "Take a throwback journey into 90s anime and see why fans still cherish the classics.",
        content:
          "The 1990s were a golden era for anime, producing series that have left an indelible mark on fans worldwide. These shows aren't just fond memories—they continue to resonate with audiences because of their unique storytelling, memorable characters, and the distinct animation style that defined the decade. From Dragon Ball Z's epic battles to Sailor Moon's magical adventures, 90s anime captured the imagination of a generation and continues to influence modern anime today.",
        image: null,
        status: "draft", // One draft for testing
        author: adminUser._id,
      },
    ];

    // Insert posts
    const createdPosts = await Post.insertMany(samplePosts);
    console.log(`${createdPosts.length} posts seeded successfully`);

    console.log("Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedData();
