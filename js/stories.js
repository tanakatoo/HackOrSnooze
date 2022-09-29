"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 * - filledStar: boolean for whether to display empty star or filled star
 * - ownStory: boolean for whether the user clicked on 'my stories' in the nav, if so then show garbage bin
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, filledStar, ownStory = false) {

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${ownStory ? '<span class="delete"><i class="fas fa-trash-alt"></i></span>' : ''}
        ${currentUser ? `<span class="star"><i class="${filledStar ? 'fa-star fas' : 'far fa-star'}"></i></span>` : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories and most current user from server, generates their HTML, and puts on page. */

async function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  //get updated stories list in case the user deleted or added something
  storyList = await StoryList.getStories();

  //??????????????????
  //check the user first and repeat for loop or
  //check for the user each time in the for loop
  //????????????????????

  //if current user is logged in then check to see if story is favorited
  if (currentUser) {
    for (let story of storyList.stories) {
      //loop through to see if the user has this story favorited
      let filledStar = isItFavorited(story)
      const $story = generateStoryMarkup(story, filledStar);
      $allStoriesList.append($story);
    }
  } else {
    for (let story of storyList.stories) {
      //loop through to see if the user has this story favorited
      const $story = generateStoryMarkup(story, false);
      $allStoriesList.append($story);
    }
  }
  $allStoriesList.show();
}


$submitForm.on("submit", addStory);

// Gets new story and adds the new story on the page
async function addStory(evt) {
  evt.preventDefault();
  console.debug("addStory");
  const newStory = {
    author: $("#submit-author").val(),
    title: $("#submit-title").val(),
    url: $("#submit-url").val()
  }
  const res = await StoryList.addStory(currentUser, newStory)
  if (res.status == 201) {
    $("#submit-author").val("")
    $("#submit-title").val("")
    $("#submit-url").val("")
    getAndShowStoriesOnStart()
  }
}

//display the user favorited stories only
async function displayFavorites() {
  console.debug("displayFavorites");

  $allStoriesList.empty();

  let favorites = currentUser.favorites
  // loop through all of our stories and generate HTML for them
  if (favorites.length) {

    for (let story of favorites) {
      const $story = generateStoryMarkup(story, true);
      $allStoriesList.append($story);

    }

  } else {
    $allStoriesList.append("<li style='list-style: none'>No favorites yet!</li>");
  }
  $allStoriesList.show();

}

//if the my stories in the nav was clicked, then display only the user generated stories
async function displayMyStories() {
  console.debug("displayMyStories");

  let ownStories = currentUser.ownStories

  $allStoriesList.empty();
  // loop through all user stories and generate HTML for them
  if (ownStories.length) {

    for (let story of ownStories) {
      const filledStar = isItFavorited(story)
      const $story = generateStoryMarkup(story, filledStar, true);
      $allStoriesList.append($story);

    }
  } else {
    $allStoriesList.append("<li style='list-style: none'>No stories created yet!</li>");
  }
  $allStoriesList.show();
}

//gets favorites from user object and loops through it to see if 
//story is on the list. If it is then return true otherwise return false
function isItFavorited(story) {
  let favorites = currentUser.favorites
  for (let favorite of favorites) {
    if (story.storyId == favorite.storyId) {
      return true
    }
  }
  return false
}

