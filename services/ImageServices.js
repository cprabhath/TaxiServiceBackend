const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${uniqueId}${fileExtension}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Upload Image Function
const uploadImage = async (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Error uploading file:', err.message);
      return res.status(500).json({ message: 'File upload failed' });
    }

    const filePath = path.join(__dirname, '../uploads/', req.file.filename);
    res.status(200).json({ message: 'File uploaded successfully', filePath });
  });
};

module.exports = {
  uploadImage,
};
