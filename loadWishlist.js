/* loadWishlist.js
 *
 * Generates a gallery of the user's Wishlisted Items
 * @params: None
 * @returns: None
 */

import { getItemData, rarities, isExcludedLabel } from "./utils.js";

let itemData;
const sound = new Audio("sounds/tick.mp3");

(async function initializeWishlistGallery() {
  itemData = await getItemData(); // Load all rarity JSON files (cached if repeated)

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

  renderWishlistGallery(); // Now it's safe to use getItemProperties
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
        rarity: rarity,
      };
    }
  }
  return null;
}

/* Define ItemID Sort Function
 * Sorts the WishlistIDs
 */
export function sortWishlist(myWishlist) {
  myWishlist.sort(function (a, b) {
    const aRarity = getItemProperties(a, itemData).rarity;
    const bRarity = getItemProperties(b, itemData).rarity;
    return rarities.indexOf(aRarity) - rarities.indexOf(bRarity);
  });
}

let myWishlist = []; // Create an empty wishlist

function renderWishlistGallery() {
  /* Load Wishlist */
  for (var i = 0; i < myWishlist.length; i++) {
    const itemID = myWishlist[i];
    console.log("Loaded Item " + itemID);
    let itemProps = getItemProperties(itemID, itemData); // Search for the URL, Rarity and Label of an item
    if (itemProps) {
      // If the itemID in myWishlist is also found in the gallery...
      var imageDiv = document.createElement("div"); // Create a div with the class "item <rarity>"
      imageDiv.className = "item " + itemProps.rarity;

      var image = document.createElement("img"); // Create an img with the source of the found URL
      image.loading = "lazy";
      image.src = itemProps.url;

      var itemLabel = document.createElement("h1"); // Create an item label element and set to found Label
      itemLabel.innerHTML = itemProps.label;

      // Create button container
      var buttonContainer = document.createElement("div");

      // If the item is an NFT, Lunar, Mastery or Black Market item...
      if (isExcludedLabel(itemProps.label, itemProps.rarity)) {
        buttonContainer.className = "excluded-button-container";
      } else {
        buttonContainer.className = "default-button-container";
      }

      // Create Item Info button
      const button1 = document.createElement("button");
      button1.innerHTML = "Info";
      button1.className = "button";
      button1.dataset.item_id = itemID; // Add item's ID to Info Button data attribute
      button1.addEventListener("click", function () {
        window.open(
          "https://krunker.io/social.html?p=itemsales&i=" +
            this.dataset.item_id,
          "_blank"
        );
      });

      buttonContainer.appendChild(button1);

      // Create Item Listings button
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

      buttonContainer.appendChild(button2);

      // Create Remove from Wishlist button
      const button3 = document.createElement("button");
      button3.innerHTML = "Remove";
      button3.className = "removeButton";
      button3.dataset.item_id = itemID;

      // When "Remove" button is clicked...
      button3.addEventListener("click", function () {
        button3.textContent = "Removing...";
        let removeIndex = myWishlist.indexOf(itemID); // Calculate the index to be removed required for .splice

        if (removeIndex !== -1) {
          // If the itemID exists...
          console.log(
            "Item " +
              itemID +
              " (#" +
              (removeIndex + 1) +
              ") has been removed from your wishlist."
          );
          myWishlist.splice(removeIndex, 1); // Remove the item
          localStorage.setItem("wishlist", JSON.stringify(myWishlist)); // Update localStorage
          window.location.reload(); // Reload the page to load the new localStorage
        } else {
          console.log("Item " + itemID + " does not exist in your wishlist.");
        }
      });

      button3.addEventListener("mouseover", function () {
        // Print button ID aka. itemID from data attribute
        console.log("Currently hovering over item: " + this.dataset.item_id);
      });

      buttonContainer.appendChild(button3);

      // Build Page
      imageDiv.appendChild(image); // Place img inside of the div
      imageDiv.appendChild(itemLabel); // Place label inside of the div
      imageDiv.appendChild(buttonContainer); // place buttonContainer inside of the div
      document.getElementById("myWishlistGallery").appendChild(imageDiv); // Place the div inside of the wishlist gallery
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

  sliderValue.textContent = slider.value;

  // Apply scale to page elements
  function applyScale(rawValue) {
    const value = parseInt(rawValue, 10);
    const px = `${value}px`;
    const fontSize = `${value / 10}px`;

    // Get sizes of each element
    itemDivs.forEach((div) => {
      div.style.width = px;
      div.style.height = px;
    });

    itemImages.forEach((img) => {
      img.style.width = px;
      img.style.height = px;
    });

    itemLabels.forEach((label) => {
      label.style.fontSize = fontSize;
    });

    sliderValue.textContent = value;
  }

  // Helper: Reset scale styles
  function resetScale() {
    const defaultValue = parseInt(slider.defaultValue, 10); // Get default value as integer
    slider.value = defaultValue;
    applyScale(defaultValue);

    // Reset sizes of each element
    itemDivs.forEach((div) => {
      div.style.width = "";
      div.style.height = "";
    });

    itemImages.forEach((img) => {
      img.style.width = "";
      img.style.height = "";
    });

    itemLabels.forEach((label) => {
      label.style.fontSize = "";
    });
  }

  slider.addEventListener("input", () => applyScale(slider.value)); // Add scaling function to slider element
  resetSliderLink.addEventListener("click", resetScale); // Add reset function to slider reset button
}

// Play Sound when Button is hovered
document.addEventListener("mouseover", function (event) {
  const button = event.target.closest("button");
  if (button && !button.classList.contains("cannotBeSold")) {
    sound.currentTime = 0; // rewind to start so it plays on every hover
    sound.play();
  }
});
