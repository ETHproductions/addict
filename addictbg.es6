const tCC = (s) =>
    s.length === 2 ?
        (s.charCodeAt(0) - 0xD800 << 10)
        + (s.charCodeAt(1) - 0xDC00) + 0x10000
    : s.charCodeAt(0);

const fCC = (n) =>
    n > 0xFFFF ?
        String.fromCharCode(
            (n - 0x10000 >> 10) + 0xD800,
            (n & 0x03FF) + 0xDC00
        )
    : String.fromCharCode(n);


const SURROGATES = /[\uD800-\uDBFF][\uDC00-\DFFF]|[^]/g;
const VALID_CODE = /^(a [A-Za-z_]\w*\n(( \w+)+\n){3}\n*|([^\Wa]\w*|a\w+)( [A-Za-z_]\w*)* *\n+)*\n*$/;

const run = (code, input, output) => {
    // get _characters_ of input
    input = (input.match(SURROGATES) || []).map(tCC);
    // remove comments from code
    code = code.replace(/\s*#.+/g, "")
    // and remove all carriage returns
               .replace(/\r/g, "");
    
    if(code[code.length - 1] !== "\n")
        code += "\n";
    
    if(!VALID_CODE.test(code))
        throw new SyntaxError("invalid code");
    
    let variables = {};
    let aliases = {
        "i": (name) => {
            if(!name)
                return false;
            
            variables[name] = variables[name] || 0;
            variables[name]++;
            
            return true;
        },
        "d": (name) => {
            if(!name || !variables[name])
                return false;
            
            // make default?
            variables[name]--;
            
            return true;
        },
        "c": (name) => {
            if(!name)
                return false;
            
            variables[name] = variables[name] || 0;
            
            output(fCC(variables[name]));
        },
        // nonstandard
        "n": (name) => {
            if(!name)
                return false;
            
            variables[name] = variables[name] || 0;
            
            output(variables[name].toString());
        },
        "t": (name) => {
            let take = input.shift();
            if(!take)
                return false;
            
            if(name)
                variables[name] = take;
            
            return true;
        },
    };
    
    let alias = (x) => {
        let given = x.trim().split(" ");
        let [name, ...args] = given;
        if(!aliases[name])
            throw new ReferenceError("Cannot call non-existant alias " + name);
        
        return aliases[name](...args);
    }
    
    code = code.replace(
        /a (\w+)\n((?: \w+)*)\n((?: \w+)*)\n((?: \w+)*)\n/g,
        (_, name, statement, success, fail) => {
            if(/^[acdit]$/.test(name))
                throw new Error("Cannot redefine built-in " + name);
            else
                aliases[name] = (...args) => {
                    let getArgument = (n) => args[Number(n) - 1];
                    let boundedDigit = /\b\d+\b/g;
                    
                    let succeeded = alias(
                        statement.replace(boundedDigit, getArgument)
                    );
                    
                    let target = succeeded ? success : fail;
                    
                    return alias(
                        target.replace(boundedDigit, getArgument)
                    );
                }
            return "";
        }
    );
        
    code = code.split("\n");
    
    for(let c of code)
        if(c) alias(c);
}

module.exports = exports.default = run;