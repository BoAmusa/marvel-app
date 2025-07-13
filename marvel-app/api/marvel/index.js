const fetch = require("node-fetch");
const md5 = require("md5");

module.exports = async function (context, req) {
  const publicKey = process.env.MARVEL_PUBLIC_KEY;
  const privateKey = process.env.MARVEL_PRIVATE_KEY;
  const searchTerm = req.query.nameStartsWith || "Iron Man";
  const ts = Date.now().toString();
  const hash = md5(ts + privateKey + publicKey);

  const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${encodeURIComponent(
    searchTerm
  )}&limit=10&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    context.res = {
      status: 200,
      body: data,
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { error: "Marvel API failed", details: err.message },
    };
  }
};
