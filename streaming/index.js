const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/video", function (req, res) {
    const range = req.headers.range;
    if (!range) {
        res.send(400).send('resuire range');
    }
    const path = "bigbuck.mp4";
    const size = fs.statSync('bigbuck.mp4').size;
    console.log(size);
    const chunk = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    //take min of the start+chunk or video to avoid going past the video 
    //array of bytes start counting from zero ,so if the video is 40 byte long , the last byte is  39 
    //the content length +1 becuqe the -1 in end 
    const end = Math.min(start + chunk, size - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(path, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);

});

app.listen(8000, function () {
    console.log("Listening on port 8000!");
});