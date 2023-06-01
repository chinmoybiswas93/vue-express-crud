const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "vue_crud",
  connectionLimit: 10,
});

// Serve the static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/api/items", (req, res) => {
  pool.query("SELECT * FROM items", (error, results) => {
    if (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ error: "Error fetching items" });
    } else {
      res.json(results);
    }
  });
});

app.post("/api/items", (req, res) => {
  const newItem = req.body.item;
  pool.query(
    "INSERT INTO items (name) VALUES (?)",
    [newItem],
    (error, results) => {
      if (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ error: "Error adding item" });
      } else {
        res.sendStatus(201);
      }
    }
  );
});

app.delete("/api/items/:id", (req, res) => {
  const itemId = req.params.id;
  pool.query("DELETE FROM items WHERE id = ?", itemId, (error, results) => {
    if (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ error: "Error deleting item" });
    } else {
      res.sendStatus(200);
    }
  });
});

app.put("/api/items/:id", (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body.item;
  pool.query(
    "UPDATE items SET ? WHERE id = ?",
    [updatedItem, itemId],
    (error, results) => {
      if (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ error: "Error updating item" });
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// Send the 'index.html' file for any other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
