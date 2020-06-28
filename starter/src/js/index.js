import { elements, renderLoader, clearLoader } from "./views/base";
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";

const state = {};

/**
 * Search Controller
 */

const controlSearch = async() => {
    // 1. Get query from the view.
    const query = searchView.getInput();
    // console.log(query);

    // 2. create new search and add to state.
    state.search = new Search(query);

    // 3. prepare UI for rendering and loading symbol.
    searchView.clearSearch();
    searchView.clearResultList();
    renderLoader(elements.searchRes);
    try {
        // 4. get recipe from api.
        await state.search.getResults();

        // 5. render the ui.
        clearLoader();
        searchView.renderResult(state.search.result);
    } catch (error) {
        alert("Something wrong with the search...");
        clearLoader();
    }
};

elements.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener("click", (e) => {
    const target = e.target.closest(".btn-inline");
    searchView.clearResultList();
    const page = parseInt(target.dataset.goto, 10);
    searchView.renderResult(state.search.result, page);
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async() => {
    // Get ID from url
    const id = window.location.hash.replace("#", "");

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (err) {
            console.log(err);
            alert("Error processing recipe!");
        }
    }
};

["hashchange", "load"].forEach((event) =>
    window.addEventListener(event, controlRecipe)
);

// Handling recipe button clicks
elements.recipe.addEventListener("click", (e) => {
    if (e.target.matches(".btn-decrease, .btn-decrease *")) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings("dec");
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches(".btn-increase, .btn-increase *")) {
        // Increase button is clicked
        state.recipe.updateServings("inc");
        recipeView.updateServingsIngredients(state.recipe);
    }
});