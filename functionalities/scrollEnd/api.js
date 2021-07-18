const sleep = ms => new Promise(res => setTimeout(res, ms));

const items = [...Array(26)].map((_, i) => ({ item: i + 1, index: i }));

export default async function getItems(from, offset) {
  await sleep(800);

  if (from >= items.length) return [];
  return items.slice(from, from + offset);
}
