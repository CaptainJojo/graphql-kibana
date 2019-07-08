const fs = require("fs");
const path = require("path");

/**
 * Search for a file recursively
 *
 * @param {String} dir
 * @param {String} pattern
 */
const searchRecursive = (dir, pattern) => {
  let results = [];

  fs.readdirSync(dir).forEach(dirInner => {
    dirInner = path.resolve(dir, dirInner);

    let stat = fs.statSync(dirInner);

    if (stat.isDirectory()) {
      results = results.concat(searchRecursive(dirInner, pattern));
    }

    if (stat.isFile() && dirInner.match(pattern)) {
      results.push(dirInner);
    }
  });

  return results;
};

module.exports.searchRecursive = searchRecursive;
