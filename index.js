const searchText = document.getElementById("searchText")
const btn = document.getElementById("btn")
const headerTitle = document.getElementById("header--title")
const myWatchList = document.getElementById("myWatchList")
let movieSearch = document.getElementById("movieSearch")
let watchListView = false
let movieArray = []

// button event listeners for search input
btn.addEventListener("click", ()=> {
    movieSearch.innerHTML = ""
    getMovies(searchText.value)

})

// Enter key event listeners for search input
searchText.addEventListener('keyup',function(e){
    if (e.key == "Enter") {
        movieSearch.innerHTML = ""
        movieSearch.innerHTML = ""
        getMovies(searchText.value)
  }
});

// event listeners for switching from 'Watchlist' view to' Search' view
document.addEventListener("click", (e) => {
    let imdbid = (e.target.dataset.imdbid)
    if  (e.target.id == "watchListBtn") { 
        movieArray.forEach(item => {
            if (imdbid == item.imdbID) {
                localStorage.setItem(imdbid, JSON.stringify(item))
            }
        });
    } else if (e.target.id == "watchListBtnMinus") {
        localStorage.removeItem(imdbid)
            watchListEvent()
    } else if  (e.target.id == "myWatchList") {
        if (watchListView == false) {
            watchListEvent()
        } else {
            searchMoviewState()
        } 
    } else if (e.target.id == "watchlist--empty--img") {
        searchMoviewState() 
    } 
})

// Get the movie titles from search input
function getMovies(title) {
    movieArray = []
    fetch(`https://www.omdbapi.com/?s=${title}&apikey=97fdb398`)
        .then(res => res.json())
        .then(data => {
            if (data.Response == "False") {
                renderMovieNotfound()
            } else {
                headerTitle.textContent = "Find your film"
                myWatchList.textContent = "My Watchlist"
                data.Search.forEach(item => {
                    getMovieDetails(item.Title)
                });
            }
        }) 
}

// Get the detailed movie info for each of the movie titles that were returned
function getMovieDetails(title) {
    fetch(`https://www.omdbapi.com/?t=${title}&apikey=97fdb398`)
        .then(res => res.json())
        .then(data => {
            render(data)
            movieArray.push(data)
        }) 
}

// Render the movie details
function render(item) {
    movieSearch.innerHTML += `
    <article id="movie">
        <div>
            <img src="${item.Poster == "N/A" ? "/images/poster_na.jpg" : item.Poster}" class="img--poster" />
        </div>
        <div class="movie--content">
            <div class="movie--title--group">
                <h4>${item.Title}</h4><div class="movie--rating">
                <img src="/images/star.png" class="img--star" /><p>${item.imdbRating}</p>
            </div>
        </div>
        <div class="movie--rating--group">
            <p class="rating--min">${item.Runtime}.</p><p class="rating--groups">${item.Genre}</p>
                <div class="watchlist--icon--group" id="watchListBtn">
                    <img src="/images/watchlist_icon.png" data-imdbid=${item.imdbID} class="img--watchlist" id="watchListBtn" />
                    <p data-imdbid=${item.imdbID} id="watchListBtn">WatchList</p>
                    <img src="/images/watchlist_icon_minus.png" data-imdbid=${item.imdbID} class="img--watchlist" id="watchListBtnMinus" />
                </div>
        </div>
        <div>
            <p class="movie--rating--desc">
            ${item.Plot}</p></div>
        </div>
    </article>`
    
}

// Watchlist view and model functionality
function watchListEvent() {
    watchListView = true
    movieSearch.innerHTML = ""
    headerTitle.textContent = "My Watchlist"
    myWatchList.textContent = "Search for movies"
    document.getElementById("search--group").style.visibility = "hidden"
    if (localStorage.length == 0) {
        renderEmptyWatchlist()
    } else {
        searchText.value = ""
        for (const [key, value] of Object.entries(localStorage)) {
            let data = JSON.parse(value)
            render(data)
        }
    }
}

// Search movie view functionality
function searchMoviewState() {
    searchText.value = ""
    watchListView = false
    document.getElementById("search--group").style.visibility = "visible"
    headerTitle.textContent = "Find your film"
    myWatchList.textContent = "My Watchlist"
    movieSearch.innerHTML = `<img src="/images/exploring.png" class="exploring" />`
}
            
// View for when no movies are stored watchlist storage 
function renderEmptyWatchlist() {
    movieSearch.innerHTML = 
        `<div class="watchlist--empty--group">
            <h3 class="watchlist--empty--title">Your watchlist is looking a little empty...</h3>
            <div class="watchlist--img--group">
                <img id="watchlist--empty--img" src="/images/watchlist_icon.png">
                <p class="watchlist--empty--subtitle"">Let’s add some movies!</p>
            </div>
        </div>`
}

// View for when no movies are returned from search
function renderMovieNotfound() {
    movieSearch.innerHTML = 
        `<div class="movieNotfound--group">
            <h3 class="movieNotfound--title">Unable to find what you’re looking for. Please try another search.</h3>
        </div>`
}



