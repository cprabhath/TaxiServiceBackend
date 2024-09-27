// -------------------- firebase storage --------------------
const bucket = require('../utils/firebase');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
// ---------------------------------------------------------

// ------------------------ Upload image ------------------------
const uploadImage = async (filePath, userId, imageType , fileType = 'jpg') => {
    try {
        // Generate a unique filename, e.g., admin-uuid.jpg or user-uuid.png
        const uniqueId = uuidv4();
        const fileName = `${imageType}-${userId}-${uniqueId}.${fileType}`;

        // Determine the correct content type based on file extension
        const contentType = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
        };

        // Validate the file type
        if (!contentType[fileType]) {
            throw new Error('Unsupported file type');
        }

        // Upload the image to Firebase Storage
        await bucket.upload(filePath, {
            destination: `uploads/${fileName}`, // Save to uploads folder with unique name
            metadata: {
                contentType: contentType[fileType], // Set the content type
            },
        });

        // Get a signed URL for the uploaded image
        const file = bucket.file(`uploads/${fileName}`);
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-01-2500',
        });

        console.log('File uploaded successfully. Accessible at:', url);
        return url;
    } catch (err) {
        console.error('Error uploading file:', err.message);
        throw err;
    }
};
// --------------------------------------------------------------

// -------------------------- get image URL -----------------------
const getImageUrl = async (fileName) => {
    try {
        const file = bucket.file(fileName);
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-01-2500',
        });

        console.log('File is accessible at:', url);
        return url;
    } catch (err) {
        console.error('Error getting file URL:', err.message);
        throw err;
    }
};
// ----------------------------------------------------------------


module.exports = {
    uploadImage,
    getImageUrl
}