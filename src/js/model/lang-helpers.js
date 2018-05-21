let isKw = w => w.substr(0,1) === ':';
let isMulKw = w => isKw(w) && w.substr(-1) === '*';
let clean = w => w.replace(/^:|\*$/g, '');

const compile = sentence => {
    let compiled = { fragments: [], synonyms: [], ...sentence };

    compiled.fragments = compiled.fragments.map(f => {
        let ex = [];
        let regex;
        let captures = {};

        f.capture.split(/\s+/).forEach( (w,p) => {
            if (isMulKw(w)) {
                if (captures[clean(w)] === undefined) captures[clean(w)] = [];
                captures[clean(w)].push(p+1);
                ex.push('([\\w\\s]+)');
            } else if (isKw(w)) {
                if (captures[clean(w)] === undefined) captures[clean(w)] = [];
                captures[clean(w)].push(p+1);
                ex.push('(\\w+)');
            } else {
                ex.push('(' + clean(w) + ')');
            }
        });
        regex = new RegExp((f.direct?'^':'') + ex.join('\\s+'));

        return { regex, captures, ...f };
    });

    compiled.synonyms.push(compiled.command);
    return compiled;
};

const matches = input => {
    let words = input.split(/\s+/);
    let command = words.shift();
    let rest = words.join(' ');
    return c => {
        let req = c.checker.fragments.filter(f => f.required);
        return (
            (
                c.checker.synonyms.includes(command) 
            ) && (
                req.every(r => rest.match(r.regex))
            )
        );
    }
};
const extract = input => checker => {
    let words = input.split(/\s+/);
    let command = words.shift();
    let rest = words.join(' ');
    return [
        checker.command,
        checker.fragments.reduce((k,f) => {
            let matches = rest.match(f.regex);
            return Object.keys(f.captures).reduce( (k,key) => {
                k[key] = matches[f.captures[key]];
                if (k[key].indexOf(' ') !== -1) k[key] = k[key].split(' ');
                return k;
            }, k);
        }, {})
    ];
};


module.exports = { compile, matches, extract };
