import express from "express";
import fetch from "node-fetch";
const app = express();

app.use(express.json());

app.post("/create", async (req, res) => {
  try {
    const { domain, ptla, username } = req.body;

    const createUser = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ptla}`,
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email: `${username}@unli.nael`,
        username,
        first_name: username,
        last_name: "Unli",
        password: username + Math.random().toString(36).substring(2, 6)
      })
    });

    const data = await createUser.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Proxy jalan di http://localhost:3000"));
