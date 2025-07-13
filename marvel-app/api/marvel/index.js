const fetch = require("node-fetch");
const md5 = require("md5");

module.exports = async function (context, req) {
  const publicKey = process.env.MARVEL_PUBLIC_KEY;
  const privateKey = process.env.MARVEL_PRIVATE_KEY;
  const searchTerm = req.query.nameStartsWith || "Iron Man";

  context.log(`🔍 Received request to search: ${searchTerm}`);

  if (!publicKey || !privateKey) {
    context.log.error(
      "❌ Missing MARVEL_PUBLIC_KEY or MARVEL_PRIVATE_KEY in environment variables."
    );
    context.res = {
      status: 500,
      body: {
        error: "Missing Marvel API credentials in environment variables.",
      },
    };
    return;
  }

  const ts = Date.now().toString();
  const hash = md5(ts + privateKey + publicKey);
  const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${encodeURIComponent(
    searchTerm
  )}&limit=10&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

  context.log(`🌐 Fetching from Marvel API: ${url}`);

  try {
    const response = await fetch(url);
    context.log(`📡 Marvel API response status: ${response.status}`);

    const data = await response.json();

    if (!response.ok) {
      context.log.error("⚠️ Marvel API error response:", data);
      context.res = {
        status: response.status,
        body: {
          error: "Marvel API returned an error.",
          details: data,
        },
      };
      return;
    }

    context.log(
      `✅ Successfully retrieved ${data.data?.results?.length || 0} characters.`
    );
    context.res = {
      status: 200,
      body: data,
    };
  } catch (err) {
    context.log.error("🔥 Marvel API fetch failed:", err);
    context.res = {
      status: 500,
      body: { error: "Marvel API fetch failed", details: err.message },
    };
  }
};
