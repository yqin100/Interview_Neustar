GameEngine.api.___test___.unitTestsPrivate();

function testPublicUnitTests() {
	var tempID1 = 'landscape';
	var tempID2 = 'portrait';

	QUnit.module('-- Testing Public Functions/Variables', {
		setup: function(assert) {
			// need to reset the model for the unit test since it's a singleton
			// don't need to reset the UI since it's already reseted by QUnit's framework
			// start() ~= resetModel(), but resetModel() is a private function
			GameEngine.start();
		}
	});	
	
	QUnit.test('Test initUI() and document.read()', function(assert) {
		// already called when DOM got loaded
		var numButtonExpected = GameEngine.api.___test___.getModelSize();
		var panelID1 = '#' + tempID1;
		var panelID2 = '#' + tempID2;
		
        assert.equal($(panelID1 + ' button').length, numButtonExpected, 'Expect ' + numButtonExpected + ' buttons for id[' + panelID1 + ']');
        assert.equal($(panelID2 + ' button').length, numButtonExpected, 'Expect ' + numButtonExpected + ' buttons for id[' + panelID2 + ']');
        
        var expectedRows1 = Math.ceil(numButtonExpected / 10);
        var expectedRows2 = Math.ceil(numButtonExpected / 4);
        assert.equal($(panelID1 + ' tr').length, expectedRows1, 'Expect ' + expectedRows1 + ' rows for id[' + panelID1 + ']');
        assert.equal($(panelID2 + ' tr').length, expectedRows2, 'Expect ' + expectedRows2 + ' rows for id[' + panelID2 + ']');
	});
}

testPublicUnitTests();