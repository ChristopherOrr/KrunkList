/* loadWishlist.js
 *
 * Generates a gallery of the user's Wishlisted Items
 * @params: None
 * @returns: None
 */

import {
  nft_urls,
  unob_urls,
  contra_urls,
  relic_urls,
  legendary_urls,
  epic_urls,
  rare_urls,
  uncommon_urls,
} from "./sortedUrls.js";

import {
  nft_labels,
  unob_labels,
  contra_labels,
  relic_labels,
  legendary_labels,
  epic_labels,
  rare_labels,
  uncommon_labels,
} from "./sortedLabels.js";

import {
  NFT_IDs,
  unob_IDs,
  contra_IDs,
  relic_IDs,
  legendary_IDs,
  epic_IDs,
  rare_IDs,
  uncommon_IDs,
} from "./sortedIDs.js";

import { excludedLabels } from "./excludedLunarContainers.js";

/* Define WishlistID search function
 * Returns a valid ItemID's Rarity, URL and Label
 */
function getItemProperties(itemID) {
  for (let i = 0; i < rarities.length; i++) {
    var rarity = rarities[i];
    var index = rarity.ids.indexOf(itemID); // Find the itemID within a Rarity ID array
    if (index !== -1) {
      let rarityName = rarity.name; // Find the rarity name
      let url = rarity.urls[index]; // Find the url
      let label = rarity.labels[index]; // Find the label
      return {
        url: url, // Return item data
        rarity: rarityName,
        label: label,
      };
    }
  }
  return null; // ID not found
}

/* Define ItemID Sort Function
 * Sorts the WishlistIDs
 */
export function sortWishlist(myWishlist) {
  myWishlist.sort(function (a, b) {
    const rarityOrder = [
      "common",
      "uncommon",
      "rare",
      "epic",
      "legendary",
      "relic",
      "contra",
      "unob",
      "nft",
    ];
    const aRarity = getItemProperties(a).rarity;
    const bRarity = getItemProperties(b).rarity;
    return rarityOrder.indexOf(bRarity) - rarityOrder.indexOf(aRarity);
  });
}

let myWishlist = []; // Create an empty wishlist
let button_id; // Create button_id for "Remove" button
var localWishlistIDs = JSON.parse(localStorage.getItem("wishlist")) || []; // Import User's local wishlist

var rarities = [
  // List of rarities, URLs and item IDs to be used to display an Item.
  { name: "nft", urls: nft_urls, ids: NFT_IDs, labels: nft_labels },
  { name: "unob", urls: unob_urls, ids: unob_IDs, labels: unob_labels },
  { name: "contra", urls: contra_urls, ids: contra_IDs, labels: contra_labels },
  { name: "relic", urls: relic_urls, ids: relic_IDs, labels: relic_labels },
  {
    name: "legendary",
    urls: legendary_urls,
    ids: legendary_IDs,
    labels: legendary_labels,
  },
  { name: "epic", urls: epic_urls, ids: epic_IDs, labels: epic_labels },
  { name: "rare", urls: rare_urls, ids: rare_IDs, labels: rare_labels },
  {
    name: "uncommon",
    urls: uncommon_urls,
    ids: uncommon_IDs,
    labels: uncommon_labels,
  },
];

