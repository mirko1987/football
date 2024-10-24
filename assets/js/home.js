import  config  from './config.js'
import { fetchData,initTable} from './utils.js';

const apiKey = config.apiKey;

const url = "https://v3.football.api-sports.io/leagues"




fetchData(url,apiKey)
  .then(data=>{
	console.log(data)
    initTable(data.response,20)
  })
  .catch(error=>console.error('Error',error))


  
   


 


  


 







