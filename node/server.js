const dotenv = require("dotenv").config();
const filehelper = require("./file-helper.js");
const express = require("express");
const { File } = require("./sequelize");
const { scan } = require("./scan");
const store = require("./store");
const { log } = require("./log");
const argv = require("minimist")(process.argv.slice(2));
const url = require("url");
const fs = require("fs");
const app = express();
const port = 3000;

store.set("scan_status", "idle");
store.set("log_level", argv.v != null && Number.isInteger(argv.v) ? argv.v : 0);

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/file", function(req, res) {
    let options = url.parse(req.url, true);
    let mime = filehelper.getMime(options.query);
    serveFile(res, options.query.filepath, mime);
});

function serveFile(res, pathName, mime) {
    mime = mime || "text/html";

    fs.readFile(pathName, function(err, data) {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            return res.end("Error loading " + pathName + " with Error: " + err);
        }
        res.writeHead(200, { "Content-Type": mime });
        res.end(data);
    });
}

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);

if (argv.s) {
    scan([process.env.DATA_PATH]).then(res => {
        store.set("files", res);
        store.set("scan_status", "complete");
        log(`${store.get("files").length} files loaded`);
        let files = store.get("files");

        let counter = 1;
        files.forEach(async function(file) {
            const entry = await File.create({
                path: file.path,
                hash: file.hash
            });
            if (counter % 500 == 0) log(`{counter} files saved in database`, 0);
            if (counter == files.length) log("I think we are done");
            counter++;
        });
    });
}
