const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const errorMessage = document.getElementById("error-message");
const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const SEARCH_URL = `${BASE_URL}search.php?s=`;
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;

// 事件监听器
searchBtn.addEventListener("click", searchMeals);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchMeals();
});
mealsContainer.addEventListener("click", handleMealClick);
backBtn.addEventListener("click", () => {
  mealDetails.classList.add("hidden");
  mealsContainer.classList.remove("hidden");
  resultHeading.classList.remove("hidden");
});

async function searchMeals() {
  const searchTerm = searchInput.value.trim();

  // 处理边界情况
  if (!searchTerm) {
    errorMessage.textContent = "Please enter a search term";
    errorContainer.classList.remove("hidden");
    return;
  }

  try {
    // 显示加载状态
    resultHeading.textContent = `Searching for "${searchTerm}"...`;
    resultHeading.classList.remove("hidden");
    mealsContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
    errorContainer.classList.add("hidden");
    mealDetails.classList.add("hidden");

    // 从API获取餐点数据
    const response = await fetch(`${SEARCH_URL}${searchTerm}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.meals === null) {
      // 未找到餐点
      resultHeading.classList.add("hidden");
      mealsContainer.innerHTML = "";
      errorMessage.textContent = `No recipes found for "${searchTerm}". Try another search term!`;
      errorContainer.classList.remove("hidden");
    } else {
      resultHeading.textContent = `Search results for "${searchTerm}":`;
      displayMeals(data.meals);
      searchInput.value = "";
    }
  } catch (error) {
    console.error("Error fetching meals:", error);
    resultHeading.classList.add("hidden");
    mealsContainer.innerHTML = "";
    errorMessage.textContent = "Something went wrong. Please try again later.";
    errorContainer.classList.remove("hidden");
  }
}

function displayMeals(meals) {
  mealsContainer.innerHTML = "";

  // 遍历餐点并为每个餐点创建卡片
  meals.forEach((meal) => {
    const mealEl = document.createElement("div");
    mealEl.className = "meal";
    mealEl.setAttribute("data-meal-id", meal.idMeal);
    mealEl.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="meal-info">
        <h3 class="meal-title">${meal.strMeal}</h3>
        ${meal.strCategory ? `<div class="meal-category">${meal.strCategory}</div>` : ""}
      </div>
    `;
    mealsContainer.appendChild(mealEl);
  });
}

async function handleMealClick(e) {
  const mealEl = e.target.closest(".meal");
  if (!mealEl) return;

  const mealId = mealEl.getAttribute("data-meal-id");

  try {
    // 显示加载状态
    mealDetailsContent.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading recipe details...</div>';
    mealDetails.classList.remove("hidden");
    mealsContainer.classList.add("hidden");
    resultHeading.classList.add("hidden");
    errorContainer.classList.add("hidden");

    const response = await fetch(`${LOOKUP_URL}${mealId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.meals && data.meals[0]) {
      const meal = data.meals[0];
      const ingredients = [];

      // 收集配料
      for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
          ingredients.push({
            ingredient: meal[`strIngredient${i}`],
            measure: meal[`strMeasure${i}`] || "",
          });
        }
      }

      // 显示餐点详情
      mealDetailsContent.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-details-img">
        <h2 class="meal-details-title">${meal.strMeal}</h2>
        <div class="meal-details-category">
          <span>${meal.strCategory || "Uncategorized"}</span>
        </div>
        <div class="meal-details-instructions">
          <h3>Instructions</h3>
          <p>${meal.strInstructions || "No instructions available."}</p>
        </div>
        <div class="meal-details-ingredients">
          <h3>Ingredients</h3>
          <ul class="ingredients-list">
            ${ingredients
          .map(
            (item) => `
              <li><i class="fas fa-check-circle"></i> ${item.measure} ${item.ingredient}</li>
            `
          )
          .join("")}
          </ul>
        </div>
        ${meal.strYoutube
          ? `
          <a href="${meal.strYoutube}" target="_blank" class="youtube-link">
            <i class="fab fa-youtube"></i> Watch Video
          </a>
        `
          : ""
        }
      `;

      // 滚动到详情页面
      mealDetails.scrollIntoView({ behavior: "smooth" });
    } else {
      throw new Error("No meal details found");
    }
  } catch (error) {
    console.error("Error fetching meal details:", error);
    mealDetailsContent.innerHTML = "";
    errorMessage.textContent = "Could not load recipe details. Please try again later.";
    errorContainer.classList.remove("hidden");
    mealDetails.classList.add("hidden");
    mealsContainer.classList.remove("hidden");
    resultHeading.classList.remove("hidden");
  }
}

// 初始化：显示一些随机餐点
window.addEventListener('DOMContentLoaded', () => {
  searchInput.value = "chicken";
  searchMeals();
});