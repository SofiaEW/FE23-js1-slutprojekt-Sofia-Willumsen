const API_KEY = "458c0696954fcb9f0c99f33050235a04";
let topMovieArr = [];
let popMovieArr = [];

function showTopRatedMovies() {
	const div1 = document.querySelector("#topMovies");
	div1.innerHTML = "";

	const url1 = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&api_key=${API_KEY}`;

	fetch(url1)
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else if (response.status === 404) {
				throw 404;
			} else {
				throw "error";
			}
		})
		.then((json) => {
			const movies = json.results.slice(0, 10);
			topMovieArr = movies;
			displayMovies(div1, movies);
		});
}

function showMostPopularMovies() {
	const div2 = document.querySelector("#popMovies");
	div2.innerHTML = "";

	const url2 = `https://api.themoviedb.org/3/movie/popular?language=en-US&api_key=${API_KEY}`;

	fetch(url2)
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else if (response.status === 404) {
				throw 404;
			} else {
				throw "error";
			}
		})
		.then((json) => {
			const movies = json.results.slice(0, 10);
			popMovieArr = movies;
			displayMovies(div2, movies);
		});
}

// Function to display the movies in a container div.
function displayMovies(container, movies) {
	movies.forEach((movie) => {
		const movieDiv = document.createElement("div");
		const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

		movieDiv.innerHTML = `
                    <img src="${imageUrl}" alt="${movie.title} Poster">
                    <h4>${movie.title}</h4>
                    <p>${movie.release_date}</p>
                `;

		container.appendChild(movieDiv);
	});
}

// Add eventlisteners to the buttons
document
	.getElementById("topRatedMoviesButton")
	.addEventListener("click", showTopRatedMovies);
document
	.getElementById("mostPopularMoviesButton")
	.addEventListener("click", showMostPopularMovies);

// Search-form for movies or person
const form = document.querySelector("form");
const errorContainer = document.getElementById("errorContainer");
form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const formSearchInput = document.querySelector("#movies").value;
	const radioButtonPicked = document.querySelector(
		'input[name="radioButton"]:checked'
	).value;

	let mySearch = "";
	let url = "";

	if (radioButtonPicked == "person" || radioButtonPicked == "movie") {
		mySearch = formSearchInput;

		if (radioButtonPicked === "movie") {
			url = `https://api.themoviedb.org/3/search/movie?query=${formSearchInput}&include_adult=false&language=en-US&api_key=${API_KEY}`;
		} else if (radioButtonPicked === "person") {
			url = `https://api.themoviedb.org/3/search/person?query=${formSearchInput}&include_adult=false&language=en-US&api_key=${API_KEY}`;
		}

		try {
			const movieData = await fetchInfo(url);
			showMovies(movieData);
		} catch (error) {
			displayError(error);
			console.log(error);
		}
		console.log(url);
	}

	async function fetchInfo(url) {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	}

	function displayError(error) {
		errorContainer.innerHTML = "";

		let h4El = document.createElement("h4");

		if (error.results == 404) {
			h4El.innerText = "Check your spelling and try again";
		} else {
			h4El.innerText = "Something went wrong, try again";
		}

		errorContainer.appendChild(h4El);
		console.log(error);
	}

	function showMovies(movieData) {
		const resultContainer = document.querySelector("#resultContainer");
		resultContainer.innerHTML = "";

		if (movieData.results.length > 0) {
			movieData.results.forEach((movie) => {
				const movieDiv = document.createElement("div");
				const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
				const imageUrl2 = `https://image.tmdb.org/t/p/w500${movie.profile_path}`;

				console.log(movie);

				if (radioButtonPicked == "movie") {
					movieDiv.innerHTML = `
                        <img src="${imageUrl}" alt="${movie.title} Poster">
                        <h4>Title: ${movie.title}</h4>
                        <p>Release date: ${movie.release_date}</p>
                        <p>Overview: ${movie.overview}</p>
                    `;

					resultContainer.appendChild(movieDiv);
				}

				if (radioButtonPicked == "person") {
					const img = document.createElement("img");
					img.src = imageUrl2;
					img.alt = `${movie.name} Poster`;

					const name = document.createElement("h4");
					name.innerText = `Name: ${movie.name}`;

					const department = document.createElement("p");
					department.innerText = `Department: ${movie.known_for_department}`;

					movieDiv.appendChild(img);
					movieDiv.appendChild(name);
					movieDiv.appendChild(department);

					const knownForContainer = document.createElement("div");

					movie.known_for.forEach((knownForItem) => {
						const mediaTypeAndTitle = document.createElement("p");
						if (knownForItem.media_type === "tv") {
							mediaTypeAndTitle.innerText = `TV show: ${knownForItem.name}`;
						} else {
							mediaTypeAndTitle.innerText = `${knownForItem.media_type}: ${knownForItem.title}`;
						}
						knownForContainer.appendChild(mediaTypeAndTitle);
					});

					movieDiv.appendChild(knownForContainer);
				}

				resultContainer.appendChild(movieDiv);
			});
		} else {
			// Display a message when no results are found
			const messageP = document.createElement("p");
			messageP.innerText = "No results found. Please try again";
			resultContainer.appendChild(messageP);
		}
	}
});

anime({ targets: "#test", translateX: 200, loop: true, autoplay: true });
