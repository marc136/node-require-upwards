# node-require-upwards
require code somewhere upwards in the file tree

## Motivation
Instead of writing code like this:
```
try {
  var abc = require('./abc.js');
} catch (ex) {
  try {
    abc = require('../../abc.js');
  } catch (err) {
    abc = require('../../../abc.js');
  }
}
```

I rather want to write something like this:
```
var requireUp = require('require-upwards');
var abc = requireUp('abc.js');
```
