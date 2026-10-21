
/* =========================================
   THE DREAMER'S GARDEN
   Between Dreams & Lines
   ========================================= */

// Your original poetry collection
const poems = [
  {
    id: 1,
    title: "I Let My Hair Back",
    category: "self",
    categoryName: "Finding Myself",
    flower: "✿",
    excerpt:
      "I hold my breath as I always do, and count to ten so I breathe much loose...",
    content: `there's a corner of my room,
untouched ,
still and the wind dare not caress it's head,
my curiosity gravitates me ,
like the aroma of my beloved does.

I hold my breath as i always do,
and count to ten so i breathe much loose,
my greatest phobia was to dare,
and regret shall not repair like a broken glass.

one step closer,I gently put my feet ,
and let my fear fly away, like an uncaged bird.

sitting there in silence,
is a dusted brown box ,old enough to have wrinkles on it's face ,
but,fear is bad and it shall fade,
I lean a bit forward and sway it open straight .

How had i not done this before,
it holds not just a potrait ,
but a version of me i would die to grow,
the hair shaped in curves like waves of the sea,
i thought this is the confidence i would need.

I am older and wiser as I should be,
but sometimes you should hear yourself,
as no voice is deeper than your soul,
not even the cuckoo's dawnlight song to sleep.
on this note , i let my hair back.`
  },
  {
    id: 2,
    title: "The Dreams of Icarus",
    category: "myth",
    categoryName: "Myth & Magic",
    flower: "☼",
    excerpt:
      "A pale light unfurled around her, gentler than the cuckoo's dawnlight...",
    content: `She raised her voice just once,
so softly the sky mistook it for a prayer
Yet Zeus must have heard her trembling cry.
A pale light unfurled around her,
gentler than the cuckoo's dawnlight,
and Apollo then spread his warm golden wings,
and drew her close enough to shield her.

For the first time,safety wrapped itself around her ribs,
A heart once hammered into iron,
began to glow like softened gold.
She dreamed of walking beside Jason,
To claim,this time, a platinum fleece.

But how greed has pulled millions down,
and dreams that shine might cut too deep,
Like once Icarus fell from the sky.

In her own rising fire,she burned her-self,
And the dreams enclosed in her ashes,
whispered Daedalus behind her back.
She did pause and then gathered the pieces from the fire.`
  },
  {
    id: 3,
    title: "Will I Find My Way?",
    category: "growth",
    categoryName: "Growing Up",
    flower: "❀",
    excerpt:
      "Like the ocean's waves, I strive and bend, to conquer every situation...",
    content: `As time passes by,
The days flow like a river stream,
The transition from childhood to adult,
Feels nothing short of an unattainable dream.

I promise myself to give my best,
But my brain says a thing-
Which my heart does not believe
Is my brain right or my pouncing heart,
Maybe its my faith or the question of time?

Like the oceans waves,I strive and bend,
to conquer every situation to the best I can,
I try to summon all the strength each day,
But still,will I fail or find my way?`
  }
];

// A few lines for the inspiration section
const quotes = [
  "Somewhere between who you were and who you will be, there is you.",
  "You are allowed to grow at your own pace.",
  "Even the quietest flowers find their way to bloom.",
  "There is courage in beginning again.",
  "Some feelings find their home in words.",
  "You don't have to have it all figured out today.",
  "Become someone your younger self would feel safe with."
];

const grid = document.getElementById("poem-grid");
const filters = document.getElementById("filters");
const dialog = document.getElementById("poem-dialog");

let activeFilter = "all";
let currentPoemId = null;

// Read saved favourites safely
let favorites = [];

try {
  favorites = JSON.parse(
    localStorage.getItem("dreamers-garden-favorites") || "[]"
  );

  if (!Array.isArray(favorites)) {
    favorites = [];
  }
} catch {
  favorites = [];
}

