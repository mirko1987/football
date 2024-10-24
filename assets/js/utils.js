import  config  from './config.js'

const apiKey = config.apiKey;
let selectedId = null;
let selectedSeason = null;
export const getCache = (key) => {
   
    const cacheData = localStorage.getItem(key);
    return cacheData ? JSON.parse(cacheData) : null;
}

export const setCache = (key, data) => {
   
    localStorage.setItem(key, JSON.stringify(data));
}

export const fetchData = async (url, apiKey) => {
    try {
        const cachedData = getCache(url);
        if (cachedData) {
            
            return cachedData;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": `${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data,'data')
        setCache(url, data);
        return data;

    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export const seasonTable=(data, itemsPerPage = 10, currentPage = 1)=>{
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedData = data.slice(startIndex, endIndex);

     // Create the table headers using template literals
     const tableHeaders = `
     <thead>
         <tr>
             <th>firstName</th>
             
             <th>lastName</th>
             <th>age</th>

             <th>nationality</th>
             <th>photo</th>
             <th>goals</th>
             
         </tr>
     </thead>
 `;

 const tableRows =  paginatedData.map(el => `
    <tr>
        <td class="clickable-id" rowspan="${el.length}">${el.player.name}</td>
        <td rowspan="${el.length}">${el.player.lastname}</td>
        <td rowspan="${el.length}">${el.player.age}</td>
        <td rowspan="${el.length}">${el.player.nationality}</td>
        
        <td rowspan="${el.length}">
            <img src="${el.player.photo}" alt="${el.player.photo} Logo" style="width: 30px;">
           
        </td>
         <td rowspan="${el.length}" >${el.statistics[0].goals.total}</td>
      
         
    </tr>
`).join('');
const tableHTML = `
        <table border="1" cellpadding="5" style="width: 100%;">
            ${tableHeaders}
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;

    const tableContainer = document.getElementById('table-container');
  
    tableContainer.innerHTML = '';
    tableContainer.innerHTML += tableHTML;

    let paginationControls = '';
    if (totalPages > 1) {
        paginationControls = `
            <div style="text-align: center; margin-top: 10px;">
                <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">Previous</button>
                <span>Page ${currentPage} of ${totalPages}</span>
                <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next</button>
            </div>
        `;
}

document.getElementById('pagination-container').innerHTML = paginationControls;
tableContainer.addEventListener('click', handleTableClick);

tableContainer.addEventListener('change', handleDropdownChange);

}



export const  createTable=(data, itemsPerPage = 10, currentPage = 1)=> {
    const totalItems = data.length;
    
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedData = data.slice(startIndex, endIndex);

    // Create the table headers using template literals
    const tableHeaders = `
        <thead>
            <tr>
            <th>Logo</th>   
            <th>Region</th>
            <th>League</th>
            <th>Seasons</th>
            <th>Details</th>
                
            </tr>
        </thead>
    `;

    // Create the table body rows for each season
    const tableRows =  paginatedData.map(el => `
        <tr>
        <td rowspan="${el.length}">
        <img src="${el.league.logo}" alt="${el.league.name} Logo" style="width: 30px;">
       
    </td>
            <td rowspan="${el.length}">${el.country.name}</td>
            <td rowspan="${el.length}" >${el.league.name}</td>
            <td  class="season" rowspan="${el.length}">${el.seasons[0].year}</td>
            <td  rowspan="${el.length}">
                   <button class="detail" id=${el.league.id}>details</button>
               </td>
             
        </tr>
    `).join('');

    // Combine the headers and rows into a single table
    const tableHTML = `
        <table border="1" cellpadding="5" style="width: 100%;">
            ${tableHeaders}
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;


    

    // Add the table to the document body
    const tableContainer = document.getElementById('table-container');
  
     tableContainer.innerHTML = '';
     tableContainer.innerHTML += tableHTML;

     // Create pagination controls
     let paginationControls = '';
     if (totalPages > 1) {
         paginationControls = `
             <div style="text-align: center; margin-top: 10px;">
                 <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">Previous</button>
                 <span>Page ${currentPage} of ${totalPages}</span>
                 <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next</button>
             </div>
         `;
}
document.getElementById('pagination-container').innerHTML = paginationControls;
tableContainer.addEventListener('click', handleTableClick);

tableContainer.addEventListener('change', handleDropdownChange);

}


const handleTableClick = (event) => {
    const clickedIdCell = event.target.closest('.clickable-id');
    if (clickedIdCell) {
        selectedId = clickedIdCell.innerHTML;
        console.log(`ID clicked: ${selectedId}`);
        
        // Check if both ID and Season are selected before navigating
        if (selectedId && selectedSeason!=null) {
            console.log(selectedId,selectedSeason)
           // window.location.href = `../view/season.html?id=${selectedId}&season=${selectedSeason}`;
        }
    }
};


// Attach event listener using event delegation for dynamic elements
document.getElementById('table-container').addEventListener('click', function(e) {
    if (e.target && e.target.className ==="detail") {
       // Get the clicked row (tr element)
       const id = e.target.id
       const clickedRow = e.target.closest('tr');
        console.log(clickedRow)
       // Assuming the season is in a specific cell, e.g., the second cell (index 1)
       const seasonCell = clickedRow.querySelector('.season'); // Assuming a 'season' class exists on the season cell
       
       // Extract the season value from the cell
       const seasonValue = seasonCell.textContent || seasonCell.innerText;

        window.location.href = `../view/season.html?id=${id}&season=${seasonValue}`;

         // Call the function when the detail button is clicked
    }
});


const handleDropdownChange = (event) => {
    const dropdown = event.target.closest('.season-dropdown');
    const clickedIdCell = event.target.closest('.clickable-id');
    if (clickedIdCell) {
        selectedId = clickedIdCell.innerHTML;
        console.log(`ID clicked: ${selectedId}`);
    }
    if (dropdown) {
        selectedSeason = event.target.value;
      
        console.log(selectedSeason)
        
        console.log(`Season selected for ID : ${selectedSeason}`);
        
        // Check if both ID and Season are selected before navigating
        if (selectedId && selectedSeason!=null) {
            window.location.href = `../view/season.html?id=${selectedId}&season=${selectedSeason}`;
        }
    }
};
window.changePage =function (newPage){
    const url = window.location.href;
    const containsSeason = url.includes("season");
    const containsId = url.includes("id");

    if (containsSeason && containsId) {
        seasonTable(window.data, window.itemsPerPage, newPage)
    }

    createTable(window.data, window.itemsPerPage, newPage);
};
export const initTableSeason = (jsonData, perPage = 20) => {
    // Save data and itemsPerPage as global variables
    window.data = jsonData;
    window.itemsPerPage = perPage;
    seasonTable(jsonData, perPage, 1);  // Start with the first page
};
export const initTable = (jsonData, perPage = 20) => {
    // Save data and itemsPerPage as global variables
    window.data = jsonData;
    window.itemsPerPage = perPage;
    createTable(jsonData, perPage, 1);  // Start with the first page
};



/**
 * Function to populate the dropdown with league names
 * @param {HTMLSelectElement} dropdown - The dropdown element to populate
 * @param {Array} leaguesData - The array of leagues data to use for populating options
 */


/**
 * Function to populate a dropdown with fetched data
 * @param {HTMLSelectElement} dropdown - The dropdown element to populate
 * @param {Array} data - The array of data to use for populating options
 * @param {string} type - The type of data being populated (e.g., 'league', 'season', 'team')
 */

export const populateDropdown = (dropdown, data, type) => {
    //resetDropdown(dropdown);  // Ensure the dropdown is reset before populating

    if (type === 'league') {
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.league.id;
            option.textContent = item.league.name;
            dropdown.appendChild(option);
        });
    } 
    else if (type === 'season' && data.length!=0) {
        console.log(data, 'Filtered Seasons Data');
        // Directly iterate over the seasons array of the selected league
        data.map(season=>{
            console.log(season.year)
            let option = document.createElement('option');
            option.value=season.year;
            option.textContent=season.year;
            dropdown.appendChild(option);

        })
    } 
    else if (type === 'team') {
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.team.id;
            option.textContent = item.team.name;
            dropdown.appendChild(option);
        });
    }
};


export const  createGoalsChart=(data)=>{
    // Extracting data for the chart
    const homeGoals = data.response.goals.for.total.home;
    const awayGoals = data.response.goals.for.total.away;

    // Get the context of the canvas where we want to render the chart
    const ctx = document.getElementById('goalsChart').getContext('2d');

    // Create the chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Home Goals', 'Away Goals'],
            datasets: [{
                label: 'Goals Scored',
                data: [homeGoals, awayGoals],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Sample JSON data (can be replaced with dynamic data)
const jsonData = {
    "response": {
        "goals": {
            "for": {
                "total": {
                    "home": 40,
                    "away": 30
                }
            }
        }
    }
};
/**
 * Function to reset a dropdown to its initial state
 * @param {HTMLSelectElement} dropdown - The dropdown element to reset
 */
export const resetDropdown = (dropdown)=>{
    dropdown.innerHTML = `<option value="">Select an option...</option>`;
    dropdown.disabled = true;
}




// Example data.response object


// Call the function to create and display the table

