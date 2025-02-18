let datosGlobales = null;
let timeframes = null;
const cards = document.querySelector('.cards');
const weeklyButton = document.querySelector('.weekly');
const dailyButton = document.querySelector('.daily');
const monthlyButton = document.querySelector('.monthly');
let addCardsFlag = false;
const consulta = window.matchMedia("(min-width: 768px)");
const container = document.querySelector('.container');


fetch('data.json')
    .then(response => response.json())
    .then(data => {
        datosGlobales = data;
        console.log("Datos cargados:", data);
        weeklyButton.click()
    })
    .catch(error => console.error('Error al cargar el JSON:', error));

function addCards() {
    cards.innerHTML = ''; // Evita duplicados
    let contador = 1;
    addCardsFlag = true;
    datosGlobales.forEach(item => {
        let htmlContent = `
            <div class="card card${contador}">
              <div class="top-decoration ${item.title}"></div>
              <div class="info">
                <h2>${item.title}</h2>
                <div class="boton">
                  <button></button>
                </div>
                <p class="hours current${contador}"></p>
                <p class="record previous${contador}"></p>
              </div>
            </div>
        `;
        contador++; 
        cards.insertAdjacentHTML("beforeend", htmlContent);
    });
}

function changeTimes() {
    if (!datosGlobales) return;
    if (!addCardsFlag) {
        addCards();
        if(consulta.matches){
            container.style.gridTemplateColumns = 'auto auto';
        }
    }
    let contador = 1;
    let previousText = '';
    

    switch (timeframes) {
        case 'daily':
            previousText = 'Day';
            dailyButton.classList.add('buttonWhite');
            weeklyButton.classList.remove('buttonWhite');
            monthlyButton.classList.remove('buttonWhite');
            break;
        case 'weekly':
            previousText = 'Week';
            dailyButton.classList.remove('buttonWhite');
            weeklyButton.classList.add('buttonWhite');
            monthlyButton.classList.remove('buttonWhite');
            break;
        case 'monthly':
            previousText = 'Month';
            dailyButton.classList.remove('buttonWhite');
            weeklyButton.classList.remove('buttonWhite');
            monthlyButton.classList.add('buttonWhite');
            break;
    }

    for (const obj of datosGlobales) {
        let currentTimeElem = document.querySelector(`.current${contador}`);
        let previousTimeElem = document.querySelector(`.previous${contador}`);
        let currentTime = obj.timeframes[timeframes].current;
        let previousTime = obj.timeframes[timeframes].previous;
        let card = document.querySelector(`.card${contador}`)

        if (currentTimeElem && previousTimeElem) {
            currentTimeElem.textContent = `${currentTime}hrs`;
            previousTimeElem.textContent = `Last ${previousText} - ${previousTime}hrs`;
        }   
        card.classList.remove("active"); // Elimina la clase
        void card.offsetWidth; // **Hack para reiniciar la animación**
        card.classList.add("active"); // La vuelve a agregar
        contador++;
    }
}



dailyButton.addEventListener('click', () => {
    timeframes = 'daily';
    changeTimes();
});

weeklyButton.addEventListener('click', () => {
    timeframes = 'weekly';
    changeTimes();
});

monthlyButton.addEventListener('click', () => {
    timeframes = 'monthly';
    changeTimes();
});



