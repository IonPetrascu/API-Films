const API_LINK =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=1";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_KEY = "d27129e9-e5e1-438b-912a-9e9e8564c61b";

getMovies(API_LINK);
async function getMovies(url) {
  const rest = await fetch(url, {
    method: "GET",
    headers: {
      "X-API-KEY": API_KEY,
      "Content-Type": "application/json",
    },
  });
  const responseData = await rest.json();

  createBtnPagination(responseData);

  if (responseData.items) {
    showMovies(responseData.items);
  }
  if (responseData.films) {
    showMovies(responseData.films);
  }
}

function checkRating(rating) {
  const ratingFloor = Math.floor(rating);
  if (ratingFloor !== null) {
    if (ratingFloor >= 7) {
      return "green";
    } else if (ratingFloor > 5) {
      return "orange";
    } else if (ratingFloor < 5) {
      return "red";
    }
  }
}

function showMovies(data) {
  const movies = document.querySelector(".movies");
  //curatim filmele trecute
  document.querySelector(".movies").innerHTML = "";

  data.forEach((movie) => {
    const movieEl = document.createElement("div");
    let rating;
    if (movie.rating && movie.rating !== "null") {
      rating = movie.rating;
    } else if (movie.ratingKinopoisk) {
      rating = +movie.ratingKinopoisk;
    }

    movieEl.classList.add("movie");

    movieEl.innerHTML = `
    
                <div class="movie__cover-inner">
                    <img class="movie__cover" src="${
                      movie.posterUrlPreview
                    }" alt="${movie.nameRu}">
                    <div class="movie__cover--darkened">

                    </div>
                </div>
                <div class="movie__info">
                    <div class="movie__title">
                      ${movie.nameRu}
                    </div>
                    <div class="movie__category">
                    ${movie.genres.map((genres) => ` ${genres.genre} `)}
                    </div>
                    ${rating &&`<div class="movie__average movie__average--${checkRating(rating)}">${rating}</div></div>`}
                   
            
    `;
    movies.appendChild(movieEl);
  });
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  console.log(apiSearchUrl);
  if (search.value) {
    getMovies(apiSearchUrl);
  }
  search.value = "";
});

//page btn

function createBtnPagination(data) {
  let divButtons = document.querySelector(".buttons");
  divButtons.innerHTML = '';
  const total = data.total;
  const pages = data.totalPages;

  for (let i = 0; i < pages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.classList.add("page-btn");
    pageBtn.innerText = i + 1;
    divButtons.appendChild(pageBtn);
  }

  const pageBtn = document.querySelectorAll(".page-btn");

  pageBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      getMovies(
        `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=${btn.innerHTML}`
      );
    });
  });
}
