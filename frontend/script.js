const API_URL = "http://localhost:4000/api/products";

async function fetchProducts(url = API_URL) {
    try {
        const response = await fetch(url);
        const products = await response.json();
        renderProducts(products)
    } catch (error) {
        console.error("Error fetching products: ", error);
    }
}

function renderProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    products.forEach(product => {
        const popularityOutOf5 = (product.popularityScore * 5).toFixed(1);

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
        <img src="${product.images.yellow}" alt="${product.name}" class="product-image"/>
      <h3>${product.name}</h3>
      <p class="price">$${product.price}</p>

      <div class="color-picker">
        <button class="yellow" data-color="yellow"></button>
        <button class="white" data-color="white"></button>
        <button class="rose" data-color="rose"></button>
      </div>
      <div class="color-label">Yellow Gold</div>

      <div class="popularity">
        <span class="stars">${"★".repeat(Math.floor(popularityOutOf5))}${"☆".repeat(5 - Math.floor(popularityOutOf5))}</span>
        <span>${popularityOutOf5}/5</span>
      </div>
        `;

        const img = card.querySelector(".product-image");
        const label = card.querySelector(".color-label");
        const buttons = card.querySelectorAll(".color-picker button");

        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                img.src = product.images[btn.dataset.color];
                label.textContent =
                btn.dataset.color === "yellow" ? "Yellow Gold" :
                btn.dataset.color === "white" ? "White Gold" :
                "Rose Gold";
            });
        });

        container.appendChild(card);
    });

    initCarousel();
}

function initCarousel() {
  const carousel = document.querySelector(".carousel");
  const leftBtn = document.querySelector(".left-btn");
  const rightBtn = document.querySelector(".right-btn");

  leftBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: -300, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: 300, behavior: "smooth" });
  });
}

document.getElementById("applyFilters").addEventListener("click", () => {
  const minPrice = document.getElementById("minPrice").value;
  const maxPrice = document.getElementById("maxPrice").value;
  const minPopularity = document.getElementById("minPopularity").value;
  const maxPopularity = document.getElementById("maxPopularity").value;

  let url = API_URL + "?";
  if (minPrice) url += `minPrice=${minPrice}&`;
  if (maxPrice) url += `maxPrice=${maxPrice}&`;
  if (minPopularity) url += `minPopularity=${minPopularity}&`;
  if (maxPopularity) url += `maxPopularity=${maxPopularity}&`;

  fetchProducts(url);
});

fetchProducts();