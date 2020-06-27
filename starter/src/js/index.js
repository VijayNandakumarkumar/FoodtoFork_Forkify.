import { elements } from "./views/base";
import Search from "./models/Search";
import * as searchView from "./views/searchView";

const state = {};

/**
 * Search Controller
 */

const controlSearch = async() => {
    // 1. Get query from the view.
    const query = searchView.getInput();
    console.log(query);

    // 2. create new search and add to state.
    state.search = new Search(query);

    // 3. prepare UI for rendering and loading symbol.
    searchView.clearSearch();
    searchView.clearResultList();
    // renderLoader(elements.searchRes);
    // 4. get recipe from api.
    await state.search.getResults();

    // 5. render the ui.
    // clearLoader();
    searchView.renderResult(state.search.result);
};

elements.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    controlSearch();
});