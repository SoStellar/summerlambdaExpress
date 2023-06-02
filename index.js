import express from "express";
import pg from "pg";
import axios from "axios";

const app = express();

app.use(express.json());

app.post("/post", async (req, res) => {
  try {
    const value1 = req.body.value1; // Replace 'value1' with the actual key in your JSON

    // Create the PostgreSQL connection configuration
    const rdsConfig = {
      host: process.env.RDS_HOST,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DATABASE,
      port: process.env.RDS_PORT || 5432, // default PostgreSQL port
    };

    const client = new pg.Client(rdsConfig);
    await client.connect();

    // Insert values into the table
    const insertQuery = `INSERT INTO post (name) VALUES ($1) RETURNING *`; // Replace 'post' and 'name' with your actual table and column names
    const insertValues = [value1]; // Provide the value extracted from the JSON body

    const result = await client.query(insertQuery, insertValues);

    // Close the database connection
    await client.end();

    const insertedRow = result.rows[0];

    // Send a success response with the inserted data
    res
      .status(200)
      .json({ message: "Data inserted successfully", data: insertedRow });
  } catch (error) {
    console.error("Error inserting data into the table:", error);

    // Send an error response
    res.status(500).json({ message: "Error inserting data into the table" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Example code to send a POST request using axios
axios
  .post("http://localhost:3000/post", { value1: "John Doe" })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
