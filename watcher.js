// watcher.js
const chokidar = require("chokidar");
const { exec } = require("child_process");
const path = require("path");

const colorsPath = path.resolve(__dirname, "custom-colors.json");
const debounceTime = 300;

let timer;

const runScripts = () => {
  console.log("\n[Watcher] Detected change in custom-colors.json. Running updates...\n");

  exec("node updatePalette.js", (err, stdout, stderr) => {
    if (err) {
      console.error("[updatePalette.js Error]", err);
      return;
      ㅈㅁ
    }
    console.log("[updatePalette.js Output]\n", stdout);

    exec("node updateSafelist.js", (err2, stdout2, stderr2) => {
      if (err2) {
        console.error("[updateSafelist.js Error]", err2);
        return;
      }
      console.log("[updateSafelist.js Output]\n", stdout2);
    });
  });
};

const watcher = chokidar.watch(colorsPath, {
  persistent: true,
  ignoreInitial: true
});

watcher.on("change", () => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(runScripts, debounceTime);
});

console.log("[Watcher] Watching custom-colors.json for changes...");
