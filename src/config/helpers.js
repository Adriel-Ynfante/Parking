// Función para validar un correo electrónico
const isEmailValid = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Función para formatear fechas
const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

// Otras funciones útiles...

module.exports = { isEmailValid, formatDate };
