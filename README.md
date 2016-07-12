# node-require-upwards
Require code somewhere upwards in the file tree without knowing the specific number of parent folders needed.  
The tree is traversed synchronously.

## Motivation/Usage
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

### Limiting the number of checked folders
Version 1.1 adds an optional parameter to limit the maximum number of iterations.  

Given this folder structure:
```
fixtures
 ├─fix.js
 └─11
   ├─a.js
   └─baum
```

When starting from the folder _fixtures/11/baum_
```
requireUp('fix.js', 1)
# will throw an Error
requireUp('fix.js', 2)
# will return the content of fixtures/fix.js
```
