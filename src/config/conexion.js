const mysql = require("mysql");

let conexion = mysql.createConnection({
    host: "localhost",
    database: "Parking",
    user: "root",
    password: ""
});

conexion.connect(function(error) {
    if (error) {
        console.log("Conexion Fallida");
        throw error;
    } else {
        console.log("Conexión exitosa");
    }
});


module.exports = conexion;
