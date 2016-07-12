
var fs = require('fs');
var path = require('path');

/**
 * Searches for a file starting in the current folder up to the root folder.
 * If the file is found, it is required and the code inside can be accessed.
 * @param {String} filename - file to search for
 * @param {Number} maxIterations - number of folders to search upwards, pass -1 for infinte attempts
 */
function requireUpSync(filename, maxIterations) {
    var absolutePath = findUpSync(filename, maxIterations);

    if (absolutePath instanceof Error) {
        // file was not found
        throw new Error(absolutePath.message);
    } else {
        return require(absolutePath);
    }
}
module.exports = requireUpSync;

/**
 * Searches for a file starting in the current folder up to the root folder.
 * @param {String} filename - file to search for
 * @param {Number} [maxIterations=-1] - number of folders to search upwards, pass -1 for infinte attempts
 */
function findUpSync(filename, maxIterations) {
    if (isNaN(maxIterations)) maxIterations = -1;
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

        /* istanbul ignore else */
        if (tryNext && maxIterations !== 0) {
            var nextFilename = '../' + filename;
            if (absolutePath !== path.resolve(nextFilename)) {
                // the root folder was not yet reached
                return findUpSync(nextFilename, maxIterations-1);
            }
        }
        return ex;
    }
}

module.exports.findUpSync = findUpSync;