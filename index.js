const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const leaseRoutes = require("./routes/leases");
const authRoutes = require("./routes/auth");

app.use(cors());
app.use(express.json());

app.use("/api/leases", leaseRoutes);
app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
