var 
    sinon = require('sinon'),
    chai = require('chai'),
    expect = require('chai').expect;
var sinonChai = require("sinon-chai");

chai.use(sinonChai);

var Language = require('../js/model/language.js');

describe('Language', function () {
    it('...can be instantiated', function() {
        expect(new Language()).not.to.be.null;
    });
    it('...understands patterns and acts on input', function() {
        let h = sinon.stub();

        let l = new Language();
        l.understand("say :salutation", h);
        l.act("say hello");
        expect(h).to.have.been.calledWithExactly('say', {'salutation': 'hello'});
    });
});
