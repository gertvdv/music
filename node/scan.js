const path = require("path");
const fs = require("fs");
const store = require("./store");
const { log } = require("./log");

let total_scanned = 0;
let start_time = 0;
let total_files_found = 0;

module.exports.scan = function(path = []) {
    return new Promise((resolve, reject) => {
        let files = [];
        let config = {};
        let num_done = 0;
        total_scanned = 0;
        start_time = new Date();

        if (path.length > 0) {
            config.folders = path;
        }

        for (let i = 0; i < config.folders.length; i++) {
            log(`Scanning: ${config.folders[i]}`, 2);
            walk(config.folders[i], function(err, results) {
                log(results, 4);

                if (err) throw err;
                files = files.concat(results);
                num_done++;

                if (num_done == config.folders.length) {
                    resolve(files);
                }
            });
        }
    });
};

function walk(dir, done) {
    let results = [];
    let exts = [".mp3", ".jpg", ".pdf", ".png"];

    if (!fs.existsSync(dir)) {
        console.log(`Unable to read: ${dir}`);
        return done(null, []);
    }

    fs.readdir(dir, function(err, list) {
        if (err) return done(err, []);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    if (file.match(/recycle|node_modules|\.git$/i)) {
                        console.log(`Skipping ${file}`);
                        next();
                    } else {
                        walk(file, function(err, res) {
                            results = results.concat(res);
                            next();
                        });
                    }
                } else {
                    total_scanned++;
                    let hrend = new Date() - start_time;
                    store.set(
                        "scan_message",
                        `Currently found ${total_files_found} files with ${total_scanned} items scanned in ${hrend /
                            1000} (${total_scanned /
                            (hrend / 1000)} files per second`
                    );
                    if (exts.includes(path.extname(file).toLowerCase())) {
                        results.push(file);
                        let current_files = store.get("files") || [];
                        current_files.push(file);
                        store.set("files", current_files);
                        total_files_found++;
                    }
                    next();
                }
            });
        })();
    });
}
