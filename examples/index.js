require("../index");

include
    .using("./library_a")
    .using("./library_b");

console.log(include("module_a"));
console.log(include("module_b"));
console.log(include("module_b"), "///Loaded from cache"); /// Will be loaded from cache
console.log(include("subfolder_b/sub_module_b"));