import { excludedLabels } from "./excludedLunarContainers.js";

// Order of Rarities

export const rarities = [
  "nft",
  "unob",
  "contra",
  "relic",
  "legendary",
  "epic",
  "rare",
  "uncommon",
];

let itemDataCache = null;

/* function getItemData()
 * Fetch all skin info from JSON files
 *
 */
export async function getItemData() {
  if (itemDataCache) return itemDataCache;

  const itemData = {};

  for (const rarity of rarities) {
    const response = await fetch(`./JSON/${rarity}.json`);
    itemData[rarity] = await response.json();
  }

  itemDataCache = itemData; // Store in cache
  return itemData;
}

export function isExcludedLabel(label, rarity) {
  const normalized = label.trim().toLowerCase();
  return (
    excludedLabels.some((l) => l.toLowerCase() === normalized) ||
    (normalized === "vandal" && rarity === "contra")
  );
}
