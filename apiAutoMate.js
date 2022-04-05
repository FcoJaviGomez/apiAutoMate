let express = require("express");
let app = express();
let cors = require('cors')
let mysql = require("mysql2");
let puerto = process.env.PORT || 3000;

let connection = mysql.createConnection(
    {
        host         : "automate.cuu638eryjoo.us-east-1.rds.amazonaws.com",
        user         : "admin",
        password     : "TomasTurbo",
        database     : "autoMate"
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

// app.get("/prueba", 
//         function(request, response) { 
//             let sql;
//             sql = "SELECT * FROM user";
    
//             connection.query(sql, function (err, result)
//             {
//                 if (err) {
//                     console.log(err);
//                 }
//                 else {
//                     response.send(result);
//                 }
//             })
//         }
//         );



app.listen(puerto);