// Create the poetry cards
function renderPoems() {
  const visiblePoems = poems.filter((poem) => {
    if (activeFilter === "all") return true;

    if (activeFilter === "favorites") {
      return favorites.includes(poem.id);
    }

    return poem.category === activeFilter;
  });

  if (visiblePoems.length === 0) {
    grid.innerHTML = `
      <p class="empty-state">
        No saved poems here yet. Find a poem you love and tap ♡
      </p>
    `;
    return;
  }

  grid.innerHTML = visiblePoems
    .map(
      (poem) => `
        <article class="poem-card">
          <span class="card-flower" aria-hidden="true">${poem.flower}</span>
          <p class="card-category">${poem.categoryName}</p>
          <h3>${poem.title}</h3>
          <p class="card-excerpt">${poem.excerpt}</p>

          <div class="card-bottom">
            <button class="read-button" data-read="${poem.id}">
              Read the poem ↗
            </button>

            <button
              class="save-button ${favorites.includes(poem.id) ? "saved" : ""}"
              data-save="${poem.id}"
              aria-label="${favorites.includes(poem.id) ? "Remove from" : "Add to"} favorites"
              aria-pressed="${favorites.includes(poem.id)}"
              title="Save to favorites"
            >${favorites.includes(poem.id) ? "♥" : "♡"}</button>
          </div>
        </article>
      `
    )
    .join("");
}

// Save favourites to this browser
function saveFavorites() {
  try {
    localStorage.setItem(
      "dreamers-garden-favorites",
      JSON.stringify(favorites)
    );
  } catch {
    // The website remains usable if browser storage is unavailable.
  }
}

// Open a poem in the reading window
function openPoem(id) {
  const poem = poems.find((item) => item.id === Number(id));

  if (!poem) return;

  currentPoemId = poem.id;

  document.getElementById("dialog-category").textContent =
    poem.categoryName;

  document.getElementById("dialog-title").textContent = poem.title;

  document.getElementById("dialog-poem").textContent = poem.content;

  updateFavoriteButton();

  dialog.showModal();
}

// Update the favourite button inside the reading window
function updateFavoriteButton() {
  const button = document.getElementById("favorite-button");
  const isSaved = favorites.includes(currentPoemId);

  button.textContent = isSaved
    ? "♥ Saved to favorites"
    : "♡ Save to favorites";
}

// Toggle a poem's favourite status
function toggleFavorite(id) {
  const poemId = Number(id);

  if (favorites.includes(poemId)) {
    favorites = favorites.filter((item) => item !== poemId);
  } else {
    favorites.push(poemId);
  }

  saveFavorites();
  renderPoems();
  updateFavoriteButton();
}

// Handle clicks on poem cards
grid.addEventListener("click", (event) => {
  const readButton = event.target.closest("[data-read]");
  const saveButton = event.target.closest("[data-save]");

  if (readButton) {
    openPoem(readButton.dataset.read);
  }

  if (saveButton) {
    toggleFavorite(saveButton.dataset.save);
  }
});

// Filter the collection
filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");

  if (!button) return;

  activeFilter = button.dataset.filter;

  filters.querySelectorAll(".filter").forEach((filterButton) => {
    filterButton.classList.toggle(
      "active",
      filterButton === button
    );
  });

  renderPoems();
});

// Close the reading window
document.getElementById("close-dialog").addEventListener("click", () => {
  dialog.close();
});

// Close the window when clicking outside it
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

// Save a favourite from inside the reading window
document
  .getElementById("favorite-button")
  .addEventListener("click", () => {
    if (currentPoemId !== null) {
      toggleFavorite(currentPoemId);
    }
  });

// Random inspiration button
document.getElementById("quote-button").addEventListener("click", () => {
  const quoteElement = document.getElementById("daily-quote");
  const currentQuote = quoteElement.textContent;

  let nextQuote = currentQuote;

  while (quotes.length > 1 && nextQuote === currentQuote) {
    nextQuote = quotes[Math.floor(Math.random() * quotes.length)];
  }

  quoteElement.textContent = nextQuote;
});

// Light and dark themes
const themeButton = document.getElementById("theme-toggle");

function updateThemeButton() {
  themeButton.textContent = document.body.classList.contains("dark")
    ? "☀"
    : "☾";
}

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  try {
    localStorage.setItem(
      "dreamers-garden-theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  } catch {
    // Theme switching still works without browser storage.
  }

  updateThemeButton();
});

// Restore the saved theme
try {
  if (localStorage.getItem("dreamers-garden-theme") === "dark") {
    document.body.classList.add("dark");
  }
} catch {
  // Use the default light theme.
}

updateThemeButton();

// Add a favourites filter without changing the HTML file
const favoriteFilter = document.createElement("button");

favoriteFilter.className = "filter";
favoriteFilter.dataset.filter = "favorites";
favoriteFilter.textContent = "♡ Favorites";

filters.appendChild(favoriteFilter);

// Show all poems when the page first opens
renderPoems();
