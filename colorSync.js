// colorSync.js
const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "custom-colors.json");

const updateColorList = (newColor) => {
  let data = {};
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  if (!data[newColor]) {
    data[newColor] = true;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`[colorSync] '${newColor}' 추가됨 -> custom-colors.json`);
  }
};

const color = process.argv[2];
if (color) updateColorList(color);
