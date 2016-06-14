
var fs = require('fs');
var path = require('path');

/**
 * Searches for a file starting in the current folder up to the root folder
 * @param {String} filename - file to search for
 */
function findUpSync(filename) {
    try {
        var absolutePath = path.resolve(filename);
        var result = fs.readFileSync(absolutePath);
        return absolutePath;
    } catch (ex) {
        var tryNext = false;

        switch (ex.code) {
        case 'ENOENT':
            tryNext = true;
            ex.message = 'ENOENT: could not read ' + absolutePath + ' and cannot search further';
            break;
        case 'EISDIR':
            tryNext = true;
            ex.message = 'EISDIR: ' + absolutePath + ' is a directory';
            break;
        }

        if (tryNext) {
            var nextFilename = '../' + filename;
            if (absolutePath !== path.resolve(nextFilename)) {
                return findUpSync(nextFilename);
            }
        }
        return ex;
    }
}

/**
 * Searches for a file starting in the current folder up to the root folder.
 * If the file is found, it is required and the code inside can be accessed.
 * @param {String} filename - file to search for
 */
function requireUpSync(filename) {
    var absolutePath = findUpSync(filename);

    if (absolutePath instanceof Error) {
        // file was not found
        throw new Error(absolutePath.message);
    } else {
        return require(absolutePath);
    }
}

module.exports = requireUpSync;