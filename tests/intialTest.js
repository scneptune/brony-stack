var chai = require('chai')
var expect = chai.expect;

describe('Sample Testing block', function () {
  context('Hark A Test Must Be Runeth', function() {
    it('Here Ye Here Ye, A Test Appears', function () {
      expect("To be").to.not.equal("Not To Be");
    });
    it('For My Next Trick, A Joke', function () {
      function howManyEngineersDoesItTakeToScrewInALightbulb (count) {
        return (count >= 3 ? true : false);
      }
      var one = howManyEngineersDoesItTakeToScrewInALightbulb(1),
          two = howManyEngineersDoesItTakeToScrewInALightbulb(2),
          three = howManyEngineersDoesItTakeToScrewInALightbulb(3);
        expect(one).to.be.false;
        expect(two).to.not.be.true;
        expect(three).to.be.true;
    })
  })
});
