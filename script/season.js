import  config  from './config.js'
import { fetchData,initTableSeason} from './utils.js';

const apiKey = config.apiKey
const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const season = urlParams.get('season')
const url = `https://v3.football.api-sports.io/players?league=${id}&&season=${season}`;


fetchData(url,apiKey)
  .then(data=>{
	console.log(data)
    initTableSeason(data.response,10)
  })
  .catch(error=>console.error('Error',error))




