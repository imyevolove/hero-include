# Include
Smart 'require' module for NodeJS

### Installation
Install via npm.

```
npm install include
```

### Examples
Require the module once in the main script
```javascript
require("include");
```
Use method 'using' for adding folder to router and include scripts from these folders 
```javascript
require("include");

include
	.using("./core")
	.using("./lib");

var a = include("module_from_core_folder");
var b = include("module_from_lib_folder");
```