const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {//อัพโหลดรูป
      public_id: Date.now(),
      resource_type: "auto",
    });
    res.send(result);//ส่งข้อมูลกลับไป
  } catch (err) {
    console.log(err);
    res.status(500).send("Upload Error!!!");
  }
};

exports.removeImage = async (req, res) => {//ลบรูป
  try {
    let image_id = req.body.public_id;
    cloudinary.uploader.destroy(image_id, (result) => {
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Remove Error!!!");
  }
};
