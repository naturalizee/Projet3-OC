let modal = null;

const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(".js-open-modal");
    if (!target) {
        console.error("Modal not found");
        return;
    }
    body.style.background = "rgba(0,0,0, 0.3)";
    target.style.display = "block";
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", "true");
    modal = target;
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-close-modal").addEventListener("click", closeModal);
};

const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    body.style.background = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-close-modal").removeEventListener("click", closeModal);
    modal = null;
};

const stopPropagation = function (e) {
    e.stopPropagation();
};

document.querySelectorAll(".js-open-modal-trigger").forEach(a => {
    a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
});
