/* loadItemsList.js
 *
 * Populates the image gallery by creating Items (Image + Label)
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

/* Import the list of Excluded Item Names for creating alternate button containers */
import { excludedLabels } from "./excludedLunarContainers.js";

/* functions
 * searchItems(): Displays item by name
 * resetAnimations(): Syncs unob animations
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

function resetAnimations() {
  const unobs = document.querySelectorAll(".unob, .unob h1");

  unobs.forEach((unob) => {
    const styles = window.getComputedStyle(unob);
    const animationName = styles.getPropertyValue("animation-name");
    if (animationName !== "none") {
      unob.style.animation = "none";
      unob.offsetHeight; // trigger reflow
      unob.style.animation = null;
    }
  });
}

/* variables
 * rarities, myWishlist, localWishlistIDs, buttonID
 */

var rarities = [
  // List of rarities and their arrays to be used in population
  { name: "nft", urls: nft_urls },
  { name: "unob", urls: unob_urls },
  { name: "contra", urls: contra_urls },
  { name: "relic", urls: relic_urls },
  { name: "legendary", urls: legendary_urls },
  { name: "epic", urls: epic_urls },
  { name: "rare", urls: rare_urls },
  { name: "uncommon", urls: uncommon_urls },
];

var myWishlist = []; // Initialize myWishlist as an empty array.

var localWishlistIDs = JSON.parse(localStorage.getItem("wishlist")) || []; // Import User's local wishlist

let button_id; // create a global variable to hold the hovered button ID

if (localWishlistIDs.length > 0) {
  // If localWishlist is not null, copy it to myWishlist.
  myWishlist = localWishlistIDs;
  console.log(myWishlist);
} else {
  console.log("Wishlist is currently empty.");
}

// Driver Code For Loop which iterates through and loads each item from the database to create Item Gallery
for (var i = 0; i < rarities.length; i++) {
  // Populate Gallery with list of URLs from each rarity
  var rarity = rarities[i];

  for (var j = 0; j < rarity.urls.length; j++) {
    var imageDiv = document.createElement("div"); // Create a div with the class "item <rarity>"
    imageDiv.className = "item " + rarity.name;

    var image = document.createElement("img"); // Create an img with the source of the current URL
    image.loading = "lazy";
    image.src = rarity.urls[j];

    var itemLabel = document.createElement("h1"); // Create an item label element

    // Based on rarity index, set the Item's Label and keep track of currentItemID
    switch (i) {
      case 0:
        itemLabel.innerHTML = "Gold Plated"; // General NFT Item Name
        var currentItemID = NFT_IDs[j];
        break;
      case 1:
        itemLabel.innerHTML = unob_labels[j]; // Individual Unob Item Names
        currentItemID = unob_IDs[j];
        break;
      case 2:
        itemLabel.innerHTML = contra_labels[j]; // Individual Contra Item Names
        currentItemID = contra_IDs[j];
        break;
      case 3:
        itemLabel.innerHTML = relic_labels[j]; // Individual Relic Item Names
        currentItemID = relic_IDs[j];
        break;
      case 4:
        itemLabel.innerHTML = legendary_labels[j]; // Individual Legendary Item Names
        currentItemID = legendary_IDs[j];
        break;
      case 5:
        itemLabel.innerHTML = epic_labels[j]; // Individual Epic Item Names
        currentItemID = epic_IDs[j];
        break;
      case 6:
        itemLabel.innerHTML = rare_labels[j]; // Individual Rare Item Names
        currentItemID = rare_IDs[j];
        break;
      case 7:
        itemLabel.innerHTML = uncommon_labels[j]; // Individual Uncommon Item Names
        currentItemID = uncommon_IDs[j];
        break;
      default:
        itemLabel.innerHTML = "Default";
    }

    // Create a button container to hold all of an item's buttons
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
        "https://krunker.io/social.html?p=itemsales&i=" + this.dataset.item_id, // Create an undefined URL button click listener
        "_blank"
      );
    });

    buttonContainer.appendChild(button1); // Add the Info button to the current buttonContainer
    button1.dataset.item_id = currentItemID; // Complete the URL by filling in the ItemID

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

    buttonContainer.appendChild(button2); // Add the Listings button to the current buttonContainer
    button2.dataset.item_id = currentItemID; // Complete the URL by filling in the ItemID

    // Create Add to Wishlist button
    var button3 = document.createElement("button");
    if (myWishlist.includes(currentItemID)) {
      // If the item is already in wishlist, use "inWishlistButton" (disabled, green, non-expanding)
      button3.innerHTML = "In Wishlist";
      button3.disabled = true;
      button3.className = "inWishlistButton";
    } else {
      // If the item is not in the wishlist, use "addToWishlistButton" (enabled, grey, expanding, 75% size text)
      button3.innerHTML = "Add to Wishlist";
      button3.disabled = false;
      button3.className = "addToWishlistButton";
    }
    button3.id = "button3";

    // Create an undefined listener for when Add to Wishlist button is clicked
    button3.addEventListener("click", function () {
      if (!myWishlist.includes(button_id)) {
        console.log("Item " + button_id + " has been added to your wishlist."); // Add Item to Wishlist
        myWishlist.push(button_id); // Add the item
        localStorage.setItem("wishlist", JSON.stringify(myWishlist)); // Update localStorage
      } else {
        console.log("Item " + button_id + " already exists in your wishlist!");
      }
    });

    buttonContainer.appendChild(button3); // Add the Add to Wishlist button to the current buttonContainer
    button3.dataset.item_id = currentItemID; // Complete the URL by filling in the ItemID

    // Assign all elements created for one Item Div in a Hierarchy:
    imageDiv.appendChild(image); // Place item image inside of the div
    imageDiv.appendChild(itemLabel); // Place item label inside of the div
    imageDiv.appendChild(buttonContainer); // Place buttonContainer inside of the div
    document.getElementById("gallery").appendChild(imageDiv); // Place the whole item div inside of the total gallery
  }
} // End of Driver Code

/*
 *  Miscellaneous JavaScript Functions
 */

let addToWishlistButtons = document.querySelectorAll(".addToWishlistButton"); // Identify all addToWishlistButtons

// When mouse hovers over an AddToWishlistButton, update the button_id for Button3 Click Listener
addToWishlistButtons.forEach((button) => {
  button.addEventListener("mouseover", (event) => {
    button_id = event.currentTarget.dataset.item_id; // Store value of item being hovered to update button3 Click Listener
    console.log("Currently hovering over item: " + button_id);
  });

  // WHen mouse clicks an AddToWishlistButton...
  button.addEventListener("click", function () {
    button.textContent = "Added!"; // Change button text content briefly
    setTimeout(() => {
      button.disabled = true;
      button.className = "inWishlistButton"; // Switch class so button remains green and unclickable
      button.textContent = "In Wishlist"; // Change button text content
    }, 1000);
  });
});

document.getElementById("mySearchBar").addEventListener("input", function () {
  searchItems(); // Run searchItems function on any text entered into mySearchBar
  resetAnimations(); // Reset animations anytime the search bar input changes
});

const sound = new Audio("sounds/tick.mp3"); // Declare sound
const audibleButtons = document.querySelectorAll("button"); // Find all button elements

audibleButtons.forEach((audibleButton) => {
  if (!audibleButton.classList.contains("inWishlistButton")) {
    // Exclude buttons with .inWishlistButton class
    audibleButton.addEventListener("mouseover", () => {
      sound.play(); // Play sound when mouse hovers over the button
    });
  }
});

// Smooth Loading Divs
