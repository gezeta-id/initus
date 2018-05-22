let { uniqueId } = require('../util/');
let { compile, matches, extract } = require('./lang-helpers.js');



const commandStore = new WeakMap();
const commands = t => commandStore.get(t); // lazy boy concession

const id = sentence => uniqueId(sentence.command.toString());

class Language {
    constructor() {
        commandStore.set(this, []);
    }

    understand(sentence, handler) {
        commands(this).push({
            id: id(sentence),
            checker: compile(sentence),
            handler: handler
        });
        return this;
    }

    forget(sentence) {
        commands(this).set(this, commands(this).filter((c) => c.id !== id(sentence)));
        return this;
    }

    act(input) {
        let matcher = matches(input);
        let extractor = extract(input);
        commands(this)
            .filter(matcher)
            .forEach((c) => {
                c.handler.apply(null,extractor(c.checker));
            });
        return this;
    }

    load(lang) {
        lang.forEach(c => this.understand(c.sentence, c.handler));
        return this;
    }
}


module.exports = Language;
