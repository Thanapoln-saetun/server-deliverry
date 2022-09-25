const Category = require("../models/Category");

exports.list = async (req, res) => {//ดึงข้อมูลทั้งหมด
  try {
    const category = await Category.find({}).exec();
    res.send(category);//ส่งข้อมูลกลับไป
  } catch (err) {
    res.status(500).send("Server Error!!");
  }
};
exports.create = async (req, res) => {//สร้างข้อมูล
  try {
    console.log(req.body)
    const { name } = req.body;
    const category = await new Category({ name }).save();//สร้างข้อมูลใหม่
    res.send(category);//ส่งข้อมูลกลับไป
  } catch (err) {
    res.status(500).send("Server Error!!");
  }
};
exports.read = async (req, res) => {//ดึงข้อมูลตาม id
  try {
    const id = req.params.id;
    const category = await Category.findOne({ _id: id });
    res.send(category);
  } catch (err) {
    res.status(500).send("Server Error!!");
  }
};
exports.update = async (req, res) => {//แก้ไขข้อมูลตาม id
  try {
    const id = req.params.id;//รับ id 
    const { name } = req.body;

    const category = await Category.findOneAndUpdate(//ค้นหาข้อมูลตาม id แล้วแก้ไข
      { _id: id },//ค้นหาตาม id
      { name: name }// แก้ไขข้อมูล
    );
    res.send(category);
  } catch (err) {
    res.status(500).send("Server Error!!");
  }
};
exports.remove = async (req, res) => {//ลบข้อมูลตาม id
  try {
    const id = req.params.id;//รับ id
    const category = await Category.findOneAndDelete({ _id: id });//ค้นหาข้อมูลตาม id แล้วลบ
    res.send(category);
  } catch (err) {
    res.status(500).send("Server Error!!");
  }
};
