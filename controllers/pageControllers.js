const nodemailer = require("nodemailer");
const Course = require("../models/Course");
const User = require("../models/User");
exports.getAboutPage = (req, res) => {
  res.status(200).render("about", {
    page_name: "about",
  });
};
exports.getContactPage = (req, res) => {
  res.status(200).render("contact", {
    page_name: "contact",
  });
};
exports.sendEmail = async (req, res) => {
  try {
    //output kısmı mail gönderildiğinde içeriğinde ne yazmalı onun belirlendiği kısım
    const outputMessage = `
  <h1>Mail Details </h1>
  <ul>
  <li>Name: ${req.body.name}</li>
  <li>Email: ${req.body.email}</li>
  </ul>
  <h1>Message</h1>
  <p>${req.body.message} </p>
  `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "atkahmed9924@gmail.com", // gmail account
        pass: "wsatfpywxaaodvhl11", // gmail password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Smart Edu contact form" <atkahmed9924@gmail.com>', // sender address
      to: "atkaya03@gmail.com", //mailin geldiği mail adresi
      subject: "Smart Edu contact form", // Subject line
      html: outputMessage, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    req.flash("success", "We received your message successfully");

    res.status(200).redirect("contact");
  } catch (err) {
    req.flash("error", `Something went wrong!`);
    res.status(200).redirect("contact");
  }
};

exports.getIndexPage = async (req, res) => {
  const courses = await Course.find().sort("-createdAt").limit(2); // 2 tane kurs gösterir home sayfasında
  const totalCourses = await Course.find().countDocuments(); // kurs sayısını gösterir
  const totalStudents = await User.countDocuments({ role: "student" }); // rolü student olan sayıya ulaşır
  const totalTeacher = await User.countDocuments({ role: "teacher" }); // rolü teacher olan sayıya ulaşır
  res.status(200).render("index", {
    page_name: "index",
    courses,
    totalCourses,
    totalStudents,
    totalTeacher,
  });
};
exports.getRegisterPage = (req, res) => {
  res.status(200).render("register", {
    page_name: "register",
  });
};
exports.getLoginPage = (req, res) => {
  res.status(200).render("login", {
    page_name: "login",
  });
};
