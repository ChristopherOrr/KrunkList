import { excludedLabels } from "./excludedLunarContainers.js";

// Order of Rarities

export const rarities = ["nft", "unob", "contra", "relic", "legendary", "epic", "rare", "uncommon", "free"];

let itemDataCache = null;

/* function getItemData()
 *
 * Fetch all skin info from JSON files
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

/* function isExcludedLabel()
 *
 * Checks if a skin exists in the excludedLabels list
 */
export function isExcludedLabel(label, rarity) {
  const normalizedLabel = label.trim().toLowerCase();
  return (
    excludedLabels.some((l) => l.toLowerCase() === normalizedLabel) || (normalizedLabel === "vandal" && rarity === "contra") // Also check for Vandal Contraband Item
  );
}

let observer;

/* function setObserver()
 *
 * Creates and sets an observer onto an item card to apply Fade Animations
 */
export function setObserver(itemCard) {
  if (!observer) {
    // Find height of navbar on user's screen size
    const navbarHeight = document.querySelector(".navbar").offsetHeight || 62;

    // Define observer once
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          } else {
            entry.target.classList.remove("fade-in");
          }
        });
      },
      {
        rootMargin: `-${navbarHeight + 20}px 0px -${navbarHeight}px 0px`,
        threshold: 0.1,
      }
    );
  }
  observer.observe(itemCard); // Set Observer
}
