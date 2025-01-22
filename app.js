const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
    const filePath = req.url === "/" ? "./index.html" : `.${req.url}`;
    const extname = path.extname(filePath);

    const contentType = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpg",
    }[extname] || "application/octet-stream";

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === "ENOENT") {
                fs.readFile("./404.html", (err, notFoundContent) => {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end(notFoundContent || "404 Not Found", "utf-8");
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
