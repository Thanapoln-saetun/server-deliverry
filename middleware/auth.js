const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = (req, res, next) => {//ตรวจสอบว่ามี token หรือไม่ ถ้ามีให้ next ไปทำ controller ต่อ
  try {
    const token = req.headers["authtoken"];//รับ token จาก header ที่ส่งมาจาก client 

    if (!token) {
      return res.status(401).send("no token , authorization denied");//ถ้าไม่มี token ให้ส่ง error กลับไป
    }
    const decoded = jwt.verify(token, "jwtSecret");//ถอดรหัส token ด้วย jwtSecret

    console.log("middleware", decoded);
    req.user  = decoded.user
    next()//ไปทำ controller ต่อ

  } catch (err) {
    console.log(err);
    res.status(401).send("Token Invavid!!");
  }
};

exports.adminCheck = async(req, res, next) => {//ตรวจสอบว่าเป็น admin หรือไม่
  try {
    const { username } = req.user//รับ username จาก middleware auth
    const adminUser = await User.findOne({ username }).exec()//ค้นหา username ที่มีอยู่ในฐานข้อมูล

    if(adminUser.role !== 'admin'){//ถ้าไม่ใช่ admin ให้ส่ง error กลับไป
      res.status(403).send(err,'Admin Access denied')//403 คือ ไม่มีสิทธิ์
    } else{
      next()
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Admin Access denied");
  }
};
