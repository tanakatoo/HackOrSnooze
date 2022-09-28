"use strict";
// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $submitForm = $("#newStory");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $submitForm,
    $allStoriesList,
    $loginForm,
    $signupForm,
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  //put click event on the stories to see if a favorite has been clicked
  $allStoriesList.on("click", ".star", clickStar)

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

//if a star has been clicked, add it to favorite if it was an empty star
//and fill the star
//delete it from favorite if a filled star was clicked
async function clickStar(evt) {
  const storyId = $(this).parent().attr('id')

  if ($(this).children('i').hasClass('fas')) {
    //if star is filled
    console.log('filled star')
    try {
      await User.deleteFavourite(currentUser.loginToken, currentUser.username, storyId)
      //empty star
      $(this).children('i').removeClass('fas')
      $(this).children('i').addClass('far')
    } catch (err) {
      console.log('unfavoriting failed')
      console.log(err)
    }
  } else if ($(this).children('i').hasClass('far')) {
    //if star is empty
    console.log('empty star')
    try {
      await User.addFavourite(currentUser.loginToken, currentUser.username, storyId)
      //fill star
      $(this).children('i').removeClass('far')
      $(this).children('i').addClass('fas')
    } catch (err) {
      console.log('favoriting failed')
      console.log(err)
    }
  }
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);
