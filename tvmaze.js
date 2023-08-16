"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const BASE_URL = 'http://api.tvmaze.com';
const MISSING_URL = 'https://tinyurl.com/tv-missing';

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */


//TODO: get show.id passed to handleEpisodes function properly
//build displayEpisodes
async function getShowsByTerm(searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const params = new URLSearchParams({ q: searchTerm });
  const response = await fetch(`${BASE_URL}/search/shows?${params}`);
  const result = await response.json();
  //console.log(result);

  let formattedShows = result.map(item => {
    let show = item.show;
    let { id, name, summary, image } = show;
    let formattedShow = {
      id,
      name,
      summary,
      image
    };
    let displayedImage = (show.image) ? show.image.medium : MISSING_URL;
    formattedShow.image = displayedImage;
    return formattedShow;
  });
  //console.log(formatted);
  return formattedShows;

}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  //May need to modify below to add in a button
  for (const show of shows) {

    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);
    //Could add event listeners to each button, do this within loop
    $('.Show').on('click', getEpisodesOfShow)
    $showsList.append($show);
  }

  //"http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg"
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});




/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(evt) {
  const id = evt.currentTarget.dataset.showId
  //make fetch call to
  //http://api.tvmaze.com/shows/[showid]/episodes
  let episodesURL = `${BASE_URL}/shows/${id}/episodes`;
  const response = await fetch(episodesURL);
  const result = await response.json();
  const formattedEpisode = result.map(item => {
    return { 
      name : item.name,
      number : item.number,
      season : item.season
    }
  })
  return formattedEpisode;
}
//<li>Pilot (season 1, number 1)</li>
/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design
