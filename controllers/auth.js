const bcrypt = require("bcryptjs");//เข้ารหัส
const User = require("../models/User");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  try {
    // Check user ว่ามีในฐานข้อมูลหรือไม่
    const { username, password } = req.body;
    var user = await User.findOne({ username });//ค้นหา username ที่มีอยู่ในฐานข้อมูล
    if (user) {
      return res.status(400).send("User Already exists");//ถ้ามีผู้ใช้นี้แล้ว จบ!!
    }
    const salt = await bcrypt.genSalt(10);//เกลือ ทำให้ข้อความมั่ว
    user = new User({
      username,
      password,
    });
    // Encrypt Password 
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.send("Register Success");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    var user = await User.findOneAndUpdate({ username }, { new: true });
    if (user && user.enabled) {//ถ้ามีผู้ใช้นี้และเปิดใช้งานอยู่ (status : true)
      // Check Password
      const isMatch = await bcrypt.compare(password, user.password);//ถอดรหัสเปรียบเทียบรหัสผ่าน

      if (!isMatch) {
        return res.status(400).send("Password Invalid!!");//ถ้ารหัสผ่านไม่ถูกต้อง จบ!!
      }
      // ส่ง Payload ไปพร้อมกับ Token
      const payload = {
        user: {
          username: user.username,
          role: user.role,
        },
      };
      // Generate Token
      jwt.sign(payload, 
        "jwtSecret",//secret key
        { expiresIn: 3600 }, (err, token) => {// 1 hour
          if (err) throw err;
          res.json({ token, payload });//ส่ง token กับ payload กลับไป
      });
    } else {
      return res.status(400).send("User Not found!!!");//ถ้าไม่มีผู้ใช้นี้
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

exports.currentUser = async (req, res) => {//ดึงข้อมูลผู้ใช้งาน
  try {
    // model User
    // console.log("controller", req.user);
    const user = await User.findOne({ username: req.user.username })//ค้นหา username ที่มีอยู่ในฐานข้อมูล
      .select("-password")//ไม่แสดง password
      .exec();
    res.send(user);//ส่งข้อมูลผู้ใช้งานกลับไป
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

// exports.listUser = async (req, res) => {
//   try {
//     res.send("list Get User");
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Server Error!");
//   }
// };

// exports.editUser = async (req, res) => {
//   try {
//     res.send("edit User");
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Server Error!");
//   }
// };
// exports.deleteUser = async (req, res) => {
//   try {
//     res.send("remove User");
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Server Error!");
//   }
// };
