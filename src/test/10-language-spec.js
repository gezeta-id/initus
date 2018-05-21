const 
    sinon = require('sinon'),
    chai = require('chai'),
    expect = require('chai').expect;
const sinonChai = require("sinon-chai");

chai.use(sinonChai);

const Language = require('../js/model/language.js');


const sentences = {
    nocaptures: {
        command: 'wait'
    },
    simple: {
        command: 'say',
        fragments: [
            {
                required: true,
                capture: ':word'
            }
        ]
    },
    multicapture: {
        command: 'say',
        fragments: [
            {
                required: true,
                capture: ':message*'
            }
        ]
    },
    extended: {
        command: 'take',
        synonyms: ['pick', 'get'],
        fragments: [
            {
                required: true,
                direct: true,
                capture: ':thing'
            },
            {
                required: false,
                capture: 'from :container'
            }
        ]
    }
};

describe('Language', function () {
    it('...can be instantiated', function() {
        expect(new Language()).not.to.be.null;
    });
    it('...understands a command with no captures', function() {
        let h = sinon.stub();

        let l = new Language();
        l.understand(sentences.nocaptures, h);
        l.act("wait");
        expect(h).to.have.been.calledWithExactly('wait', {});
    });
    it('...understands simple commands with simple captures', function() {
        let h = sinon.stub();

        let l = new Language();
        l.understand(sentences.simple, h);
        l.act("say hello");
        expect(h).to.have.been.calledWithExactly('say', {'word': 'hello'});
    });
    it('...understands simple commands with a single multicapture', function() {
        let h = sinon.stub();

        let l = new Language();
        l.understand(sentences.multicapture, h);
        l.act("say hello and other things");
        expect(h).to.have.been.calledWithExactly('say', {'message': ['hello', 'and', 'other', 'things']});
    });
    it('...understands simple commands with multiple captures', function() {
        let h = sinon.stub();

        let l = new Language();
        l.understand(sentences.extended, h);
        l.act("take drink from fridge");
        expect(h).to.have.been.calledWithExactly('take', {'thing': 'drink', 'container': 'fridge' });
    });
});
