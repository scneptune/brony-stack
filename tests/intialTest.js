var chai = require('chai')
var expect = chai.expect;

describe('Sample Testing block', function () {
  context('Hark A Test Must Be Runeth', function() {
    it('Here Ye Here Ye, A Test Appears', function () {
      expect("To be").to.not.equal("Not To Be");
    });
    it('For My Next Trick, A Joke', function () {
      function lightbulbEngineers (count) {
        return (count >= 3 ? true : false);
      }
      console.log("How many engineers does it take to screw in a lightbulb ?");
      var one = lightbulbEngineers(1),
          two = lightbulbEngineers(2),
          three = lightbulbEngineers(3);
        expect(one).to.be.false;
        expect(two).to.be.false;
        expect(three).to.be.true;
    })
  })
});
