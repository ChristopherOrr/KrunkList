/* loadItemsList.js
 *
 * Populates the image gallery by creating Item Divs
 * @params: None
 * @returns: None
 */

// getItemData: Function to return JSON data
// isExcludedLabel: List of skins to exclude listings button
// setObserver: Observer for Fade Animations
import { getItemData, isExcludedLabel, setObserver } from "./utils.js";

let itemData;

// Only render gallery items once JSON data has been fetched
(async function initializeGallery() {
  itemData = await getItemData(); // Store JSON data
  renderItems();
})();

/* function searchItems():
 * Displays items by name with search bar input
 */
function searchItems() {
  // Get user's input from the search bar
  const userInput = document
    .querySelector('input[type="text"]')
    .value.toLowerCase();

  // Get all item elements
  const items = document.querySelectorAll(".item");
  //const galleryResize = document.getElementByClassName(".gallery");

  // Hide or show each item based on user input
  items.forEach((item) => {
    const itemLabel = item.querySelector("h1").textContent.toLowerCase();
    if (!itemLabel.includes(userInput)) {
      item.style.display = "none"; // Hide
    } else {
      item.style.display = ""; // Show
    }
  });
}

/* function resetAnimations():
 * Reset Unobtainable Animations
 */
function resetAnimations() {
  const unobs = document.querySelectorAll(".unob, .unob h1");

  unobs.forEach((unob) => {
    const styles = window.getComputedStyle(unob);
    const animationName = styles.getPropertyValue("animation-name");
    if (animationName !== "none") {
      unob.style.animation = "none";
      unob.offsetHeight; // Reflow page
      unob.style.animation = null;
    }
  });
}

var myWishlist = []; // Initialize myWishlist as an empty array.

var localWishlistIDs = JSON.parse(localStorage.getItem("wishlist")) || []; // Import User's local wishlist

if (localWishlistIDs.length > 0) {
  // If localWishlist exists, copy it to myWishlist.
  myWishlist = localWishlistIDs;
  console.log(myWishlist);
} else {
  console.log("Wishlist is currently empty.");
}

// Driver Code

/* function renderItems():
 * Builds each item card element
 */
function renderItems() {
  for (const [rarity, items] of Object.entries(itemData)) {
    // Loop through all stored JSON data
    items.forEach((item) => {
      const { id, label, url } = item; // Each item has an id, label, and url

      const itemCard = document.createElement("div"); // Create item card div with Rarity
      itemCard.className = `item ${rarity}`;

      const image = document.createElement("img");
      image.loading = "lazy";
      image.src = url; // Add item's image with url from JSON data

      const itemLabel = document.createElement("h1");
      itemLabel.textContent = label; // Add item's label

      const buttonContainer = document.createElement("div"); // Create div to hold buttons

      // If an item is found within the excluded list, give it a 2 button container
      if (isExcludedLabel(label, rarity)) {
        buttonContainer.className = "excluded-button-container";
      } else {
        buttonContainer.className = "default-button-container";
      }

      // Create the Item Info button
      const button1 = document.createElement("button");
      button1.textContent = "Info";
      button1.className = "button";
      button1.dataset.item_id = id; // Store item's ID in individual Info Button data attribute
      button1.addEventListener("click", function () {
        window.open(
          "https://krunker.io/social.html?p=itemsales&i=" +
            this.dataset.item_id,
          "_blank"
        );
      });

      buttonContainer.appendChild(button1); // Add Info Button to buttonContainer

      // Create the Listings or Lock button
      const button2 = document.createElement("button");
      if (buttonContainer.classList.contains("excluded-button-container")) {
        button2.textContent = "🔒";
        button2.title = "Cannot Be Listed"; // If excluded, add lock button
        button2.disabled = true;
        button2.className = "cannotBeSold";
      } else {
        button2.textContent = "Listings";
        button2.className = "button";
        button2.dataset.item_id = id; // Store item's ID in individual Listings Button data attribute
        button2.addEventListener("click", function () {
          window.open(
            "https://krunker.io/social.html?p=market&i=" + this.dataset.item_id,
            "_blank"
          );
        });
      }

      buttonContainer.appendChild(button2); // Add Listings Button to buttonContainer

      // Create Add to Wishlist button
      const button3 = document.createElement("button");
      if (myWishlist.includes(id)) {
        button3.textContent = "In Wishlist";
        button3.disabled = true;
        button3.className = "inWishlistButton"; // If item exists in wishlist, display green inWishlistButton
      } else {
        button3.textContent = "Add to Wishlist";
        button3.className = "addToWishlistButton";
        button3.dataset.item_id = id; // Store item's ID in individual Wishlist Button data attribute

        // When Add to Wishlist button is clicked:
        button3.addEventListener("click", function () {
          myWishlist.push(id);
          localStorage.setItem("wishlist", JSON.stringify(myWishlist)); // Update Local Storage Wishlist
          console.log(`Item ${id} added to wishlist`);

          this.disabled = true;
          this.className = "inWishlistButton"; // Switch class so button remains green
          this.textContent = "Added!"; // Change button text content briefly

          setTimeout(() => {
            this.textContent = "In Wishlist"; // Revert button text content after 1 second
          }, 1000);
        });

        // Console Log currently hovered item
        button3.addEventListener("mouseover", function () {
          console.log("Currently hovering over item: " + this.dataset.item_id);
        });
      }

      buttonContainer.appendChild(button3); // Add Wishlist Button to buttonContainer

      // Build Item Div
      itemCard.appendChild(image); // Place img inside of the div
      itemCard.appendChild(itemLabel); // Place label inside of the div
      itemCard.appendChild(buttonContainer); // Place buttonContainer inside of the div
      document.getElementById("gallery").appendChild(itemCard); // Place the item div inside gallery

      setObserver(itemCard); // Add observer to each itemCard for fade effects
    });
  }
}

/* eventListener mySearchBar
 * When searchbar input changes, run searchItems() and resetAnimations()
 */
document.getElementById("mySearchBar").addEventListener("input", function () {
  searchItems(); // Run searchItems function on any text entered into mySearchBar
  resetAnimations(); // Reset animations anytime the search bar input changes
});

const sound = new Audio("sounds/tick.mp3"); // Declare sound file

// Play Sound when a button is hovered
document.addEventListener("mouseover", function (event) {
  const button = event.target.closest("button");
  if (button && !button.classList.contains("cannotBeSold")) {
    sound.currentTime = 0; // rewind sound
    sound.play();
  }
});
