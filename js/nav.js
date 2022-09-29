"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

async function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  if (currentUser) {
    //make sure the user object is the most updated
    //so that favorited is displayed properly
    await updateCurrentUser();
  }
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Show new story when click on submit
// Only show if user is logged in, otherwise, show user login form

function updateNavOnSubmit() {
  console.debug("updateNavOnSubmit");
  hidePageComponents();
  if (currentUser) {
    $submitForm.show();
    putStoriesOnPage();
    //$allStoriesList.show();
  } else {
    $loginForm.show();
    $signupForm.show();
  }
}

$body.on("click", "#nav-submit", updateNavOnSubmit)

// Show user favorited stories
// Only show if user is logged in, otherwise, show user login form

async function displayUserFavorites() {
  console.debug("displayUserFavorites");
  hidePageComponents();
  if (currentUser) {
    //update the user to get most recent data
    await updateCurrentUser();
    displayFavorites();
  } else {
    $loginForm.show();
    $signupForm.show();
  }
  //find only user favorites and then 

}

$body.on("click", "#nav-favorites", displayUserFavorites)

// Show user generated stories
// Only show if user is logged in, otherwise, show user login form

async function displayOwnStories() {
  console.debug("displayOwnStories");
  hidePageComponents();
  if (currentUser) {
    //update the user to get most recent data
    await updateCurrentUser();
    displayMyStories();
  } else {
    $loginForm.show();
    $signupForm.show();
  }
}

$body.on("click", "#nav-my-stories", displayOwnStories)