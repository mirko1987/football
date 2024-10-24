import  config  from './config.js'
import { fetchData,populateDropdown,resetDropdown,createGoalsChart} from './utils.js';

const url = "https://v3.football.api-sports.io/leagues";

document.addEventListener('DOMContentLoaded', function () {
    const apiKey = config.apiKey // Replace with your actual API key

    const leaguesDropdown = document.getElementById('leagues-dropdown');
    const seasonsDropdown = document.getElementById('seasons-dropdown');
    const teamsDropdown = document.getElementById('teams-dropdown');

    

    // Fetch leagues and populate leagues dropdown
   // Fetch leagues and populate leagues dropdown
   fetchData(url, apiKey)
   .then(data => {
        // Debugging
       if (data && data.response) {
           populateDropdown(leaguesDropdown, data.response, 'league');
           
       } else {
           console.error('Leagues data is not in expected format:', data);
       }
   })
   .catch(error => console.error('Error fetching leagues:', error));

// Event listener for league selection to load seasons
leaguesDropdown.addEventListener('change',async  function () {
    const leagueId = leaguesDropdown.value;
    
    
    if (leagueId) {
        // Fetch seasons for the selected league
        fetchData(url, apiKey)
            .then(data => {
                const selectedLeague = data.response.find(league => league.league.id === parseInt(leagueId));
                if(selectedLeague && selectedLeague.seasons){
                    const filteredSeasons = selectedLeague.seasons;
                    populateDropdown(seasonsDropdown, filteredSeasons, 'season');
                    seasonsDropdown.disabled = false;
                }
              
            })
            .catch(error => console.error('Error fetching seasons:', error));

        resetDropdown(teamsDropdown);
    } else {
        resetDropdown(seasonsDropdown);
        resetDropdown(teamsDropdown);
    }
});

    // Event listener for league selection to load seasons
  
    // Event listener for season selection to load teams
    seasonsDropdown.addEventListener('change', function () {
        const seasonYear = seasonsDropdown.value;
        const leagueId = leaguesDropdown.value;
         
      
        if (leagueId) {
           
            // Fetch teams for the selected league and season
            fetchData(`https://v3.football.api-sports.io/teams?league=${leagueId}&&season=${seasonYear}`, apiKey)
                .then(data => {
                       
                    teamsData = data.response;
                    
                    // Store the teams data for filtering
                    populateDropdown(teamsDropdown, data.response, 'team');
                    teamsDropdown.disabled = false;
                })
                .catch(error => console.error('Error fetching teams:', error));
        } else {
            resetDropdown(teamsDropdown);
        }
    });
    teamsDropdown.addEventListener('change',function(){
        const seasonYear = seasonsDropdown.value;
        const leagueId = leaguesDropdown.value;
        const team = teamsDropdown.value;

        console.log(seasonYear,leagueId,team,'values');
        const statisticUrl = `https://v3.football.api-sports.io/teams/statistics?season=${seasonYear}&team=${team}&league=${leagueId}`;
        fetchData(statisticUrl, apiKey)
        .then(data => {
               
            console.log(data,'ciao')
            createGoalsChart(data)
            // Store the teams data for filtering
           
        })
        .catch(error => console.error('Error fetching teams:', error));

    })
});





