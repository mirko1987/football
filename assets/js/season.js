import  config  from './config.js'
import { fetchData,initTableSeason} from './utils.js';
const apiKey = config.apiKey
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const season = urlParams.get('season')
let url = `https://v3.football.api-sports.io/players?league=${id}&&season=${season}`;


document.addEventListener("DOMContentLoaded", () => {
const data = JSON.parse(localStorage.getItem('https://v3.football.api-sports.io/leagues'));
const nameLeague = data?.response.find((item)=>item.league.id==id )?.league.name;
const selectorContainer = document.createElement("div");

selectorContainer.id="selector-container";
selectorContainer.classList.add="detail-option"
const tableContainer = document.getElementById("table-container");
const secondaryContainer = document.getElementById("secondary-section");
const logoUrl = data?.response.find((item)=>item.league.id==id)?.league.logo;
const selector =  document.getElementById("selector-container");
const select = document.createElement("select");
select.id = "season";
 
const options = [
  { value: "2020", text: "2020" },
  { value: "2022", text: "2022" }
  
];


options.forEach(optionData => {
  const option = document.createElement('option');
  option.value = optionData.value;
  option.textContent = optionData.text;
  select.appendChild(option);
});

const element =  document.createElement("p");
element.classList.add("detail");

element.innerHTML = `${season} season detail`;
secondaryContainer.insertBefore(selectorContainer,tableContainer);
selectorContainer.appendChild(element);
selectorContainer.appendChild(select)
const header = document.getElementById("header"); 
const logo =  document.createElement("img");

logo.src=logoUrl;

const  title = document.createElement("h2");
title.innerHTML = nameLeague;
title.classList.add("primary");
header.appendChild(logo)
header.appendChild(title);
select.addEventListener("change", (event) => {
  const selectedSeason = event.target.value;
  element.innerHTML = `${selectedSeason} season detail`; // Update the detail paragraph
  let url = `https://v3.football.api-sports.io/players?league=${id}&&season=${selectedSeason}`;

  fetchData(url,apiKey)
  .then(data=>{
	console.log(data)
    
    initTableSeason(data.response,10)
    
  })
  .catch(error=>console.error('Error',error))

  // Add additional filter logic here if needed
  // For example, filter data based on selected season and update the table
});

});




fetchData(url,apiKey)
  .then(data=>{
	console.log(data)
    
    initTableSeason(data.response,10)
    
  })
  .catch(error=>console.error('Error',error))




