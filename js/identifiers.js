// fetch data for Wikidata IDs from Wikipedia page titles
async function fetchWikidataFromWikipedia(name) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageprops&titles=${encodeURIComponent(name)}&origin=*`;
  console.log("Fetching Wikidata ID from Wikipedia:", url);

  try {
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    if (pages[pageId] && pages[pageId].pageprops?.wikibase_item) {
      console.log("Fetched Wikidata ID:", pages[pageId].pageprops.wikibase_item);
      return pages[pageId].pageprops.wikibase_item; // e.g., "Q868"
    }
  } catch (err) {
    console.error("Wikipedia → Wikidata fetch error:", err);
  }

  return null;
}