if (localWishlistIDs.length === 0) {
  // If the locally stored list of IDs is null or empty, display the empty message
  console.log("Wishlist is currently empty.");
  const message = document.getElementById("message");
  message.innerHTML = "Your Wishlist is currently empty.";
} else {
  // If localWishlist has items in it, copy the list of ItemIDs to myWishlist, sort and log
  myWishlist = localWishlistIDs;
  sortWishlist(myWishlist);
  console.log(myWishlist);

  /* Load Wishlist */
  for (var i = 0; i < myWishlist.length; i++) {
    const itemID = myWishlist[i];
    console.log("Loaded Item " + itemID);
    let itemData = getItemProperties(itemID); // Search for the URL, Rarity and Label of an item
    if (itemData) {
      // If the itemID in myWishlist is also found in the gallery...
      var imageDiv = document.createElement("div"); // Create a div with the class "item <rarity>"
      imageDiv.className = "item " + itemData.rarity;

      var image = document.createElement("img"); // Create an img with the source of the found URL
      image.loading = "lazy";
      image.src = itemData.url;

      var itemLabel = document.createElement("h1"); // Create an item label element and set to found Label
      itemLabel.innerHTML = itemData.label;

      // Create button container
      var buttonContainer = document.createElement("div");

      // If the item is an NFT, Lunar, Mastery or Black Market item...
      if (
        excludedLabels.some(
          (label) =>
            itemLabel.innerHTML.trim().toLowerCase() === label.toLowerCase()
        ) ||
        (itemLabel.innerHTML.trim().toLowerCase() === "vandal" && // Do not create lunar button containers for non-mastery "Vandal" items
          rarity.name.toLowerCase() === "contra")
      ) {
        buttonContainer.className = "excluded-button-container"; // ...set to a 2-button spaced container
      } else {
        buttonContainer.className = "default-button-container"; // Otherwise, set to a 3-button spaced container
      }

      // Create Item Info button
      var button1 = document.createElement("button");
      button1.innerHTML = "Info";
      button1.className = "button";
      button1.addEventListener("click", function () {
        window.open(
          "https://krunker.io/social.html?p=itemsales&i=" +
            this.dataset.item_id,
          "_blank"
        );
      });

      buttonContainer.appendChild(button1);
      button1.dataset.item_id = itemID;

      // Create Item Listings button
      var button2 = document.createElement("button");

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
        button2.addEventListener("click", function () {
          window.open(
            "https://krunker.io/social.html?p=market&i=" + this.dataset.item_id, // Create an undefined URL button click listener
            "_blank"
          );
        });
      }

      buttonContainer.appendChild(button2);
      button2.dataset.item_id = itemID;

      // Create Remove from Wishlist button
      var button3 = document.createElement("button");
      button3.innerHTML = "Remove";
      button3.className = "removeButton";

      // When "Remove" button is clicked...
      button3.addEventListener("click", function () {
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

      buttonContainer.appendChild(button3);
      button3.dataset.item_id = itemID;

      // Build Page
      imageDiv.appendChild(image); // Place img inside of the div
      imageDiv.appendChild(itemLabel); // Place label inside of the div
      imageDiv.appendChild(buttonContainer); // place buttonContainer inside of the div
      document.getElementById("myWishlistGallery").appendChild(imageDiv); // Place the div inside of the wishlist gallery
    } else {
      console.log("Item ID not found.");
    }
  }
}

// For each RemoveButton, print ID to console and change button Content
const removeButtons = document.querySelectorAll(".removeButton");

// Add a mouseover event listener to each button element with the class .removeButton
removeButtons.forEach((button) => {
  button.addEventListener("mouseover", (event) => {
    // Print button ID aka. itemID from data attribute
    button_id = event.currentTarget.dataset.item_id;
    console.log("Currently hovering over item: " + button_id);
  });

  button.addEventListener("click", function () {
    // Change button text content. Does not revert as page reloads after an item is removed.
    button.textContent = "Removing...";
  });
});

const buttons = document.getElementsByClassName("button");
const sound = new Audio("sounds/tick.mp3");
// Add a tick sound to every button
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("mouseover", function () {
    sound.play();
  });
}

const removeButton = document.getElementsByClassName("removeButton");
// Add a tick sound to every removeButton
for (let i = 0; i < removeButton.length; i++) {
  removeButton[i].addEventListener("mouseover", function () {
    sound.play();
  });
}

const slider = document.getElementById("slider"); // Find slider
const sliderValue = document.getElementById("slider-value"); // Find sliderValue text element
const itemDivs = document.querySelectorAll(".item"); // Find all Items
const itemImages = document.querySelectorAll(".item img"); // Find all Item Images
const itemLabels = document.querySelectorAll(".item h1"); // Find all Item Labels
const resetSliderLink = document.getElementById("reset-slider"); // Find reset-slider navbar link

sliderValue.innerHTML = slider.value; // Set "sliderValue" text element to the default value of the slider

// Add event listener to the slider
slider.addEventListener("input", function () {
  const value = this.value; // Store the current value of the slider on function call

  // resize the Item Div
  itemDivs.forEach(function (itemDiv) {
    itemDiv.style.width = value + "px";
    itemDiv.style.height = value + "px";
  });

  // resize the Item Image
  itemImages.forEach(function (itemImg) {
    itemImg.style.width = value + "px";
    itemImg.style.height = value + "px";
  });

  // resize the Item Label
  itemLabels.forEach(function (itemTitle) {
    itemTitle.style.fontSize = value / 10 + "px";
  });
  sliderValue.innerHTML = value; //
});

// Add event listener to the resetSlider navBar link
resetSliderLink.addEventListener("click", function () {
  slider.value = slider.defaultValue; // Set the slider's value back to default
  sliderValue.innerHTML = slider.defaultValue; // Set the "sliderValue" text element back to default

  // Reset Item width and height
  const itemDivs = document.querySelectorAll(".item");
  itemDivs.forEach(function (itemDiv) {
    itemDiv.style.width = "";
    itemDiv.style.height = "";
  });

  // Reset Item Image width and height
  const itemImages = document.querySelectorAll(".item img");
  itemImages.forEach(function (itemImg) {
    itemImg.style.width = "";
    itemImg.style.height = "";
  });

  // Reset Item Label font size
  const itemLabels = document.querySelectorAll(".item h1");
  itemLabels.forEach(function (itemTitle) {
    itemTitle.style.fontSize = "";
  });
});
