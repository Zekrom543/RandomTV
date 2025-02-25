// This project uses the TVMaze API (https://www.tvmaze.com/api)


console.log("JavaScript file loaded!");

document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("textbox");
    const startButton = document.querySelector("button");
    const showList = document.getElementById("show-list");

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

                // Fetch seasons data
                fetch(`https://api.tvmaze.com/shows/${data.id}/seasons`)
                    .then(response => response.json())
                    .then(seasons => {
                        let episodesPerSeason = seasons.map(season => season.episodeOrder || 0);
                        let totalEpisodes = episodesPerSeason.reduce((a, b) => a + b, 0);

                        // Display show information
                        showList.innerHTML = `
                            <div class="show-container">
                                <img id="show-image" src="${data.image?.medium || 'https://via.placeholder.com/150'}" alt="${data.name} Poster">
                                <div class="show-details">
                                    <h2>${data.name}</h2>
                                    <p>Number of Seasons: ${seasons.length}</p>
                                    <p>Total Episodes: ${totalEpisodes}</p>
                                </div>
                            </div>
                            <button id="randbutton">Random Episode</button>
                            <p id="random-episode-result" style="font-weight: bold; margin-top: 10px;"></p>
                        `;

                        // Select the random episode button after it is created
                        const randButton = document.getElementById("randbutton");
                        randButton.style.display = "block"; // Ensure button is visible

                        randButton.addEventListener("click", function () {
                            console.log("Random Episode button clicked!");
                            getRandomEpisode(seasons, episodesPerSeason);
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

    let resultDisplay = document.getElementById("random-episode-result");

    if (resultDisplay) {
        resultDisplay.innerText = ` Random Episode: Season ${randomSeason.number}, Episode ${randomEpisode}`;
    } else {
        console.error("Error: Could not find 'random-episode-result' in the DOM.");
    }
}
