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

        let id = parseInt(Math.random() * 10);

        console.log(id)

        let sql;
        sql = 'SELECT text FROM tips WHERE id_tips = ' + id;

        connection.query(sql, (err, result) => {

            if (err) {
                console.log(err)
            }
            else {

                console.log(result)
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

    console.log("aquiaaaaaaaaaaaaaaa", request.body)
    let { id_user, name, type, subtype, subsubtype, description, cost } = request.body;
    type = (type.toLowerCase()).replace(/\s+/g, '');
    console.log("type", type)
    subtype = (subtype.toLowerCase()).replace(/\s+/g, '');
    subsubtype = (subsubtype.toLowerCase()).replace(/\s+/g, '');
    let typeString = (type.toLowerCase() + subtype.toLowerCase() + subsubtype.toLowerCase()).replace(/\s+/g, '');

    let today = new Date();
    let end_date;
    let data;
    let data_type;
    let kilometers_car;
    let year_car;
    console.log(today);

    let params = [typeString]
    let sql = 'SELECT * FROM autoMate.maintenance_data WHERE type=?'

    connection.query(sql, params, function (err, result) {
        if (err)
            console.log(err);
        else {
            console.log(result)
            data = result[0].data
            data_type = result[0].data_type
            console.log("data_type", data_type);

            if (result.length !== 0) {
                if (data_type === "Dias") {
                    end_date = calculoEndDayDays(today, data)
                    console.log("dias listo", end_date)

                    let params3 = [id_user, name, type, subtype, subsubtype, description, cost, today, end_date]
                    let sql3 = 'INSERT INTO maintenance (id_user, name, type, subtype, subsubtype, description, cost, start_date, end_date) VALUES (?,?,?,?,?,?,?,?,?)'
                    console.log(params3)

                    connection.query(sql3, params3, function (err, result) {
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

                else if (data_type === null) {
                    console.log("holaaa", request.body);
                    end_date = request.body.end_date
                    console.log(end_date);
                    let params7 = [id_user, name, type, subtype, subsubtype, description, cost, today, end_date]
                    let sql7 = 'INSERT INTO maintenance (id_user, name, type, subtype, subsubtype, description, cost, start_date, end_date) VALUES (?,?,?,?,?,?,?,?,?)'
                    console.log(params7)

                    connection.query(sql7, params7, function (err, result) {
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

                else {
                    let params2 = [id_user]
                    let sql2 = 'SELECT kilometers_car, year_car FROM autoMate.user WHERE id_user=?'

                    connection.query(sql2, params2, function (err, result) {

                        if (err)
                            console.log(err);
                        else {
                            kilometers_car = result[0].kilometers_car
                            year_car = result[0].year_car
                            if (data_type === "Km") {
                                end_date = calculoEndDayKm(today, kilometers_car, data)
                            }

                            else {
                                end_date = calculoEndDayITV(today, year_car)
                            }

                            console.log(end_date)
                            console.log(today)
                            let params4 = [id_user, name, type, subtype, subsubtype, description, cost, today, end_date]
                            let sql4 = 'INSERT INTO maintenance (id_user, name, type, subtype, subsubtype, description, cost, start_date, end_date) VALUES (?,?,?,?,?,?,?,?,?)'
                            console.log(params4)

                            connection.query(sql4, params4, function (err, result) {
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
                    })
                }
                console.log("hemos calculado fecha final")
            }
        }
    })
}
);


function calculoEndDayKm(today, kilometersWeek, kilometersManteinance) {
    let endDay = new Date(today.toDateString())
    let kilometersDay = Math.round(kilometersWeek / 7)
    let dayNum = Math.round(kilometersManteinance / kilometersDay)

    endDay.setDate(today.getDate() + dayNum)
    return endDay

}

function calculoEndDayDays(today, dayNum) {
    let endDay = new Date(today.toDateString())
    endDay.setDate(today.getDate() + dayNum)
    return endDay
}

function calculoEndDayITV(today, year_car) {
    let endDay = new Date(today.toDateString())

    if (today.getFullYear() >= year_car && year_car > today.getFullYear() - 4) {
        endDay.setDate(today.getDate() + 1460)
    }
    else if (today.getFullYear() >= year_car && year_car < today.getFullYear() - 4 && year_car > today.getFullYear() - 10) {
        endDay.setDate(today.getDate() + 730)
    }
    else {
        endDay.setDate(today.getDate() + 365)
    }

    return endDay
}

app.listen(puerto);