let express = require("express");
let app = express();
let cors = require('cors')
let mysql = require("mysql2");
const { request, response } = require("express");
let puerto = process.env.PORT || 3000;

let connection = mysql.createConnection(
    {
        host: "automate.cuu638eryjoo.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "TomasTurbo",
        database: "autoMate"
    });

connection.connect(function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log('Conexion correcta.');
    }
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/prueba",
    function (request, response) {
        let sql;
        sql = "SELECT * FROM user";

        connection.query(sql, function (err, result) {
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
    function (request, response) {
        console.log(request.body);

        let sql = `INSERT INTO user (name, last_name, email, password, kilometers_car, year_car, 
                       provisional_password, provisional_date) VALUES ("${request.body.name}", 
                       "${request.body.last_name}", "${request.body.email}", "${request.body.password}", 
                       ${request.body.kilometers_car}, ${request.body.year_car}, 
                       "${request.body.provisional_password}", "${request.body.provisional_date}")`

        console.log(sql);
        connection.query(sql, function (err, result) {
            if (err)
                console.log(err);
            else {
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
    function (request, response) {
        console.log(request.body);

        let sql = `SELECT id_user, name, last_name, email, kilometers_car, year_car FROM user 
                      WHERE email= "${request.body.email}" AND password= "${request.body.password}"`

        console.log(sql)

        connection.query(sql, function (err, result) {
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
    function (request, response) {
        let sql;
        if (request.query.id_user == null)
            sql = "SELECT * FROM user ";
        else
            sql = "SELECT * FROM user WHERE id_user=" + request.query.id_user;

        connection.query(sql, function (err, result) {
            if (err)
                console.log(err);
            else {
                response.send(result);
            }
        })
    }
);


app.put("/usuario",
    function (request, response) {
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
        connection.query(sql, params, function (err, result) {
            if (err)
                console.log(err);
            else {
                response.send(result);
            }
        })
    }
);


app.get("/gastos",
    function (request, response) {
        let sql;
        if (request.query.id_user != null && request.query.type != null)
            sql = `SELECT type, SUM(cost) FROM maintenance WHERE id_user =${request.query.id_user} 
                       AND type = "${request.query.type}"`;
        else
            sql = `SELECT SUM(cost) FROM maintenance WHERE id_user = ${request.query.id_user}`;

        console.log(sql)

        connection.query(sql, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                response.send(result);
            }
        })
    }
);



app.get('/home-logged',
    function (req, res) {

        let id = req.query.id_tips
        let sql;
        sql = 'SELECT text FROM tips WHERE id_tips = ' + id;

        connection.query(sql, (err, result) => {

            if (err) {
                console.log(err)
            }
            else {
                res.send(result)
            }
        })
    })


app.get('/mantenimiento', (request, response) => {
    let sql;
    let id_user = request.query.id_user
    console.log(id_user);
    sql = `SELECT * FROM maintenance WHERE id_user = "${id_user}" ORDER BY end_date ASC `
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            response.send(result)
        }
    })
})

app.get('/mantenimientoHome', (request, response) => {
    let sql;
    let id_user = request.query.id_user
    console.log(id_user);
    sql = `SELECT * FROM maintenance WHERE id_user = "${id_user}" ORDER BY end_date ASC LIMIT 1`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            response.send(result)
        }
    })
})

app.delete('/mantenimiento', (request, response) => {
    console.log(request.body);
    let sql = `DELETE FROM maintenance WHERE id_maintenance = ${request.body.id_maintenance}`
    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err)
            console.log(err);
        else {
            response.send(result);
        }
    })
})

app.post("/mantenimiento", (request, response) => {
    console.log(request.body);

    let sql = `INSERT INTO maintenance (id_user, name, type, subtype, subsubtype, description, cost, 
                       stard_date, end_date) VALUES ("${request.body.id_user}", 
                       "${request.body.name}", "${request.body.type}", "${request.body.subtype}", 
                       ${request.body.subsubtype}, ${request.body.description}, 
                       "${request.body.cost}", "${request.body.stard_date}", "${request.body.end_date}")`

    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err)
            console.log(err);
        else {
            console.log(result);
            if (result.insertId)
                response.send(String(result.insertId));
            else
                response.send("-1");
        }
    })
}
);



app.listen(puerto);