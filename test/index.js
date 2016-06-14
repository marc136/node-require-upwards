
var path = require('path');
var assert = require('assert');

var requireUp = require('../')
var basedir = process.cwd();


describe('require a module if path is unknown', function () {
    before('set working directory', function () {
        process.chdir('test/fixtures/11/baum/a.js/sam');
    });

    describe('Desired file exists in tree', function () {
        it('in the same folder', function () {
            assert.equal(requireUp('sam.js'), 'sam.js');
        });

        it('in a parent folder', function () {
            assert.deepEqual(requireUp('fix.js'), { filename: 'fix.js' });
        });

        it('Even if a folder with the same name was found first', function () {
            var res = requireUp('a.js');
            assert.equal(res, 'a.js');
        });
    });


    describe('Non-existing file', function () {
        var filename = 'non-eXi-sT1ng-file.123.abc.none';
        it('Should not find "' + filename + '" and throw an error', function () {
            assert.throws(function () {
                requireUp(filename)
            });
        });
    });

    after('re-set working directory', function () {
        process.chdir(basedir);
    });
});