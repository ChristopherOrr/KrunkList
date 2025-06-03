/* loadWishlist.js
 *
 * Generates a gallery of the user's Wishlisted Items
 * @params: None
 * @returns: None
 */

import {
  getItemData, // Function to return JSON data
  rarities, // Ordered list of Item Rarites
  isExcludedLabel, // List of skins to exclude listings button
  setObserver, // Observer for Fade Animations
} from "./utils.js";

let itemData;
const sound = new Audio("sounds/tick.mp3"); // Define sound file

(async function initializeWishlistGallery() {
  itemData = await getItemData(); // Load all JSON data files

  var localWishlistIDs = JSON.parse(localStorage.getItem("wishlist")) || []; // Import User's local wishlist

  if (localWishlistIDs.length === 0) {
    // If the locally stored list of IDs is null or empty, display the empty message
    console.log("Wishlist is currently empty.");
    const message = document.getElementById("message");
    message.innerHTML = "Your Wishlist is currently empty.";
  } else {
    // If localWishlist has items in it, copy the list of ItemIDs to myWishlist, sort and log
    myWishlist = localWishlistIDs;
    sortWishlist(myWishlist, itemData);
    console.log(myWishlist);
  }

  renderWishlistGallery(); // Begin rendering wishlist items
})();

/* function getItemProperties
 * Search through JSON files to find an item by ID
 */
function getItemProperties(lookupID, itemData) {
  for (const rarity of rarities) {
    const items = itemData[rarity];
    if (!items) continue; // Skip if items for this rarity aren't loaded
    const match = items.find((item) => item.id === lookupID);
    if (match) {
      return {
        url: match.url,
        label: match.label,
        rarity: rarity, // return Item Data
      };
    }
  }
  return null;
}

/* function sortWithlist(myWishlist)
 * Sorts the WishlistIDs in order of rarity
 */
export function sortWishlist(myWishlist) {
  myWishlist.sort(function (a, b) {
    const aRarity = getItemProperties(a, itemData).rarity;
    const bRarity = getItemProperties(b, itemData).rarity;
    return rarities.indexOf(aRarity) - rarities.indexOf(bRarity);
  });
}

let myWishlist = []; // Create an empty wishlist

/* function renderWishlistGallery()
 * Build items from JSON data
 */
