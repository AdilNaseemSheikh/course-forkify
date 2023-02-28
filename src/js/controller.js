// for polifilling everything else
import "core-js";
// for polyfilling the async await
import "regenerator-runtime";
import * as model from "./model.js";

import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarkView from "./views/bookmarkView.js";
// to run our code, we have to import it no matter if we use it or not
import addRecipeView from "./views/addRecipeView.js";
import { async } from "regenerator-runtime";
import { MODEL_CLOSE_SEC } from "./config.js";

const recipeContainer = document.querySelector(".recipe");

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // 0) update resultsView to mark recipe as selected
    resultsView.update(model.getSearchResultsPage());

    // 1-Loading Recipe
    // It does not return anything. It just manipulate the state
    await model.loadRecipe(id);

    recipeView.renderSpinner();

    // 2-Render Recipe
    recipeView.render(model.state.recipe);

    bookmarkView.update(model.state.bookmarks);
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) load search results
    // It does not return anything. It just manipulate the state
    await model.loadSearchResults(query);
    // 3) render results
    console.log(model.state.search);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));
    // 4) render initial pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  // 1) render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) render NEW initial pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) add/remove bookmarks
  if (model.state.recipe.bookmarked) {
    model.removeBookmark(model.state.recipe.id);
  } else {
    model.addBookmark(model.state.recipe);
  }
  // 2) render recipe as bookmarked
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const constrolAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmarkview
    // if we are adding new items, then update will not work
    bookmarkView.render(model.state.bookmarks);
    // changing the url
    window.history.pushState(null,'',`#${model.state.recipe.id}`)

    // close model
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log(error, "🔮");
    addRecipeView.renderError(error.message);
  }
};

controlRecipe();
const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  bookmarkView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(constrolAddRecipe);
  // controlServings();
};

init();

// lec 25 done
