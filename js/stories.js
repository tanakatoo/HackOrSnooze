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
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, filledStar) {

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="star">  
          <i class="${filledStar ? 'fa-star fas' : 'far fa-star'}"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  let filledStar = false
  for (let story of storyList.stories) {
    //if user is logged in then display favorited
    if (currentUser) {

      //loop through to see if the user has this story favorited
      for (let favorited of currentUser.favorites) {
        if (story.storyId == favorited.storyId) {
          filledStar = true
        }
      }
    }
    const $story = generateStoryMarkup(story, filledStar);
    $allStoriesList.append($story);
    filledStar = false
  }

  $allStoriesList.show();
}

//
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
  await StoryList.addStory(currentUser, newStory)
  getAndShowStoriesOnStart()
}

//display the user favorited stories only
function displayFavorites() {
  console.debug("displayFavorites");
  let favorites = currentUser.favorites
  $allStoriesList.empty();
  // loop through all of our stories and generate HTML for them
  if (favorites.length) {
    for (let story of favorites) {
      const $story = generateStoryMarkup(new Story(story), true);
      $allStoriesList.append($story);
    }
  } else {
    $allStoriesList.append("<li style='list-style: none'>No favorites yet!</li>");
  }
  $allStoriesList.show();

}

function displayOwnStories() {
  console.debug("displayOwnStories");
  let ownStories = currentUser.ownStories
  $allStoriesList.empty();
  // loop through all of our stories and generate HTML for them
  for (let story of ownStories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}