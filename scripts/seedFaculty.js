require("dotenv").config();
const mongoose = require("mongoose");
const Faculty = require("../models/Faculty");

async function seed() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/eduwatch";
  await mongoose.connect(uri);
  const userId = String(process.env.DEMO_FACULTY_USER_ID || "FACULTY001").trim().toUpperCase();
  const name = process.env.DEMO_FACULTY_NAME || "Demo Faculty";
  await Faculty.updateOne({ userId }, { $set: { name, department: "Academic Team" } }, { upsert: true });
  console.log(`Faculty demo account ready: ${userId}`);
  console.log("This demo account uses User ID only. Add password authentication before real deployment.");
  await mongoose.disconnect();
}
seed().catch(error => { console.error(error); process.exit(1); });
