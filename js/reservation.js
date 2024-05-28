function formatTimeToPB(time, param) {
    const currentDate = new Date(time);

    hourAdditions = 0;
    minuteAdditions = 0;

    switch (param) {
        case '1':
            minuteAdditions = 30;
            break;
        case '2':
            hourAdditions = 1;
            break;
        case '3':
            minuteAdditions = 30;
            hourAdditions = 1;
            break;
        case '4':
            hourAdditions = 2;
            break;
        case '5':
            hourAdditions = 2;
            minuteAdditions = 30;
            break;
        case '6':
            hourAdditions = 3;
            break;
        default:
            break;
    }
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    hours = String(currentDate.getHours() + hourAdditions).padStart(2, '0');
    minutes = String(currentDate.getMinutes() + minuteAdditions).padStart(2, '0');

    if (parseInt(minutes) >= 60) {
        hours = String(parseInt(hours) + 1).padStart(2, '0');
        minutes = String(parseInt(minutes) - 60).padStart(2, '0');
    }

    const formattedDateTimeWithLength = `${year}-${month}-${day} ${hours}:${minutes}:00`;

    return formattedDateTimeWithLength
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function checkReservation() {
    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const amountOfPeople = document.getElementById('amount_of_people').value;
        const timePicker = document.getElementById('date').value;
        const lengthOption = document.getElementById('time').value;

        if(!validateEmail(email))
        {
            responseMessage.innerHTML = '<p>Enter a valid mail address!</p>';
            return;
        }

        const time = formatTimeToPB(timePicker);
        const timeWithLength = formatTimeToPB(timePicker, lengthOption);

        const pb = new PocketBase('http://87.106.133.146:8090');

        const firstResult = await pb.collection('reservation').getList(1, 1, {
            filter: `endDate >= "${time}" && date <= "${time}"`,
        });

        const secondResult = await pb.collection('reservation').getList(1, 1, {
            filter: `endDate >= "${timeWithLength}" && date <= "${timeWithLength}"`,
        });

        if (firstResult.totalItems != 0 || secondResult.totalItems != 0) {
            responseMessage.innerHTML = '<p>Reservations are already found for this time!</p>';

            return;
        }
        responseMessage.innerHTML = '';

        const data = {
            "date": time + 'Z',
            "amountOfPlayers": parseInt(amountOfPeople),
            "customerMail": email,
            "customerName": name,
            "endDate": timeWithLength + 'Z'
        };

        const record = await pb.collection('reservation').create(data);

        alert("Reservation was made!");
    }
    catch (error) {
        console.log(error)
        responseMessage.innerHTML = '<p>Something went wrong!</p>';
    }
}