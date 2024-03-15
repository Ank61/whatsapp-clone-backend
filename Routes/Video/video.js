const express = require('express');
const multer  = require('multer');
const fs = require("fs")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'routes/video/uploads/');
    },
    filename: function (req, file, cb) {
        // You can customize the filename if needed
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
//const upload = multer({ dest: 'uploads/' });
const app = express();

app.post('/upload', upload.single('video'), function(req, res) {
    const uploadedFile = req.file;
    console.log('Uploaded file:', uploadedFile);
    res.send('File uploaded!');
});

app.get("/stream/:fileName", function (req, res) {
    const range = req.headers.range || "byte=0-";
    console.log("Getting range", range);
    const fileName =  req.params?.fileName;
    console.log("filename", fileName)

    const videoPath = `./uploads/${fileName}`;
    if (!fs.existsSync(videoPath)) {
        return res.status(404).send("Video file not found");
    }
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    console.log("start", start)
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.on('error', (err) => {
        console.error('Error reading video file:', err);
        res.end();
    });
    videoStream.pipe(res);
});


module.exports = app