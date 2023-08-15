import * as model from './model.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2 <- This is an api created by Jonas himself

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);
    
    if (!id) return;
    recipeView.renderSpinner();

    // 0} Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    
    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    
    // 2) Loading recipe
    /* 
    Note that loadRecipe fn is async thus it returns a promise. We have to 'await' this 
    promise to move on to the next step here in the execution of this async fn. Btw, this 
    is a situation of one async fn calling another async fn. And rmb, this loadRecipe does 
    not return anything so we don't need to store it in another variable. Instead, here we
    will get access to state.recipe.
    */
    await model.loadRecipe(id);
    
    // 3) Rendering the recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.renderError();
  }
};


const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};


const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
}


const controlServings = function(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
}


const controlAddBookmark = function() {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) 
    model.addBookmark(model.state.recipe);
  else 
    model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}


const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}


const controlAddRecipe = async function(newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage(); //just a recap: this renderMessage() originates from View.js

    // Render bookmark view (not using update here as we want to insert a new element)
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL using this history API, another web API
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function() {
      addRecipeView.toggleWindow()
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();