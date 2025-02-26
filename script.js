// This project uses the TVMaze API (https://www.tvmaze.com/api)
console.log("JavaScript file loaded!");

document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("textbox");
    // Use a more specific selector for the Start button if necessary.
    const startButton = document.querySelector("button");
    const showList = document.getElementById("show-list");
    
    // We declare these globally so they can be used later.
    let seasons = [];
    let episodesPerSeason = [];

    startButton.addEventListener("click", function () {
        const userInput = inputField.value.trim();
        if (userInput === "") {
            alert("Please enter a TV show name!");
            return;
        }
        console.log("Start button clicked!");

        // Fetch TV show data from TVMaze API
        fetch(`https://api.tvmaze.com/singlesearch/shows?q=${userInput}`)
            .then(response => response.json())
            .then(data => {
                if (!data || !data.id) {
                    alert("Show not found!");
                    return;
                }

                // Fetch seasons data for the found show
                fetch(`https://api.tvmaze.com/shows/${data.id}/seasons`)
                    .then(response => response.json())
                    .then(fetchedSeasons => {
                        seasons = fetchedSeasons; // Save seasons globally
                        episodesPerSeason = seasons.map(season => season.episodeOrder || 0);
                        let totalEpisodes = episodesPerSeason.reduce((a, b) => a + b, 0);

                        // Display show information and controls
                        // We include a dropdown with a default option "All Seasons"
                        showList.innerHTML = `
                            <div class="show-container">
                                <img id="show-image" src="${data.image?.medium || 'https://via.placeholder.com/150'}" alt="${data.name} Poster">
                                <div class="show-details">
                                    <h2>${data.name}</h2>
                                    <p>Number of Seasons: ${seasons.length}</p>
                                    <p>Total Episodes: ${totalEpisodes}</p>
                                </div>
                            </div>
                            <label for="season-select">Choose a season:</label>
                            <select id="season-select">
                                <option value="" selected>All Seasons</option>
                            </select>
                            <button id="randbutton">Random Episode</button>
                            <p id="random-episode-result" style="font-weight: bold; margin-top: 10px;"></p>
                        `;

                        // Populate the season dropdown with each season
                        const seasonSelect = document.getElementById("season-select");
                        seasons.forEach((season, index) => {
                            const option = document.createElement("option");
                            option.value = index; // we'll use this index to refer to the season
                            option.textContent = `Season ${season.number}`;
                            seasonSelect.appendChild(option);
                        });

                        // Add event listener to the "Random Episode" button
                        document.getElementById("randbutton").addEventListener("click", function () {
                            console.log("Random Episode button clicked!");
                            // Check the value of the season dropdown
                            const selectedSeasonIndex = seasonSelect.value;
                            if (selectedSeasonIndex === "") {
                                // No specific season selected; pick from all seasons.
                                getRandomEpisode(seasons, episodesPerSeason);
                            } else {
                                // A specific season is selected; pick a random episode from that season.
                                getRandomEpisodeFromSeason(seasons[selectedSeasonIndex]);
                            }
                        });
                    })
                    .catch(error => console.error("Error fetching seasons:", error));
            })
            .catch(error => {
                console.error("Error fetching show:", error);
                alert("Something went wrong, please try again!");
            });
    });
});

// Function to pick a random episode from all seasons
function getRandomEpisode(seasons, episodesPerSeason) {
    if (seasons.length === 0) {
        alert("No seasons available.");
        return;
    }
    let randomSeasonIndex = Math.floor(Math.random() * seasons.length);
    let randomSeason = seasons[randomSeasonIndex];
    let numEpisodes = episodesPerSeason[randomSeasonIndex];
    if (numEpisodes === 0) {
        alert("No episodes available in this season.");
        return;
    }
    let randomEpisode = Math.floor(Math.random() * numEpisodes) + 1;
    document.getElementById("random-episode-result").innerText =
        `Random Episode: Season ${randomSeason.number}, Episode ${randomEpisode}`;
}

// Function to pick a random episode from a specific season
function getRandomEpisodeFromSeason(season) {
    if (!season) {
        alert("Invalid season selected.");
        return;
    }
    const numEpisodes = season.episodeOrder || 0;
    if (numEpisodes === 0) {
        alert("No episodes available for this season.");
        return;
    }
    let randomEpisode = Math.floor(Math.random() * numEpisodes) + 1;
    // Display the result in the designated paragraph.
    document.getElementById("random-episode-result").innerText =
        `Random Episode: Season ${season.number}, Episode ${randomEpisode}`;
}
