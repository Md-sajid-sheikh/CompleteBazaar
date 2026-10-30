const mongoose = require("mongoose");

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); //MongoDB connection mein DNS error fix karne ki koshish ke liye add karte hain.


const connectDB = async () => {
  try {

    const mongoUri =
      process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI, MONGO_URL, or MONGO_URI is not set in the environment"
      );
    }

    await mongoose.connect(mongoUri);
    const database = mongoose.connection.db;
    const usersCollectionExists = await database
      .listCollections({ name: "users" }, { nameOnly: true })
      .hasNext();

    if (usersCollectionExists) {
      const userCollection = database.collection("users");
      const indexes = await userCollection.indexes();

      if (indexes.some((index) => index.name === "username_1")) {
        await userCollection.dropIndex("username_1");
        console.log("Removed obsolete users.username_1 index");
      }
    }

    console.log("MongoDB connected successfully");
    
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
  
