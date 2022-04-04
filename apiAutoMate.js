let express = require("express");
let app = express();
let cors = require('cors')
let mysql = require("mysql2");

let connection = mysql.createConnection(
    {
        host         : "localhost",
        user         : "root",
        password     : "",
        database     : ""
    });

connection.connect(function(error){
    if(error){
       console.log(error);
    }else{
       console.log('Conexion correcta.');
    }
 });

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.listen(3000);