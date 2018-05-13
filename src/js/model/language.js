let pf = {
    isKw: w => (w.replace(/^\(/,'').substr(0,1) === ':'),
    openOpc: w => (w.substr(0,1) === '('),
    cleanWord: w => w.replace(/^\(?:?|\)*$/g, '')
};
function compile(pattern) {
    let words = pattern.split(' ');
    let positions = {};

    let expression = [];
    let offset=0;
    let opens = 0;

    for (let p = 0; p < words.length; p++) {
        let fragment = '';
        let w = words[p];
        if (pf.openOpc(w)) {
            opens +=1;
            offset+=1;
            fragment += '(';
        }
        if(pf.isKw(w)) {
            if(positions[pf.cleanWord(w)] === undefined) positions[pf.cleanWord(w)] = [];
            positions[pf.cleanWord(w)].push(p+1+offset);
            fragment += '(\\w+)';
        } else {
            fragment += '('+pf.cleanWord(w)+')';
        }
        expression.push(fragment);
    }
    expression = expression.join('\\s+');
    while(opens--) expression+=')?';

    return {
        kw: pf.cleanWord(words[0]),
        re: new RegExp(expression),
        keys: positions
    };

}

const commandStore = new WeakMap();
const commands = t => commandStore.get(t); // lazy boy concession

const id = pattern => pattern.toString();

const matches = input => c => c.checker.re.test(input);
const extract = (checker, input) => {
    let matches = input.match(checker.re);
    return [checker.kw, Object.keys(checker.keys).reduce((k,key) => {
        k[key] = checker.keys[key].map(pos=>matches[pos]);
        if(k[key].length === 1) k[key] = k[key][0];
        return k;
    }, {})];
};

class Language {
    constructor() {
        commandStore.set(this, []);
    }

    understand(pattern, handler) {
        commands(this).push({
            id: id(pattern), 
            checker: compile(pattern),
            handler: handler
        });
        return this;
    }

    forget(pattern) {
        commands(this) = commands(this).filter((c) => c.id !== id(pattern));
        return this;
    }

    act(input) {
        commands(this)
            .filter(matches(input))
            .forEach((c) => {
                c.handler.apply(null,extract(c.checker, input));
            });
        return this;
    }
}


module.exports = Language;
