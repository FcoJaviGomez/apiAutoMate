const nodemailer = require("nodemailer");
let express = require("express");
let app = express();
let cors = require('cors')
let mysql = require("mysql2");
// const mailer = require('./mailer')
// const nodemailer= require("nodemailer")
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


const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",
    // port: 465,
    // secure: true,
    auth: {
        user: "codenotchers@gmail.com",
        pass: "ntlasozosxzbtqyb"
        // pass: "pichones"
    },
    tls: {
        rejectUnauthorized: false,
    }

})


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
                       provisional_password, provisional_date, first_log) VALUES ("${request.body.name}", 
                       "${request.body.last_name}", "${request.body.email}", "${request.body.password}", 
                       ${request.body.kilometers_car}, ${request.body.year_car}, 
                       "${request.body.provisional_password}", "${request.body.provisional_date}",${1})`

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
        let respuesta = true
        console.log(request.body);
        let params = [
            request.body.email,
            request.body.password
        ]
        let sql = `SELECT id_user, name, last_name, email, kilometers_car, year_car, first_log FROM user 
                      WHERE email= ? AND password= ?`

        console.log(sql)

        connection.query(sql, params, function (err, result) {
            if (err) {
                console.log(err);
                respuesta = false
                response.send(respuesta)
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


        for (let atributo in request.body) {

            if (request.body[atributo] === '') {
                request.body[atributo] === null
            }
        }

        console.log(request.body)

        let params = [request.body.name,
        request.body.last_name,
        request.body.email,
        request.body.password,
        request.body.kilometers_car,
        request.body.year_car,
        request.body.provisional_password,
        request.body.provisional_date,
            0,
        request.body.id_user
        ]

        console.log(request.body.provisional_password)

        let sql = "UPDATE user SET name = COALESCE(?, name) , " +
            "last_name = COALESCE(?, last_name) , " +
            "email = COALESCE(?, email) , " +
            "password = COALESCE(?, password) , " +
            "kilometers_car = COALESCE(?, kilometers_car) , " +
            "year_car = COALESCE(?, year_car) , " +
            "provisional_password = COALESCE(?, provisional_password) , " +
            "provisional_date = COALESCE(?, provisional_date) , " +
            "first_log = COALESCE(?, first_log) WHERE id_user = ?";
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

app.put("/usuario/password",
    function (request, response) {


        let respuesta = true
        let sql = `SELECT * FROM user WHERE id_user=${request.body.id_user} AND password= ${request.body.contrasena}`;

        connection.query(sql, function (err, result) {
            if (err)
                console.log(err);
            else {
                if (result.length === 0) {
                    respuesta = false
                    response.send(respuesta)
                }
                else {
                    let sql = `UPDATE user SET password = ${request.body.contrasenaNueva} WHERE id_user=${request.body.id_user}`

                    connection.query(sql, function (err, result) {
                        if (err)
                            console.log(err);
                        else {
                            respuesta = true
                            response.send(respuesta)
                        }
                    })

                }
            }
        })
    }
);

app.get("/gastos",
    function (request, response) {

        let sql = `SELECT type, SUM(cost) AS cost FROM maintenance WHERE id_user=${request.query.id_user} 
                       GROUP BY type`

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
    let params = [id_user]
    sql = `SELECT * FROM maintenance WHERE id_user = ? AND date(now()) < end_date ORDER BY end_date ASC `
    connection.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("pepe", result);
            response.send(result)
        }
    })
})

app.get('/historial', (request, response) => {
    let sql;
    let id_user = request.query.id_user
    console.log(id_user);
    let params = [id_user]
    sql = `SELECT * FROM maintenance WHERE id_user = ? AND date(now()) > end_date ORDER BY end_date ASC `
    connection.query(sql, params, (err, result) => {
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
    let params = [id_user]
    sql = `SELECT * FROM maintenance WHERE id_user = ? AND date(now()) < end_date ORDER BY end_date ASC LIMIT 1`
    connection.query(sql, params, (err, result) => {
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
                    end_date = request.body.end_date + " 10:00:00"
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

app.put('/recuperacion',
    (req, response) => {

        console.log(req.body[0].email)

        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i)
                result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }
        let rString = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@?');

        // console.log(rString)


        //  transporter.sendMail({
        //     from   : '"AutoMate password recovery" <codenotchers@gmail.com>',
        //     to     : `"${req.body.email}"`,
        //     subject: 'Cambio de contraseña',
        //     text  : `"Parece que has perdido la contraseña, no te preocupes, de momento utiliza esta ${rString} para poder loggearte, pero recuerda cambiarla cuando accedas a AutoMate"<br>`
        //     })


        let mailOptions = {
            from: 'AutoMate password recovery<codenotchers@gmail.com>',
            to: `${req.body[0].email}`,
            subject: 'Cambio de contraseña',
            text: `Parece que has perdido la contraseña, no te preocupes, de momento utiliza esta ${rString} para poder loggearte, pero recuerda cambiarla cuando accedas a AutoMate`
        };
        console.log(req.body[0].email)
        console.log(mailOptions)
        transporter.sendMail(mailOptions, (error, res) => {
            if (!error) {
                console.log('Email enviado')
                salida = { error: false, code: 200, mensaje: res };
                response.send(salida)

            } else {
                console.log(error)
                salida = { error: true, code: 200, mensaje: error };
                response.send(salida);
            }
        })


        let sql = `UPDATE user SET provisional_password = "${rString}", password = "${rString}" WHERE email= "${req.body[0].email}"`

        console.log(sql)

        connection.query(sql, (err, result) => {

            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
                response.send(result);

            }
        })
    }
)


function calculoEndDayKm(today, kilometersWeek, kilometersManteinance) {
    let endDay = new Date(today.toDateString())
    let kilometersDay = Math.round(kilometersWeek / 7)
    let dayNum = Math.round(kilometersManteinance / kilometersDay)

    endDay.setDate(today.getDate() + dayNum)
    return endDay

}

function calculoEndDayDays(today, dayNum) {
    let endDay = new Date(today.getTime())
    endDay.setDate(today.getDate() + dayNum)
    return endDay
}

function calculoEndDayITV(today, year_car) {
    let endDay = new Date(today.getTime())

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

app.listen(puerto)
