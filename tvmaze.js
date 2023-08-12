"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const BASE_URL = 'http://api.tvmaze.com';

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
    return formattedShow;
  });
  //console.log(formatted);
  return formattedShows;

  /*   [
      {
        id: 1767,
        name: "The Bletchley Circle",
        summary:
          `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
             women with extraordinary skills that helped to end World War II.</p>
           <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
             normal lives, modestly setting aside the part they played in
             producing crucial intelligence, which helped the Allies to victory
             and shortened the war. When Susan discovers a hidden code behind an
             unsolved murder she is met by skepticism from the police. She
             quickly realises she can only begin to crack the murders and bring
             the culprit to justice with her former friends.</p>`,
        image:
            "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
      }
    ] */
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();
  const missingImage = 'https://tinyurl.com/tv-missing';


  //May need to modify below to add in a button
  for (const show of shows) {
    let displayedImage = (show.image) ? show.image.medium : missingImage;

    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${displayedImage}
              alt="Bletchly Circle San Francisco"
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
    $('.Show-getEpisodes').on('click', () => {
      getEpisodesOfShow(show.id);
    });
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

async function getEpisodesOfShow(id) {

  //make fetch call to
  //http://api.tvmaze.com/shows/[showid]/episodes
  let episodesURL = `${BASE_URL}/shows/${id}/episodes`;
  const response = await fetch(episodesURL);
  const result = await response.json();
  console.log(result);
}

/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design
