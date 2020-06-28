import { elements } from "./base";
export const getInput = () => elements.searchInput.value;

export const highlightSelected = (id) => {
    const resultsArr = Array.from(document.querySelectorAll(".results__link"));
    resultsArr.forEach((el) => {
        el.classList.remove("results__link--active");
    });
    document
        .querySelector(`.results__link[href*="${id}"]`)
        .classList.add("results__link--active");
};

const renderRecipe = (recipe) => {
    const markUp = `
    <li>
        <a class="results__link results__link--active" href="#${
          recipe.recipe_id
        }">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${limitTitle(
    recipe.title
  )}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML("beforeend", markUp);
};

const limitTitle = (title, limit = 17) => {
    if (title.length > limit) {
        const newTitle = [];
        title.split(" ").reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(" ")} ...`;
    }
    return title;
};

export const clearSearch = () => {
    elements.searchInput.value = "";
};
export const clearResultList = () => {
    elements.searchResList.innerHTML = "";
    elements.searchResPages.innerHTML = "";
};

const createButtons = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
                    <span>Page ${
                      type === "prev" ? page - 1 : page + 1
                    }</span>    
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${
                          type === "prev" ? "left" : "right"
                        }"></use>
                    </svg>
                </button>
                `;

const renderButtons = (page, numOfRecipes, resultsPerPage) => {
    const pages = Math.ceil(numOfRecipes / resultsPerPage);
    let butHtml;
    if (page === 1 && pages > 1) {
        // Only next button
        butHtml = createButtons(page, "next");
    } else if (page === pages && pages > 1) {
        // Only prev button
        butHtml = createButtons(page, "prev");
    } else {
        // Create both next and prev button
        butHtml = `${createButtons(page, "prev")}
        ${createButtons(page, "next")}`;
    }
    elements.searchResPages.insertAdjacentHTML("afterbegin", butHtml);
};

export const renderResult = (recipes, page = 1, resultsPerPage = 10) => {
    // Rendering results page.
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    // Rendering next and prev buttons.

    renderButtons(page, recipes.length, resultsPerPage);
};