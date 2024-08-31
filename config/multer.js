import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName =
      file.fieldname + "-" + uniqueSuffix + "-" + file.originalname;

    cb(null, fileName.replace(/\\/g, "/"));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export default multer({ storage: storage, fileFilter: fileFilter });
