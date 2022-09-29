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
  $allStoriesList.on('click', '.delete', removeStory)

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

//if user clicks the garbage bin, then it should remove the story from the db
async function removeStory() {
  const storyId = $(this).parent().attr('id')
  const response = await Story.deleteStory(currentUser.loginToken, storyId)
  if (response.status == 200) {
    await updateCurrentUser();
    await displayMyStories()
  }

}

//if empty star was clicked then fill the star and call api to add it to the db
//delete it from favorite if a filled star was clicked and call api to remove it from the db
//update the dom only if the api call was successful
async function clickStar(evt) {
  const storyId = $(this).parent().attr('id')

  if ($(this).children('i').hasClass('fas')) {
    //if star is filled
    try {
      const res = await User.deleteFavourite(currentUser.loginToken, currentUser.username, storyId)

      if (res.status == 200) {
        //empty star
        $(this).children('i').removeClass('fas')
        $(this).children('i').addClass('far')
      }
    } catch (err) {
      console.log('unfavoriting failed')
      console.log(err)
    }
  } else if ($(this).children('i').hasClass('far')) {
    //if star is empty
    try {
      const res = await User.addFavourite(currentUser.loginToken, currentUser.username, storyId)
      if (res.status == 200) {
        //fill star
        $(this).children('i').removeClass('far')
        $(this).children('i').addClass('fas')
      }
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
