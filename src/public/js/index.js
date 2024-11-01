// Seleccionar elementos del DOM
const openCard1Button = document.querySelector('.open-card1');
const openCard2Button = document.querySelector('.open-card2');
const closeBtn1 = document.getElementById('close-btn1');
const closeBtn2 = document.getElementById('close-btn2');
const popup1 = document.getElementById('popup1');
const popup2 = document.getElementById('popup2');

// Funciones para mostrar y ocultar popups
function showPopup(popup) {
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Previene el scroll del body
}

function hidePopup(popup) {
    popup.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaura el scroll del body
}

// Event Listeners para los botones de información
openCard1Button.addEventListener('click', () => showPopup(popup1));
closeBtn1.addEventListener('click', () => hidePopup(popup1));

// Event Listeners para los botones de contacto
openCard2Button.addEventListener('click', () => showPopup(popup2));
closeBtn2.addEventListener('click', () => hidePopup(popup2));

// Cerrar popups al hacer click fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === popup1) {
        hidePopup(popup1);
    }
    if (e.target === popup2) {
        hidePopup(popup2);
    }
});

// Escuchar eventos de teclado para cerrar con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hidePopup(popup1);
        hidePopup(popup2);
    }
});

// Animación suave para el scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Animación del header al hacer scroll
let prevScrollPos = window.pageYOffset;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScrollPos = window.pageYOffset;
    
    if (prevScrollPos > currentScrollPos) {
        header.style.top = '0';
        header.style.backgroundColor = currentScrollPos > 50 ? '#1f242d' : 'transparent';
    } else {
        header.style.top = '-100px';
    }
    
    prevScrollPos = currentScrollPos;
});