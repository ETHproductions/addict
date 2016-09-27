function $(id){return document.getElementById(id);}
function tCC(s){return s.length===2?(s.charCodeAt(0)-0xD800<<10)+(s.charCodeAt(1)-0xDC00)+0x10000:s.charCodeAt(0);}
function fCC(n){return n>65535?String.fromCharCode((n-0x10000>>10)+0xD800,(n&0x03FF)+0xDC00):String.fromCharCode(n);}

function run() {
    $("output").value = "";
    var code = $("code").value;
    var input = ($("input").value.match(/[\uD800-\uDBFF][\uDC00-\DFFF]|[^]/g) || []).map(tCC);
    code = code.replace(/\s*#.+/g, "") + "\n";
    if(!/^(a [A-Za-z_]\w*\n(( \w+)+\n){3}\n*|([^\Wa]\w*|a\w+)( [A-Za-z_]\w*)* *\n+)*\n*$/.test(code)) return alert("Invalid code");
    var aliases = {
        i: function (name) { if (!name) return false; variables[name] = (variables[name] || 0) + 1; return true; },
        d: function (name) { if (!name || !variables[name]) return false; variables[name] -= 1; return true; },
        c: function (name) { if (!name) return false; $("output").value += fCC(variables[name] || 0); return true; },
        t: function (name) { var c = input.shift(); if (!c) return false; if (name) variables[name] = c; return true; },
    }, variables = {};
    function alias (x) {
        var args = x.trim().split(" ");
        var name = args.shift();
        if (!aliases[name]) return alert("Cannot call non-existant alias " + name);
        return aliases[name].apply(null, args);
    }
    code = code.replace(/a (\w+)\n((?: \w+)*)\n((?: \w+)*)\n((?: \w+)*)\n/g, function (_, name, s1, s2, s3) { if (/^[acdit]$/.test(name)) alert("Cannot redefine built-in " + name); else aliases[name] = function () { var as = arguments; return alias(s1.replace(/\b\d+\b/g,function(n){return as[n-1]})) ? alias(s2.replace(/\b\d+\b/g,function(n){return as[n-1]})) : alias(s3.replace(/\b\d+\b/g,function(n){return as[n-1]})); }; return ""; });
    code = code.split("\n");
    for (var i = 0; i < code.length; i++) if(code[i]) alias(code[i]);
}
