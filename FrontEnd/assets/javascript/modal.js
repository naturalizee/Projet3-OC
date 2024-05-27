// Création de l'overlay pour la modale
const overlay = document.createElement("div");
overlay.className = "modal-overlay";
document.body.appendChild(overlay);

// Fonction pour ouvrir la modale
const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(".js-open-modal");
    if (!target) {
        console.error("Modale inexistante");
        return;
    }
    // Affichage de la modale et de l'overlay
    overlay.style.display = "block";
    target.style.display = "block";
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", "true");
    modal = target;
    overlay.addEventListener("click", closeModal);
    modal.querySelector(".js-close-modal").addEventListener("click", closeModal);
};

// Fonction pour fermer la modale
const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    overlay.style.display = "none";
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    overlay.removeEventListener("click", closeModal);
    modal.querySelector(".js-close-modal").removeEventListener("click", closeModal);
    modal = null;
};

// Fonction pour arrêter la propagation de l'événement
const stopPropagation = function (e) {
    e.stopPropagation();
};

// Ajout des écouteurs d'événements pour ouvrir la modale
document.querySelectorAll(".js-open-modal-trigger").forEach(a => {
    a.addEventListener("click", openModal);
});

// Ajout de l'écouteur d'événement pour fermer la modale avec la touche echap
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
});

// Fonction pour récupérer les travaux depuis l'API
async function fetchTravaux() {
    const reponseTravaux = await fetch("http://localhost:5678/api/works");
    const travaux = await reponseTravaux.json();
    return travaux;
}

// Fonction pour afficher les travaux dans la modale
async function afficherTravaux() {
    try {
        const travaux = await fetchTravaux();

        const ajoutPhotoContainer = document.querySelector('.ajoutPhotoContainer');
        if (!ajoutPhotoContainer) {
            console.error("L'élément avec la classe 'ajoutPhotoContainer' n'existe pas.");
            return;
        }

        travaux.forEach(travail => {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('imageContainer');

            const imgContainer = document.createElement('div');
            imgContainer.classList.add('imgContainer');

            const img = document.createElement('img');
            img.src = travail.imageUrl;
            img.alt = travail.title;

            const poubelleIcon = document.createElement('i');
            poubelleIcon.classList.add('fa-solid', 'fa-trash-can', 'poubelleIcon');
            poubelleIcon.setAttribute('data-id', travail.id);

            imgContainer.appendChild(img);
            imgContainer.appendChild(poubelleIcon);

            imageContainer.appendChild(imgContainer);
            ajoutPhotoContainer.appendChild(imageContainer);
        });

    } catch (error) {
        console.error("Une erreur est survenue lors de l'affichage des travaux :", error);
    }
}

// Appel de la fonction pour afficher les travaux
afficherTravaux();
