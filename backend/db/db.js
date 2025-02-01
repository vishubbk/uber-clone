const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
     
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1); 
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected! Trying to reconnect...");
    connectDb();
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
}

module.exports = connectDb;
