function $(id){return document.getElementById(id);}
function tCC(s){return s.length===2?(s.charCodeAt(0)-0xD800<<10)+(s.charCodeAt(1)-0xDC00)+0x10000:s.charCodeAt(0);}
function fCC(n){return n>65535?String.fromCharCode((n-0x10000>>10)+0xD800,(n&0x03FF)+0xDC00):String.fromCharCode(n);}

function run() {
    $("output").value = "";
    var code = $("code").value + "\n";
    var input = ($("input").value.match(/[\uD800-\uDBFF][\uDC00-\DFFF]|[^]/g) || []).map(tCC);
    code = code.replace(/\s*(#.*)?\n/g, "\n");
    var aliases = {
        i: function (name) { if (!name) return false; name = devar(name, []); variables[name] = (variables[name] || 0) + 1; return true; },
        d: function (name) { if (!name || !variables[name = devar(name, [])]) return false; variables[name] -= 1; return true; },
        c: function (name) { if (!name) return false; name = devar(name, []); $("output").value += fCC(variables[name] || 0); return true; },
        t: function (name) { var c = input.shift(); if (!c) return false; name = devar(name, []); if (name) variables[name] = c; return true; },
    }, variables = { get 0 () { return 0; } };
    function devar (s) {
        while (/\[[^\[\]]+\]/.test(s))
            s = s.replace(/\[([^\[\]]+)\]/, function(_, name) { return variables[name] || 0; });
        return s;
    }
    function dearg (s, args) {
        s = devar(s);
        while (/\b[1-9]\d*\b|\*/.test(s)) {
            s = s.replace(/(-?\d*)\*(-?\d*)/g, function(_, n1, n2) { return [].slice.apply(args, +n2 ? [+n1, +n2] : [+n1]).join(" "); });
            s = s.replace(/\b[1-9]\d*\b/g, function(n) { return args[n-1] || ""; });
        }
        return s;
    }
    function alias (x) {
        var args = x.trim().split(" ");
        var name = args.shift();
        if (!aliases[name]) return alert("Cannot call non-existant alias " + name);
        return aliases[name].apply(null, args);
    }
    code = code.replace(/a (\w+)\n((?: -?\d*\*| [\w\[\]]+)*)\n((?: -?\d*\*-?\d*-?\d*| [\w\[\]]+)*)\n((?: -?\d*\*-?\d*| [\w\[\]]+)*)\n/g, function (_, name, s1, s2, s3) { if (/^[acdit]$/.test(name)) alert("Cannot redefine built-in " + name); else aliases[name] = function () { return alias(dearg(s1, arguments)) ? alias(dearg(s2, arguments)) : alias(dearg(s3, arguments)); }; return ""; });
    code = code.split("\n");
    for (var i = 0; i < code.length; i++) if (code[i]) {
        if (/^([^a\W]\w*|a\w+)( [^\d\W]\w*)*$/.test(code[i]))
            alias(code[i]);
        else
            return alert("Invalid code: " + code[i]);
    }
}
