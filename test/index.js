
var path = require('path');
var assert = require('assert');

var requireUp = require('../')

// this uses the test/fixtures folder with the following structure:
// fixtures
// ├─fix.js
// └─11
//   ├─a.js
//   └─baum
//     └─a.js
//       ├─sim.js
//       └─sam
//         └─sam.js

describe('require a module if path is unknown', function () {
    var basedir = process.cwd();
    var nonExistingFilename = 'non-eXi-sT1ng-file.123.abc.none';

    before('set working directory', function () {
        process.chdir('test/fixtures/11/baum/a.js/sam');
    });

    describe('desired file exists in tree', function () {
        it('in the same folder', function () {
            assert.equal(requireUp('sam.js'), 'sam.js', 'the content of the file should have been exported');
        });

        it('in a parent folder', function () {
            var absolutePath = requireUp.findUpSync('fix.js');
            assert(absolutePath.endsWith('fix.js'), 'the path "' + absolutePath + '" should end with "fix.js"');
            assert.deepEqual(requireUp('fix.js'), { filename: 'fix.js' }, 'the content of the file should have been exported');
        });

        it('even if a folder with the same name was found first', function () {
            var res = requireUp('a.js', 3);
            assert.equal(res, 'a.js', 'the content of the file should have been exported');
        });

        it('but the maximum number of iterations is too low', function () {
            // one folder above no child with this name exists
            assert.throws(function() { requireUp('a.js', 1); }, /ENOENT/);

            // two folders above the child only exists as a folder
            assert.throws(function() { requireUp('a.js', 2); }, /EISDIR/);
        });
    });

    describe('non-existing file "' + nonExistingFilename + '"', function () {
        it('findUpSync should return an error object instead of a path string', function () {
            var path = requireUp.findUpSync(nonExistingFilename, 4);
            assert(path instanceof Error, 'findUpSync should have returned an error object');
            assert.equal(path.code, 'ENOENT');
        });

        it('requireUp should throw an error', function () {
            assert.throws(function () {
                requireUp(nonExistingFilename);
            }, /ENOENT/);
        });
    });

    after('reset working directory', function () {
        process.chdir(basedir);
    });
});