import  config  from './config.js'

const apiKey = config.apiKey
const ctx =document.getElementById('myChart');
//coldef for table

const columnDefs = [
  { headerName: 'firstname', field: 'firstname' },
  { headerName: 'lastname', field: 'lastname' },
  { headerName: 'age ', field: 'age' },
  { headerName: 'nationality', field: 'nationality', filter:true
},
  { headerName: 'photo', field: 'photo', cellRenderer: params => `<img src="${params.value}" style="height: 20px;" />` 

},
{headerName:'goals',field:'statistics',cellRenderer:function(params){
  console.log(params.data.statistics
    ,'params')
  const totalGoals= params.data.statistics? params.data.statistics : 'N/A'
  return `<span>${totalGoals}</span>`
},filter:true}
];
//chart 



//create table 


function initializeGrid(data) {
  const gridOptions = {
    columnDefs: columnDefs,
    rowData: data,
    pagination: true, // Enable pagination
    paginationPageSize: 20, // Number of items per page
    suppressRowHoverHighlight: true,
    enableRangeSelection: true,
    popupParent: document.body,
    
    // turns ON column hover, it's off by default
    columnHoverHighlight: true,
    

    domLayout: 'autoHeight' // Automatically adjust grid height
  };
  const eGridDiv = document.querySelector('#teams');

// Create the grid passing in the div to use together with the grid options
agGrid.createGrid(eGridDiv, gridOptions);
}






async function loadDetails(){
    try{
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const season = urlParams.get('season')
        
        if(!id){
            throw new Error('No id parameter found in url')
        }
        const apiUrl = `https://v3.football.api-sports.io/players?league=${id}&&season=${season}`;

        const response = await fetch(apiUrl, {
            headers: {
              'x-apisports-key': `${config.apiKey}` // Replace with your actual API key
            }
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
         
          if (data && data.response && data.response.length > 0) {
            console.log(data)
            console.log(data.response.map(item=>item.statistics),'data')
            console.log(data.response[0].statistics[0].games,'cards')
          //test chart
           new Chart(ctx,{
            type:'bar',
            data:{
              labels:['appearences','lineups','minutes'],
              datasets: [{
                label: 'cards',
                data: [
                  data.response[0].statistics[1]?.games.appearences,
                  data.response[0].statistics[1]?.games.lineups,
                  data.response[0].statistics[1]?.games.minutes],
                borderWidth: 1
              }]
            }
          })
            const rowData = data.response.map(item => ({
              
              firstname:item.player.firstname,
              lastname: item.player.lastname,
              height: item.player.height,
              age:item.player.age,
              nationality: item.player.nationality,
              photo: item.player.photo,
              statistics: item.statistics[0].goals.total
             
            }));

            initializeGrid(rowData);
          
          } else {
            throw new Error('No data found for the provided ID');
          }
        } catch (error) {
          console.error('Error fetching details:', error);
          document.getElementById('details').innerHTML = '<p>Error loading details. Please try again later.</p>';
        }

    }

    loadDetails()
