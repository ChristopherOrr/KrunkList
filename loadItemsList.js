/* loadItemsList.js
 *
 * Populates the image gallery by creating Items (Image + Label)
 * @params: None
 * @returns: None
 */

import { getItemData, isExcludedLabel } from "./utils.js";

let itemData;

(async function initializeGallery() {
  itemData = await getItemData();
  renderItems();
})();

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

// Driver Code

function renderItems() {
  for (const [rarity, items] of Object.entries(itemData)) {
    items.forEach((item) => {
      const { id, label, url } = item;

      const itemCard = document.createElement("div");
      itemCard.className = `item ${rarity}`;

      const image = document.createElement("img");
      image.loading = "lazy";
      image.src = url; // Add item's image with url

      const itemLabel = document.createElement("h1");
      itemLabel.textContent = label; // Add item's label

      const buttonContainer = document.createElement("div");

      if (isExcludedLabel(label, rarity)) {
        buttonContainer.className = "excluded-button-container";
      } else {
        buttonContainer.className = "default-button-container";
      }

      // Info button
      const button1 = document.createElement("button");
      button1.textContent = "Info";
      button1.className = "button";
      button1.dataset.item_id = id; // Add item's ID to Info Button
      button1.addEventListener("click", function () {
        window.open(
          "https://krunker.io/social.html?p=itemsales&i=" +
            this.dataset.item_id,
          "_blank"
        );
      });

      buttonContainer.appendChild(button1);

      // Listings or Lock button
      const button2 = document.createElement("button");
      if (buttonContainer.classList.contains("excluded-button-container")) {
        button2.textContent = "🔒";
        button2.title = "Cannot Be Listed";
        button2.disabled = true;
        button2.className = "cannotBeSold";
      } else {
        button2.textContent = "Listings";
        button2.className = "button";
        button2.dataset.item_id = id; // Add item's ID to Listings Button
        button2.addEventListener("click", function () {
          window.open(
            "https://krunker.io/social.html?p=market&i=" + this.dataset.item_id,
            "_blank"
          );
        });
      }

      buttonContainer.appendChild(button2);

      // Wishlist button
      const button3 = document.createElement("button");
      if (myWishlist.includes(id)) {
        button3.textContent = "In Wishlist";
        button3.disabled = true;
        button3.className = "inWishlistButton";
      } else {
        button3.textContent = "Add to Wishlist";
        button3.className = "addToWishlistButton";
        button3.dataset.item_id = id; // Store item's ID in Wishlist Button data attribute

        // When Add to Wishlist button is clicked:
        button3.addEventListener("click", function () {
          myWishlist.push(id);
          localStorage.setItem("wishlist", JSON.stringify(myWishlist));
          console.log(`Item ${id} added to wishlist`);

          this.disabled = true;
          this.className = "inWishlistButton"; // Switch class so button remains green
          this.textContent = "Added!"; // Change button text content briefly

          setTimeout(() => {
            this.textContent = "In Wishlist"; // Change button text content
          }, 1000);
        });

        button3.addEventListener("mouseover", function () {
          console.log("Currently hovering over item: " + this.dataset.item_id);
        });
      }

      buttonContainer.appendChild(button3);

      itemCard.appendChild(image); // Place img inside of the div
      itemCard.appendChild(itemLabel); // Place label inside of the div
      itemCard.appendChild(buttonContainer); // place buttonContainer inside of the div
      document.getElementById("gallery").appendChild(itemCard); // Place the div inside of the gallery

      // Add observer to each itemCard
      observer.observe(itemCard);
    });
  }
}

/*
 *  Miscellaneous JavaScript Functions
 */

document.getElementById("mySearchBar").addEventListener("input", function () {
  searchItems(); // Run searchItems function on any text entered into mySearchBar
  resetAnimations(); // Reset animations anytime the search bar input changes
});

const sound = new Audio("sounds/tick.mp3"); // Declare sound

// Play Sound when Button is hovered
document.addEventListener("mouseover", function (event) {
  const button = event.target.closest("button");
  if (button && !button.classList.contains("cannotBeSold")) {
    sound.currentTime = 0; // rewind to start so it plays on every hover
    sound.play();
  }
});

const navbarHeight = document.querySelector(".navbar").offsetHeight || 62;

// Intersection Observer for Item Fade in on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Item is visible: add fade-in class
        entry.target.classList.add("fade-in");
      } else {
        // Item is not visible: remove fade-in class to fade out
        entry.target.classList.remove("fade-in");
      }
    });
  },
  {
    rootMargin: `-${navbarHeight + 20}px 0px -${navbarHeight}px 0px`, // top margin shifted up by navbarHeight
    threshold: 0.1,
  }
);
