const fs = require('fs');
const path = require('path');
const MAX_FILES = 3;

module.exports = {
  name: 'cleanup',
  once: true,
  execute() {
    console.log('Cleanup event started');
    setInterval(() => {
      const outputDir = path.join(__dirname, '..', 'downloads');
      if (!fs.existsSync(outputDir)) {
        return;
      }
      const files = fs.readdirSync(outputDir).filter((file) => file.endsWith('.mp3'));
      if (files.length > MAX_FILES) {
        const oldestFiles = files.sort((a, b) => {
          const aStat = fs.statSync(path.join(outputDir, a));
          const bStat = fs.statSync(path.join(outputDir, b));
          return aStat.birthtimeMs - bStat.birthtimeMs;
        }).slice(0, files.length - MAX_FILES);
        oldestFiles.forEach((file) => {
          fs.unlinkSync(path.join(outputDir, file));
        });
        console.log(`Deleted ${oldestFiles.length} old file(s) from ${outputDir}`);
      }
    }, 60 * 60 * 1000); // Check every hour
  },
};