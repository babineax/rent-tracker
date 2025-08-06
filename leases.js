const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

// POST route to add a lease
router.post("/add", async (req, res) => {
  const {
    tenant_id, property_id, start_date,
    end_date, rent_amount, payment_frequency, status
  } = req.body;

  const { data, error } = await supabase
    .from("leases")
    .insert([{
      tenant_id, property_id, start_date,
      end_date, rent_amount, payment_frequency, status
    }]);

  if (error) return res.status(400).send(error.message);
  res.send(data);
});

module.exports = router;
