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

app.get("/prueba", 
        function(request, response) { 
            let sql;
            sql = "SELECT * FROM user";
    
            connection.query(sql, function (err, result)
            {
                if (err) {
                    console.log(err);
                }
                else {
                    response.send(result);
                }
            })
        }
        );


app.post("/registro", 
        function(request, response)
        {
            console.log(request.body);

            let sql = `INSERT INTO user (name, last_name, email, password, kilometers_car, year_car, 
                       provisional_password, provisional_date) VALUES ("${request.body.name}", 
                       "${request.body.last_name}", "${request.body.email}", "${request.body.password}", 
                       ${request.body.kilometers_car}, ${request.body.year_car}, 
                       "${request.body.provisional_password}", "${request.body.provisional_date}")`
                        
            console.log(sql);                      
            connection.query(sql, function (err, result)
            {
                if (err) 
                    console.log(err);
                else 
                {
                    console.log(result);
                    if (result.insertId)
                        response.send(String(result.insertId));
                    else
                        response.send("-1");
                }
            })
        }
        );


app.post("/login", 
        function(request, response)
        { 
            console.log(request.body);

            let sql = `SELECT id_user, name, last_name, email, kilometers_car, year_car FROM user 
                      WHERE email= "${request.body.email}" AND password= "${request.body.password}"`

            console.log(sql)
    
            connection.query(sql, function (err, result)
            {
                if (err) {
                    console.log(err);
                }
                else {
                    response.send(result);
                }
            })
        }
        );


app.get("/usuario",
         function(request, response)
         {
             let sql;
             if (request.query.id == null)
               sql = "SELECT * FROM user ";
            else
                sql = "SELECT * FROM user WHERE id_user=" + request.query.id;

            connection.query(sql, function (err, result)
            {
                if (err)
                   console.log(err);
                else
                {
                    response.send(result);
                }
            })
         }
         );

      
app.put("/usuario",
        function(request, response)
        {
            console.log(request.body);
            let params = [request.body.name,
                          request.body.last_name,
                          request.body.email,
                          request.body.password,
                          request.body.kilometers_car,
                          request.body.year_car,
                          request.body.provisional_password,
                          request.body.provisional_date,
                          request.body.id_user]
            let sql = "UPDATE user SET name = COALESCE(?, name) , " +
                      "last_name = COALESCE(?, last_name) , " +
                      "email = COALESCE(?, email) , " +
                      "password = COALESCE(?, password) , " +
                      "kilometers_car = COALESCE(?, kilometers_car) , " +
                      "year_car = COALESCE(?, year_car) , " +
                      "provisional_password = COALESCE(?, provisional_password) , " +
                      "provisional_date = COALESCE(?, provisional_date) WHERE id_user = ?";
            console.log(sql);
            connection.query(sql, params, function (err, result)
            {
                if (err)
                   console.log(err);
                else
                {
                    response.send(result);
                }
            })
        }
);


app.listen(puerto);