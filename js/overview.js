async function getReservations() {
    const pb = new PocketBase('https://pocketbase.solidhorizons.net:8090');

    try {
        const records = await pb.collection('reservation').getFullList({
            sort: '-created',
        });

        tableFormat = `<table><tr><th>Customer Name</th><th>Customer Mail</th><th>Reservation Date</th><th>Reservation Length</th><th>Players</th></tr>`;

        records.forEach(element => {
            tableFormat += `<tr><td>${element.customerName}</td><td>${element.customerMail}</td><td>${element.date}</td><td>${element.endDate}</td><td>${element.amountOfPlayers}</td></tr>`;
        });

        tableFormat + `</table>`;

        document.getElementById('searchTable').innerHTML = tableFormat;
    }
    catch (error) {
        console.log(error);
    }
}

async function performSearch() {
    const pb = new PocketBase('https://pocketbase.solidhorizons.net:8090');

    try {
        const searchCriteria = document.getElementById('searchCriteria').value;
        const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();

        if (!searchInput) {
            searchResults.innerHTML = '<p>Please enter a search term.</p>';
            return;
        }

        const resultList = await pb.collection('reservation').getList(1, 10, {
            filter: `${searchCriteria}?~"${searchInput}"`,
        });

        console.log(resultList);

        tableFormat = `<table><tr><th>Customer Name</th><th>Customer Mail</th><th>Reservation Date</th><th>Reservation Length</th><th>Players</th></tr>`;

        resultList['items'].forEach(element => {
            tableFormat += `<tr><td>${element.customerName}</td><td>${element.customerMail}</td><td>${element.date}</td><td>${element.endDate}</td><td>${element.amountOfPlayers}</td></tr>`;
        });

        tableFormat + `</table>`;

        document.getElementById('searchTable').innerHTML = tableFormat;
    }
    catch (error) {
        console.log(error);
    }
}