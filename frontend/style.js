alert('JavaScript Connected');

/* MOBILE MENU */

function toggleMenu(){

    document.getElementById('navMenu')
    .classList.toggle('active');

}

/* LOGIN POPUP */

function openLogin(){

    document.getElementById('loginPopup')
    .style.display='block';

}

function closeLogin(){

    document.getElementById('loginPopup')
    .style.display='none';

}

/* SERVICES DATA */

const styles = {

    haircut:[

        {
            name:'Fade Cut',

            img:'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1200&auto=format&fit=crop'
        },

        {
            name:'Textured Cut',

            img:'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1200&auto=format&fit=crop'
        }

    ],

    beard:[

        {
            name:'Sharp Beard',

            img:'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=1200&auto=format&fit=crop'
        }

    ],

    facial:[

        {
            name:'Gold Facial',

            img:'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop'
        }

    ],

    color:[

        {
            name:'Brown Hair Color',

            img:'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1200&auto=format&fit=crop'
        }

    ]

};

/* SHOW STYLES */

function showStyles(category){

    const container =
    document.getElementById('styleContainer');

    container.innerHTML='';

    styles[category].forEach(style=>{

        container.innerHTML += `

        <div class="style-card">

            <img src="${style.img}">

            <h3>${style.name}</h3>

        </div>

        `;

    });

}
/* ALL TIME SLOTS */

const allSlots = [

    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM'

];
/* CHECK DATE AVAILABILITY */
/* CHECK DATE AVAILABILITY */

async function checkDateAvailability(){

    const date =
    document.getElementById('date').value;

    try{

        const response =
        await fetch(

        `http://localhost:5000/checkAvailability/${date}`

        );

        const data =
        await response.json();

        const status =
        document.getElementById(
            'dateStatus'
        );

        const timeSelect =
        document.getElementById('time');

        timeSelect.innerHTML =

        `<option value="">
        Select Time Slot
        </option>`;

        /* AVAILABLE DATE */

        if(data.available){

            status.innerHTML =

            `🟢 Available Slots:
            ${15 - data.bookedCount}
            remaining`;

            status.style.color='lime';

        }

        else{

            status.innerHTML =

            `🔴 Fully Booked`;

            status.style.color='red';

        }

        /* SHOW TIME SLOTS */

        allSlots.forEach((slot)=>{

            if(!data.bookedSlots.includes(slot)){

                timeSelect.innerHTML +=

                `

                <option value="${slot}">

                    ${slot}

                </option>

                `;

            }

        });

    }

    catch(error){

        console.log(error);

    }

}

/* DEFAULT STYLE */

showStyles('haircut');

/* BOOK APPOINTMENT */

async function bookAppointment(){

    alert('Button Working');

    const data = {

        name:
        document.getElementById('name').value,

        email:
        document.getElementById('email').value,

        service:
        document.getElementById('service').value,

        date:
        document.getElementById('date').value,

        time:
        document.getElementById('time').value,

        message:
        document.getElementById('message').value

    };

    console.log(data);

    try{

        /* CHECK AVAILABILITY */

        const availabilityResponse =
        await fetch(

        `http://localhost:5000/checkAvailability/${data.date}`

        );

        const availabilityData =
        await availabilityResponse.json();

        if(!availabilityData.available){

            alert(
            'This date is fully booked'
            );

            return;

        }

        /* SAVE BOOKING */

        const response = await fetch(

            'http://localhost:5000/book',

            {

                method:'POST',

                headers:{
                    'Content-Type':'application/json'
                },

                body:JSON.stringify(data)

            }

        );

        const result =
        await response.json();

        console.log(result);

        alert(result.message);

        /* RESET FORM */

        document.getElementById('name').value='';
        document.getElementById('email').value='';
        document.getElementById('service').value='Haircut';
        document.getElementById('date').value='';
        document.getElementById('time').value='';
        document.getElementById('message').value='';

        document.getElementById(
            'dateStatus'
        ).innerHTML='';

    }

    catch(error){

        console.log(error);

        alert('Backend Error');

    }

}