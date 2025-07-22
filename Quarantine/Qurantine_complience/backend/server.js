// i am insider main branch 
const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON bodies

const allowedArea = {
  latitude: 27.4924134, // Center latitude
  longitude: 77.673673, // Center longitude
  radius: 500, // Radius in meters
};

// Haversine formula to calculate distance
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon1 - lon2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Default route to verify the server is running
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Route to handle location updates
app.post("/send-location", (req, res) => {
  const { latitude, longitude } = req.body;

  console.log("Received Coordinates:", latitude, longitude); // Log received coordinates

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Invalid coordinates" });
  }

  const distance = haversine(
    latitude,
    longitude,
    allowedArea.latitude,
    allowedArea.longitude
  );

  console.log("Calculated Distance:", distance, "meters"); // Log calculated distance

  // Send the response with distance
  res.json({
    distance: distance, // Include the calculated distance
    message:
      distance <= allowedArea.radius
        ? "You are within the allowed area!"
        : `You are ${Math.round(distance - allowedArea.radius)} meters outside the allowed area!`,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
