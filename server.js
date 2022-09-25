const express = require('express');// ใช้งาน module express
const cors = require('cors');// ใช้ในการเข้าถึง API จากเว็บอื่นๆ
const bodyParser = require('body-parser');// ใช้ในการรับค่าจากฝั่ง client
const morgan = require('morgan');// middleware สำหรับเก็บ log 
require('dotenv').config();// ใช้ในการเข้าถึงค่าตัวแปรจาก .env
const { readdirSync } = require('fs');// ใช้ในการอ่านไฟล์ folder routes อัตโนมัติ
const connectDB = require('./config/db');// เชื่อมต่อกับฐานข้อมูล

const app = express();// สร้างตัวแปร app เพื่อเก็บค่า express

// connectDB
connectDB();

//middleware
app.use(morgan('dev'));// ใช้ในการเก็บ log ของการทำงาน
app.use(bodyParser.json({limit:'20mb'}));//ใช้ในการรับค่าจากฝั่ง client 20mb คือขนาดของข้อมูลที่สามารถรับได้
app.use(cors())// ใช้ในการเข้าถึง API จากเว็บอื่นๆ

// Route
// http://localhost:3000/api/
// #1
// app.use('/api', require('./routes/api'));// ใช้ในการเรียกใช้งาน route ที่อยู่ในไฟล์ api.js

// #2
readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)));// ใช้ในการอ่านไฟล์ folder routes อัตโนมัติ




const port = process.env.PORT // ใช้ในการเรียกใช้งาน port จาก .env
app.listen(port, () => {
    console.log("Server is running on port"+port);
});// ทำการเริ่มต้น server และแสดง log ของการทำงาน

