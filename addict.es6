const addict = require("./addictbg.es6");
const fs = require("fs");

let args = process.argv.slice(2);

let opts = {
    "input": false
};

let flags = {
    "i": [1, (a) => opts.input = a]
};
// parse flags
for(let i = 0; i < args.length; i++){
    let arg = args[i];
    if(/^[-/]/.test(arg)){
        
    }
}

let fileName = args.shift();

let input = "";
if(opts.input)
    input = fs.readFileSync(opts.input);
let code = fs.readFileSync(fileName).toString();

const onEnd = () => {
    addict(code, input, (n) => process.stdout.write(n));
}

onEnd();