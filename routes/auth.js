const express = require("express"); // Importing express
const admin = require("firebase-admin");// Importing Firebase Admin SDK
const router = express.Router();// Creating a new router instance for handling routes to manage authentication

// Initialize Firebase Admin with service account
const serviceAccount = require("../firebase-admin-key.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} // Initialize Firebase Admin only if it hasn't been initialized yet for the purpose of managing user authentication

// Set user role (tenant or landlord)
router.post("/setUserRole", async (req, res) => {
  const { uid, role } = req.body;

  if (!["tenant", "landlord"].includes(role)) {
    return res.status(400).send("Invalid role");
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    res.send("Role set successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
