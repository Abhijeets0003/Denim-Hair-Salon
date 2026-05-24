async function getBookings(){

    try{

        const response = await fetch(

            'http://localhost:5000/allBookings'

        );

        const bookings = await response.json();

        const table =
        document.getElementById('bookingData');

        table.innerHTML='';

        bookings.forEach((booking)=>{

            let statusColor = '';

            if(booking.status === 'Approved'){

                statusColor = 'green';

            }

            else if(booking.status === 'Rejected'){

                statusColor = 'red';

            }

            else{

                statusColor = 'orange';

            }

            table.innerHTML += `

            <tr class="booking-row">

                <td>${booking.name}</td>

                <td>${booking.email}</td>

                <td>${booking.service}</td>

                <td>${booking.date}</td>

                <td>${booking.time}</td>

                <td>

                    <span style="color:${statusColor};
                    font-weight:bold;">

                        ${booking.status}

                    </span>

                </td>

                <td>

                    <button

                    class="approve-btn"

                    onclick="updateStatus(
                    '${booking._id}',
                    'Approved'
                    )">

                        Approve

                    </button>

                    <button

                    class="reject-btn"

                    onclick="updateStatus(
                    '${booking._id}',
                    'Rejected'
                    )">

                        Reject

                    </button>

                    <button

                    class="delete-btn"

                    onclick="deleteBooking(
                    '${booking._id}'
                    )">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

        document.getElementById(
            'totalBookings'
        ).innerText = bookings.length;

        document.getElementById(
            'totalCustomers'
        ).innerText = bookings.length;

    }

    catch(error){

        console.log(error);

    }

}

/* UPDATE STATUS */

async function updateStatus(id,status){

    try{

        await fetch(

            `http://localhost:5000/updateStatus/${id}`,

            {

                method:'PUT',

                headers:{
                    'Content-Type':'application/json'
                },

                body:JSON.stringify({

                    status:status

                })

            }

        );

        alert('Status Updated');

        getBookings();

    }

    catch(error){

        console.log(error);

    }

}

/* DELETE BOOKING */

async function deleteBooking(id){

    try{

        await fetch(

            `http://localhost:5000/deleteBooking/${id}`,

            {

                method:'DELETE'

            }

        );

        alert('Booking Deleted');

        getBookings();

    }

    catch(error){

        console.log(error);

    }

}

/* LOAD BOOKINGS */

getBookings();
/* SEARCH BOOKINGS */

function searchBookings(){

    const input = document
    .getElementById('searchInput')
    .value.toLowerCase();

    const rows = document
    .querySelectorAll('#bookingData tr');

    rows.forEach((row)=>{

        const rowText =
        row.innerText.toLowerCase();

        if(rowText.includes(input)){

            row.style.display='table-row';

        }

        else{

            row.style.display='none';

        }

    });

}