const express = require("express");
const md5 = require("md5");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
const PORT = 5000;

const publicKey = process.env.MARVEL_PUBLIC_KEY;
const privateKey = process.env.MARVEL_PRIVATE_KEY;

app.get("/api/marvel", async (req, res) => {
  const { nameStartsWith } = req.query;
  const ts = Date.now().toString();
  const hash = md5(ts + privateKey + publicKey);

  const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${encodeURIComponent(
    nameStartsWith
  )}&limit=10&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

  try {
    const marvelRes = await fetch(url);
    const data = await marvelRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Marvel API failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Marvel proxy listening at http://localhost:${PORT}`);
});
