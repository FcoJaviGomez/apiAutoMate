const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({

//     host: "smtp.gmail.com",
//     // port: 465,
//     // secure: true,
//     auth: {
//         user:"codenothcers@gmail.com",
//         pass: "ntlasozosxzbtqyb"
//     }

// })



// function recovery(){

// transporter.sendMail({
//     from: 
//     to: `"${req.body.email}"`, 
//     subject: "Hello ✔", 
//     text: `"Parece que has perdido la contraseña, no te preocupes, de momento utiliza esta ${rString} para poder loggearte, pero recuerda cambiarla cuando accedas a AutoMate"<br>`
//     `Que tengas un buen día`, 
//     // html: "<b>Hello world?</b>", // html body
//   });

// //   main().catch(console.error)
// }


// function recovery (email, newPassword, callback) {
   
//    transporter.sendMail({
//       from   : '"AutoMate password recovery" <codenotchers@gmail.com>',
//       to     : `"${req.body.email}"`,
//       subject: 'Cambio de contraseña',
//       text  : `"Parece que has perdido la contraseña, no te preocupes, de momento utiliza esta ${rString} para poder loggearte, pero recuerda cambiarla cuando accedas a AutoMate"<br>`
//     }, callback);
//   }

// module.exports = {recovery}