const dotenv = require("dotenv").config();
const express = require("express");
const { scan } = require("./scan");
const store = require("./store");
const { log } = require("./log");
const argv = require("minimist")(process.argv.slice(2));
const app = express();
const port = 3000;

store.set("scan_status", "idle");
store.set("log_level", argv.v != null && Number.isInteger(argv.v) ? argv.v : 0);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);

scan([process.env.DATA_PATH]).then((res) => {
    store.set("files", res);
    store.set("scan_status", "complete");
    log(`${store.get("files").length} files loaded`);
    log(store.get("files"));
});