function renderWishlistGallery() {
  for (var i = 0; i < myWishlist.length; i++) {
    // Iterate through each item in the wishlist
    const itemID = myWishlist[i];
    //console.log("Loaded Item " + itemID);
    let itemProperties = getItemProperties(itemID, itemData); // Search for and store the URL, Label and Rarity of an item
    if (itemProperties) {
      // If the itemID in myWishlist is also found in the gallery...
      var itemCard = document.createElement("div"); // Create a div with the class "item <rarity>"
      itemCard.className = "item " + itemProperties.rarity;

      var image = document.createElement("img"); // Create an img with the source of the found URL
      image.loading = "lazy";
      image.src = itemProperties.url;

      var itemLabel = document.createElement("h1"); // Create an item label element with itemProperties' label
      itemLabel.innerHTML = itemProperties.label;

      // Create button container
      var buttonContainer = document.createElement("div");

      // If the item is an NFT, Lunar, Mastery, Black Market or other non-listable item, give it a 2 button container
      if (isExcludedLabel(itemProperties.label, itemProperties.rarity)) {
        buttonContainer.className = "excluded-button-container";
      } else {
        buttonContainer.className = "default-button-container";
      }

      // Create the Item Info button
      const button1 = document.createElement("button");
      button1.innerHTML = "Info";
      button1.className = "button";
      button1.dataset.item_id = itemID; // Store item's ID in individual Info Button data attribute
      button1.addEventListener("click", function () {
        window.open("https://krunker.io/social.html?p=itemsales&i=" + this.dataset.item_id, "_blank");
      });

      buttonContainer.appendChild(button1); // Add Info Button to buttonContainer

      // Create the Listings or Lock button
      const button2 = document.createElement("button");
      // Create Unavailable button for every excluded-button-container class
      if (buttonContainer.classList.contains("excluded-button-container")) {
        button2.innerHTML = "🔒";
        button2.title = "Cannot Be Listed";
        button2.disabled = true;
        button2.className = "cannotBeSold";
      } else {
        // Create Listings button for every default-button-container class
        button2.innerHTML = "Listings";
        button2.className = "button";
        button2.dataset.item_id = itemID;
        button2.addEventListener("click", function () {
          window.open(
            "https://krunker.io/social.html?p=market&i=" + this.dataset.item_id, // Create an undefined URL button click listener
            "_blank"
          );
        });
      }

      buttonContainer.appendChild(button2); // Add Listings Button to buttonContainer

      // Create Remove from Wishlist button
      const button3 = document.createElement("button");
      button3.innerHTML = "Remove";
      button3.className = "removeButton";
      button3.dataset.item_id = itemID; // Store item's ID in individual Wishlist Button data attribute

      // When "Remove" button is clicked...
      button3.addEventListener("click", function () {
        sound.currentTime = 0; // rewind to start so it plays on every hover
        sound.play();

        button3.textContent = "Removing...";
        let removeIndex = myWishlist.indexOf(itemID); // Calculate the index to be removed required for .splice

        if (removeIndex !== -1) {
          // If the itemID exists...
          console.log("Item " + itemID + " (#" + (removeIndex + 1) + ") has been removed from your wishlist.");
          myWishlist.splice(removeIndex, 1); // Remove the item
          localStorage.setItem("wishlist", JSON.stringify(myWishlist)); // Update localStorage

          setTimeout(() => {
            window.location.reload(); // Reload the page to load the new localStorage
          }, 150);
        } else {
          console.log("Item " + itemID + " does not exist in your wishlist.");
        }
      });

      // Console Log currently hovered item
      button3.addEventListener("mouseover", function () {
        console.log("Currently hovering over item: " + this.dataset.item_id);
      });

      buttonContainer.appendChild(button3); // Add Remove Button to buttonContainer

      // Build Item Div
      itemCard.appendChild(image); // Place img inside of the div
      itemCard.appendChild(itemLabel); // Place label inside of the div
      itemCard.appendChild(buttonContainer); // place buttonContainer inside of the div
      document.getElementById("myWishlistGallery").appendChild(itemCard); // Place the item div inside wishlist gallery

      setObserver(itemCard); // Add observer to each itemCard for fade effects
    } else {
      console.log("Item ID not found.");
    }
  }

  // Find item elements to be rescaled
  const itemDivs = document.querySelectorAll(".item");
  const itemImages = document.querySelectorAll(".item img");
  const itemLabels = document.querySelectorAll(".item h1");

  // Find slider elements to control rescaling
  const slider = document.getElementById("slider");
  const sliderValue = document.getElementById("slider-value");
  const resetSliderLink = document.getElementById("reset-slider");

  sliderValue.textContent = slider.value; // Set GUI Slider Value

  /* function applyScale()
   *
   * Change the scale of all elements based on GUI Slider Value
   *
   * @params: GUIsize
   * @returns: None
   */
  function applyScale(GUIsize) {
    const value = parseInt(GUIsize, 10);
    const px = `${value}px`;
    const fontSize = `${value / 10}px`;

    // Get size of each div
    itemDivs.forEach((div) => {
      div.style.width = px;
      div.style.height = "";
    });

    // Get size of each img
    itemImages.forEach((img) => {
      img.style.width = px;
      img.style.height = "";
    });

    // Get size of each label
    itemLabels.forEach((label) => {
      label.style.fontSize = fontSize;
    });

    sliderValue.textContent = value; // Apply scale
  }

  /* function resetScale()
   *
   * Reset the scale of all elements when GUI Slider is clicked
   *
   * @params: None
   * @returns: None
   */
  function resetScale() {
    const defaultValue = parseInt(slider.defaultValue, 10); // Get default value as integer
    slider.value = defaultValue;
    applyScale(defaultValue); // Apply default scaling to elements

    // Reset sizes of each div
    itemDivs.forEach((div) => {
      div.style.width = "";
      div.style.height = "";
    });

    // Reset sizes of each img
    itemImages.forEach((img) => {
      img.style.width = "";
      img.style.height = "";
    });

    // Reset sizes of each label
    itemLabels.forEach((label) => {
      label.style.fontSize = "";
    });
  }

  slider.addEventListener("input", () => applyScale(slider.value)); // Add scaling function to slider element input
  resetSliderLink.addEventListener("click", resetScale); // Add reset function to slider reset button click
}

// Bounce when button is clicked
document.body.addEventListener("click", (event) => {
  const button = event.target.closest(".button");
  if (!button) return;
  button.classList.add("buttonBounce");
  button.addEventListener("animationend", () => button.classList.remove("buttonBounce"), { once: true }); // Remove buttonBounce class

  if (button && !button.classList.contains("cannotBeSold")) {
    sound.currentTime = 0; // rewind to start so it plays on every hover
    sound.play();
  }
});

document.addEventListener("mouseover", (event) => {
  const item = event.target.closest(".item");
  if (!item) return;

  // Check if the mouse came from outside the `.item`
  if (!item.contains(event.relatedTarget)) {
    sound.currentTime = 0;
    sound.play();
  }
});
