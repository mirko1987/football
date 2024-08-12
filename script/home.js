import  config  from './config.js'

const apiKey = config.apiKey;


const seasonStartDates = [];
let season =null;
let id = null;
const columnDefs = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Country Name', field: 'countryName' },
    { headerName: 'League Name', field: 'leagueName',field: 'countryName', filter:true
 },
    { headerName: 'League Type', field: 'leagueType',filter: 'agSetColumn',
    filterParams: {
        // Optional: Customize filter parameters
        showClearButton: true, // Display a clear button in the filter menu
        values: (params) => {
          // Set filter values dynamically based on the column data
          const uniqueValues = [...new Set(params.values)];
          params.success(uniqueValues);
        }} },
    { headerName: 'League Logo', field: 'leagueLogo', cellRenderer: params => `<img src="${params.value}" style="height: 20px;" />` },
    {headerName:'Year', editable:true,cellEditor: 'agSelectCellEditor', cellEditorParams: {
      values: seasonStartDates // Dropdown values for the season
  } ,field :'season',

  }
  ];

  
   

 const  onCellValueChanged = (e)=>{
if(e.colDef.field==='season' && e.oldValue !== e.newValue){
  let column = e.column.colDef.field;
   season = e.newValue;
   console.log(season,'season')
  //change color
  e.column.colDef.cellStyle = { 'background-color': '#d4edda' };
            e.api.refreshCells({
                force: true,
                columns: [column],
                rowNodes: [e.node]
        });
       
}
 }
 

  function onCellClicked(e) {
    if(e.colDef.field==='id' ){

   id = e.data; // Extract the id from the row data
   season=e.data;
    console.log(id);
    console.log(season.season)
    let column = e.column.colDef.field;
   season = e.newValue;
  //change color
  e.column.colDef.cellStyle = { 'background-color': '#d4edda' };
            e.api.refreshCells({
                force: true,
                columns: [column],
                rowNodes: [e.node]
        });

        console.log(season)

        // Navigate to the new view with the id
        window.location.href = `../view/season.html?id=${id.id}&&season=${id.season}`;
   
    }

    
    
   
      // Adjust the URL as needed
    
  }
  


 

// Function to initialize AG Grid
function initializeGrid(data) {
    const gridOptions = {
      columnDefs: columnDefs,
      rowData: data,
      pagination: true, // Enable pagination
      paginationPageSize: 20, // Number of items per page
      onCellValueChanged: onCellValueChanged,
      onCellClicked:onCellClicked,
      domLayout: 'autoHeight' // Automatically adjust grid height
    };
    const eGridDiv = document.querySelector('#myGrid');

  // Create the grid passing in the div to use together with the grid options
  agGrid.createGrid(eGridDiv, gridOptions);
}


fetch("https://v3.football.api-sports.io/leagues", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "v3.football.api-sports.io",
		"x-rapidapi-key": `${apiKey}`
	}
})

.then(response => response.json())
.then(data => {
  
  data.response.forEach(response => {
    response.seasons.forEach(season => {
        const startDate = season.year;
        if (!seasonStartDates.includes(startDate)) {
            seasonStartDates.push(startDate);
        }
    });
});

  
  //Process and destructure data
  const rowData = data.response.map(item => ({
    id: item.league.id,
    countryName: item.country.name,
    leagueName: item.league.name,
    leagueType: item.league.type,
    leagueLogo: item.league.logo,
    season:item.seasons.map(item=>item.year)
    // Add more fields if needed
  }));

  

 initializeGrid(rowData); // Pass rowData to initializeGrid
})
.catch(err => {
	console.log(err);
});
