// Cargar datos del JSON y construir el carrusel
async function loadPrograms() {
    try {
        const response = await fetch('datos.json'); // Ruta al archivo JSON
        const programs = await response.json();   // Convertir a JSON
        createCarousel(programs);                 // Llamar a la función de creación del carrusel
    } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
    }
}

// Crear el carrusel dinámicamente
function createCarousel(programs) {
    const carousel = document.getElementById("carousel");

    programs.forEach(program => {
        const item = document.createElement("div");
        item.className = "carousel-item";
        item.innerHTML = `
            <img src="${program.img}" alt="${program.name}">
            <h3>${program.name}</h3>
            <p>${program.description}</p>
        `;
        item.addEventListener("click", () => showFooter(program));
        carousel.appendChild(item);
    });

    startCarouselAnimation(); // Iniciar movimiento automático del carrusel
}

// Movimiento automático del carrusel
let currentIndex = 0;
function startCarouselAnimation() {
    const carousel = document.getElementById("carousel");
    const items = document.querySelectorAll(".carousel-item");

    setInterval(() => {
        if (items.length === 0) return;
        const totalItems = items.length;
        const itemWidth = items[0].offsetWidth + 20; // Incluye espacio entre elementos
        const newTransform = -(currentIndex * itemWidth);

        carousel.style.transform = `translateX(${newTransform}px)`;
        currentIndex = (currentIndex + 1) % totalItems;
    }, 3000);
}

// Mostrar el footer dinámico
function showFooter(program) {
    const footer = document.getElementById("podcast-footer");
    const title = document.getElementById("program-title");
    const description = document.getElementById("program-description");
    const seasonList = document.getElementById("season-list");
    const audioPlayer = document.getElementById("audio-player");

    title.textContent = program.name;
    description.textContent = program.description;
    seasonList.innerHTML = ""; // Limpiar temporadas

    program.seasons.forEach(season => {
        const seasonDiv = document.createElement("div");
        seasonDiv.className = "season";
        const seasonTitle = document.createElement("h4");
        seasonTitle.textContent = `Temporada ${season.number}`;
        seasonDiv.appendChild(seasonTitle);

        season.episodes.forEach(episode => {
            const episodeDiv = document.createElement("div");
            episodeDiv.className = "episode";

            episodeDiv.innerHTML = `
                <img src="${episode.img}" alt="${episode.title}" class="episode-img">
                <div class="episode-info">
                    <h5>${episode.title}</h5>
                    <p>${episode.capitulo}</p>
                </div>
            `;
            episodeDiv.addEventListener("click", () => {
                audioPlayer.src = episode.audio; // Cambiar la fuente del reproductor
                audioPlayer.load(); // Cargar el audio
                audioPlayer.play(); // Reproducir automáticamente
            });

            seasonDiv.appendChild(episodeDiv);
        });

        seasonList.appendChild(seasonDiv);
    });

    footer.style.display = "flex";
}
// Cerrar el reproductor
document.getElementById("close-player").addEventListener("click", () => {
    document.getElementById("podcast-footer").style.display = "none";
});

// Iniciar la carga de programas
loadPrograms();
