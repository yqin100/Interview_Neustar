"use strict";

function showInstructions() {
	$('#myModalInstructions').modal('show');
	return false;
}

$( document ).ready(function() {
	GameEngine.initUI();
	GameEngine.start();
});

// ****************** Singleton GameEngine **********************
var GameEngine = new function() {
	// ************************** private ***************************
	var portraitID = "portrait";
	var landscapeID = "landscape";
	var resultsID = "results";
	var defaultButtonClassName = 'btn-default';
	var dangerButtonClassName = 'btn-danger';
	var successButtonClassName = 'btn-success';
	var disabledProperty = "disabled";
	var numAttempts = 0;
	var maxAttempts = 5;
	var random;
	// this model drives the whole game, if you add more here, the UI will update corresponding to this model
	// i.e. if there are X numbers then there will be X buttons on the UI
	var numbers = [false,false,false,false,false,
	               false,false,false,false,false,
	               false,false,false,false,false,
	               false,false,false,false,false,];
	
	var getCreateRowHTML = function(start, end, myUiID) {
		var html = '<tr>';
		
		for (var i = start; i < end && i <= numbers.length; i++) {	
			html += '<td><button id="' + myUiID + i + '" type="button" class="btn btn-default btn-block" onclick="javascript: GameEngine.userClick(' + i + ');">' + i + '</button></td>';		
		}
		html += '</tr>';
		
		return html;
	};
	
	var getCreateTableHTML = function(columns, myUiID) {
		var start = 1;
		var rows = numbers.length / columns;
		var html = '<table class="numberTable">';
				
		for (var i = 0; i < rows; i++) {
			var end = start + columns;
			html += getCreateRowHTML(start, end, myUiID);	
			start = end;
		}	
		html += '</table>';
		
		return html;
	};
	
	var initUITable = function(myUiID, columns) {
		var html = getCreateTableHTML(columns, myUiID);
		$(getIDString(myUiID)).append(html);		
	};
	
	var getIDString = function(id) {
		return '#' + id;
	};
	
	var updateModel = function(buttonNumber) {
		numbers[buttonNumber - 1] = true;
	};
	
	var resetModel = function() {
		for (var i = 0; i < numbers.length; i++) {
			numbers[i] = false;
		}
	};
	
	var resetUI = function() {
		for (var i = 1; i <= numbers.length; i++) {
			setButtonClicked(false, i);	
		}
	};
	
	var setButtonClicked = function(isClicked, buttonNumber, isWon) {
		var removeClassName = dangerButtonClassName + ' ' + successButtonClassName; 
		var addClassName = defaultButtonClassName; 
		
		if (isClicked) {
			removeClassName = defaultButtonClassName; 
			addClassName = dangerButtonClassName; 
		}
		
		var id1 = getIDString(portraitID) + buttonNumber;
		var id2 = getIDString(landscapeID) + buttonNumber;
		
		$(id1).removeClass(removeClassName);
		$(id2).removeClass(removeClassName);
		
		if (isWon) {
			$(id1).addClass(successButtonClassName);
			$(id2).addClass(successButtonClassName);
		}
		else {
			$(id1).addClass(addClassName);
			$(id2).addClass(addClassName);
		}
	};
	
	var setButtonDisabled = function(isDisabled, buttonNumber) {
		var id1 = getIDString(portraitID) + buttonNumber;
		var id2 = getIDString(landscapeID) + buttonNumber;
		
		if (isDisabled) {
			$(id1).attr(disabledProperty, disabledProperty);
			$(id2).attr(disabledProperty, disabledProperty);
		}
		else {
			$(id1).removeAttr(disabledProperty);
			$(id2).removeAttr(disabledProperty);
		}
	};
	
	var setAllButtonsDisabled = function(isDisabled) {
		for (var i = 1; i <= numbers.length; i++) {
			setButtonDisabled(isDisabled, i);
		}		
	};
	
	var generateRandom = function() {
		return Math.floor((Math.random() * numbers.length) + 1);
	};
	
	var updateUserResults = function(isWin) {
		$('#' + resultsID).show();
		
		var resultText;
		if (isWin) {
			resultText = 'Congratulation, you guessed the right number!';
		}
		else {
			resultText = 'Sorry, you`ve exceeded ' + maxAttempts + ' attempts.  The number was ' + random + '.';			
		}
		$('#resultsText').text(resultText);
	};
	
	var stop = function(isWin) {
		updateUserResults(isWin);
		setAllButtonsDisabled(true);
	};
	
	// *************************** public *********************************
	this.initUI = function() {
		initUITable(portraitID, 4);
		initUITable(landscapeID, 10);
	};
	
	this.userClick = function(buttonNumber) {
		numAttempts++;
		if (random == buttonNumber) {
			setButtonClicked(true, buttonNumber, true);
			stop(true);
		}
		else if (numAttempts < maxAttempts) {
			updateModel(buttonNumber);
			setButtonClicked(true, buttonNumber);
			setButtonDisabled(true, buttonNumber);
		}
		else {
			setButtonClicked(true, buttonNumber);
			stop(false);
		}
	};
	
	this.start = function() {
		random = generateRandom();
		numAttempts = 0;
		$('#' + resultsID).hide();
		resetModel();
		resetUI();
		setAllButtonsDisabled(false);
	};
	
	// ***************************************************************************************
	// ********************************** Unit Testing ***************************************
	// ***************************************************************************************
	this.api = {
		___test___ : {
			getModelSize : function() {
				return numbers.length;
			},
			
			unitTestsPrivate : function() {
				var myID = 'landscapeTest';
				var myID2 = 'portraitTest';
				var tempID1 = 'landscape';
				var tempID2 = 'portrait';
				var buttonRegex = /<button/gi;
				
				function getNumIDTest(start, end, html) {
			        var numFound = 0;
			        for (var i = start; i <= end; i++) {
			        	if (html.search(myID + i) > 0) {
			        		numFound++;
			        	}
			        }
			        return numFound;
				}
				
				QUnit.module('Testing Private Functions/Variables', {
					setup: function(assert) {
						// need to reset the model for the unit test since it's a singleton
						// don't need to reset the UI since it's already reseted by QUnit's framework
						resetModel();
					}
				});

				QUnit.test('Test getCreateRowHTML()', function(assert) {
					var start = 1;
					var end = 10;
					var expect = end - 1;
					var html = getCreateRowHTML(start, end, myID);
					
					var numButtons = html.match(buttonRegex).length;
					
			        assert.equal(numButtons, expect, 'Expect ' + expect + ' button html tags');	        
			        assert.equal(getNumIDTest(start, end, html), expect, 'Expect ' + expect + ' ids');
				});
				
				QUnit.test('Test getCreateTableHTML()', function(assert) {
					var columns = 3;
					var numButtonExpected = numbers.length;
					var rows = Math.ceil(numButtonExpected / columns);
					var html = getCreateTableHTML(columns, myID);
					
					var numRows = html.match(/<tr/gi).length;
			        assert.equal(numRows, rows, 'Expect ' + rows + ' table rows');
			        
					var numButtons = html.match(buttonRegex).length;
			        assert.equal(numButtons, numButtonExpected, 'Expect ' + numButtonExpected + ' button html tags');

			        assert.equal(getNumIDTest(1, numButtonExpected, html), numButtonExpected, 'Expect ' + numButtonExpected + ' ids');
				});
				
				QUnit.test('Test initUITable()', function(assert) {
					var numButtonExpected = numbers.length;
					var columns = 3;
					var htmlID = getIDString(myID);
					initUITable(myID, columns);
					
					var numButton = $(htmlID + ' button').length;
			        assert.equal(numButton, numButtonExpected, 'Expect ' + numButtonExpected + ' buttons');
			        
					var numRows = $(htmlID + ' tr').length;
					var expectedRows = Math.ceil(numButtonExpected / columns);
			        assert.equal(numRows, expectedRows, 'Expect ' + expectedRows + ' rows');
				});
					
				QUnit.test('Test getIDString()', function(assert) {
					var id = 'myIDTest';
					var idString = getIDString(id);
					var myIdString = getIDString(myID);
			        assert.equal(idString, '#' + id, 'Expect id => ' + '#' + id);
			        assert.equal(myIdString, '#' + myID, 'Expect id => ' + '#' + myID);
				});	
				
				QUnit.test('Test updateModel()', function(assert) {
					var nums = [generateRandom(),
					            generateRandom(),
					            generateRandom()];
					
					for (var i = 0; i < nums.length; i++) {
						var buttonNumber = nums[i];
						var index = buttonNumber - 1;
						updateModel(buttonNumber);
				        assert.ok(numbers[index], 'Expect model "numbers" index "' + index + '" to be true');
					}
				});
				
				QUnit.test('Test resetModel() in QUnit module setup', function(assert) {
					// method is already being called in QUnit module setup
					// need to make sure your modifying the model before this test is called 
					// for an accurate test of the resetModel() method and the QUnit setup method
					var numFalse = 0;
					for (var i = 0; i < numbers.length; i++) {
						if (!numbers[i]) {
							numFalse++;
						}
					}
			        assert.equal(numFalse, numbers.length, 'Expect model "numbers" to be all false');			
				});	
				
				QUnit.test('Test resetUI()', function(assert) {
					for (var i = 1; i <= numbers.length; i++) {
						var isClicked = generateRandom() > (numbers.length/2);
						var isWon = generateRandom() > (numbers.length/2);
						setButtonClicked(isClicked, i, isWon);				
					}

					resetUI();
					
					var numReset = 0;
					for (var i = 1; i <= numbers.length; i++) {
						var buttonID1 = getIDString(tempID1) + i;
						var buttonID2 = getIDString(tempID2) + i;
						if (!$(buttonID1).hasClass(dangerButtonClassName) &&
								!$(buttonID1).hasClass(successButtonClassName) &&
								$(buttonID1).hasClass(defaultButtonClassName) &&
								!$(buttonID2).hasClass(dangerButtonClassName) &&
								!$(buttonID2).hasClass(successButtonClassName) &&
								$(buttonID2).hasClass(defaultButtonClassName)) {
							numReset++;
						}
					}
					
			        assert.equal(numReset, numbers.length, 'Resetted all buttons');	
				});
				
				QUnit.test('Test setButtonClicked()', function(assert) {
					// setup UI for test
					var columns = 3;
					initUITable(tempID1, columns);
					initUITable(tempID2, columns);
					// variables for test
					var isClicked;
					var isWon;
					var buttonNumber = 0;
					var buttonID1;
					var buttonID2;
					
					
					isClicked = true; buttonNumber++; isWon = true;
					buttonID1 = getIDString(tempID1) + buttonNumber;
					buttonID2 = getIDString(tempID2) + buttonNumber;
					setButtonClicked(isClicked, buttonNumber, isWon);
					assert.ok(true,'******* Testing isClicked = true, isWon = true *******');
			        assert.ok(!$(buttonID1).hasClass(defaultButtonClassName), 'Button id[' + buttonID1 + '] does not have class "' + defaultButtonClassName + '"');	
			        assert.ok($(buttonID1).hasClass(successButtonClassName), 'Button id[' + buttonID1 + '] has class "' + successButtonClassName + '"');	
			        assert.ok(!$(buttonID2).hasClass(defaultButtonClassName), 'Button id[' + buttonID2 + '] does not have  class "' + defaultButtonClassName + '"');	
			        assert.ok($(buttonID2).hasClass(successButtonClassName), 'Button id[' + buttonID2 + '] has class "' + successButtonClassName + '"');	

					isClicked = false; buttonNumber++; isWon = true;
					buttonID1 = getIDString(tempID1) + buttonNumber;
					buttonID2 = getIDString(tempID2) + buttonNumber;
					setButtonClicked(isClicked, buttonNumber, isWon);
					assert.ok(true,'******* Testing isClicked = false, isWon = true *******');
			        assert.ok(!$(buttonID1).hasClass(dangerButtonClassName), 'Button id[' + buttonID1 + '] does not have class "' + dangerButtonClassName + '"');	
			        assert.ok($(buttonID1).hasClass(defaultButtonClassName), 'Button id[' + buttonID1 + '] has class "' + defaultButtonClassName + '"');	
			        assert.ok($(buttonID1).hasClass(successButtonClassName), 'Button id[' + buttonID1 + '] has class "' + successButtonClassName + '"');	
			        assert.ok(!$(buttonID2).hasClass(dangerButtonClassName), 'Button id[' + buttonID2 + '] does not have  class "' + dangerButtonClassName + '"');	
			        assert.ok($(buttonID2).hasClass(defaultButtonClassName), 'Button id[' + buttonID2 + '] has  class "' + defaultButtonClassName + '"');	
			        assert.ok($(buttonID2).hasClass(successButtonClassName), 'Button id[' + buttonID2 + '] has class "' + successButtonClassName + '"');	

					isClicked = true; buttonNumber++; isWon = false;
					buttonID1 = getIDString(tempID1) + buttonNumber;
					buttonID2 = getIDString(tempID2) + buttonNumber;
					setButtonClicked(isClicked, buttonNumber, isWon);
					assert.ok(true,'******* Testing isClicked = true, isWon = false *******');
			        assert.ok(!$(buttonID1).hasClass(defaultButtonClassName), 'Button id[' + buttonID1 + '] does not have class "' + defaultButtonClassName + '"');	
			        assert.ok($(buttonID1).hasClass(dangerButtonClassName), 'Button id[' + buttonID1 + '] has class "' + dangerButtonClassName + '"');	
			        assert.ok(!$(buttonID2).hasClass(defaultButtonClassName), 'Button id[' + buttonID2 + '] does not have  class "' + defaultButtonClassName + '"');	
			        assert.ok($(buttonID2).hasClass(dangerButtonClassName), 'Button id[' + buttonID2 + '] has class "' + dangerButtonClassName + '"');	

					isClicked = false; buttonNumber++; isWon = false;
					buttonID1 = getIDString(tempID1) + buttonNumber;
					buttonID2 = getIDString(tempID2) + buttonNumber;
					setButtonClicked(isClicked, buttonNumber, isWon);
					assert.ok(true,'******* Testing isClicked = false, isWon = false *******');
			        assert.ok(!$(buttonID1).hasClass(dangerButtonClassName), 'Button id[' + buttonID1 + '] does not have class "' + dangerButtonClassName + '"');	
			        assert.ok(!$(buttonID1).hasClass(successButtonClassName), 'Button id[' + buttonID1 + '] does not have class "' + successButtonClassName + '"');	
			        assert.ok($(buttonID1).hasClass(defaultButtonClassName), 'Button id[' + buttonID1 + '] has class "' + defaultButtonClassName + '"');	
			        assert.ok(!$(buttonID2).hasClass(dangerButtonClassName), 'Button id[' + buttonID2 + '] does not have  class "' + dangerButtonClassName + '"');	
			        assert.ok(!$(buttonID2).hasClass(successButtonClassName), 'Button id[' + buttonID2 + '] does not have class "' + successButtonClassName + '"');	
			        assert.ok($(buttonID2).hasClass(defaultButtonClassName), 'Button id[' + buttonID2 + '] has  class "' + defaultButtonClassName + '"');	
				});
				
				QUnit.test('Test setButtonDisabled()', function(assert) {
					var buttonNumber;
					var isDisabled;
					var buttonID1;
					var buttonID2;
					
					buttonNumber = 1; isDisabled = true;
					buttonID1 = getIDString(tempID1) + buttonNumber;
					buttonID2 = getIDString(tempID2) + buttonNumber;
					setButtonDisabled(isDisabled, buttonNumber);
					assert.ok(true,'******* Testing buttonNumber = 1, isDisabled = true *******');
			        assert.equal($(buttonID1).attr(disabledProperty), disabledProperty, 'Button id[' + buttonID1 + '] has property "' + disabledProperty + '"');	
			        assert.equal($(buttonID2).attr(disabledProperty), disabledProperty, 'Button id[' + buttonID2 + '] has property "' + disabledProperty + '"');	

					buttonNumber = 2; isDisabled = false;
					buttonID1 = getIDString(tempID1) + buttonNumber;
					buttonID2 = getIDString(tempID2) + buttonNumber;
					setButtonDisabled(isDisabled, buttonNumber);
					assert.ok(true,'******* Testing buttonNumber = 2, isDisabled = false *******');
			        assert.ok(!$(buttonID1).attr(disabledProperty), 'Button id[' + buttonID1 + '] does not have property "' + disabledProperty + '"');	
			        assert.ok(!$(buttonID2).attr(disabledProperty), 'Button id[' + buttonID2 + '] does not have property "' + disabledProperty + '"');	
				});
				
				function testSetAllButtonsDisabled(assert) {
					var numButtonsDisable;
					
					setAllButtonsDisabled(true);
					numButtonsDisable = 0;
					for (var i = 1; i <= numbers.length; i++) {
						var buttonID1 = getIDString(tempID1) + i;
						var buttonID2 = getIDString(tempID2) + i;
						if ($(buttonID1).attr(disabledProperty) == disabledProperty &&
								$(buttonID2).attr(disabledProperty) == disabledProperty) {
							numButtonsDisable++;
						}	
					}
			        assert.equal(numButtonsDisable, numbers.length, 'Set all buttons disabled[true] worked');	

					setAllButtonsDisabled(false);
					numButtonsDisable = 0;
					for (var i = 1; i <= numbers.length; i++) {
						var buttonID1 = getIDString(tempID1) + i;
						var buttonID2 = getIDString(tempID2) + i;
						if (!$(buttonID1).attr(disabledProperty) &&
								!$(buttonID2).attr(disabledProperty)) {
							numButtonsDisable++;
						}	
					}
			        assert.equal(numButtonsDisable, numbers.length, 'Set all buttons disabled[false] worked');				
				}
				
				QUnit.test('Test setAllButtonsDisabled()', function(assert) {
					testSetAllButtonsDisabled(assert);
				});
				
				QUnit.test('Test generateRandom()', function(assert) {
					assert.expect(1);
					
					var isRandom = true;
					var lastRandom = 0;
					var iterations = 0;
					var maxTimesSameValue = 2;
					var currentMaxTimesSameValue = 0;
					for (var i = 0; i < numbers.length; i++) {
						var newRandom = generateRandom();
						if (lastRandom) {
							if (lastRandom == newRandom) {
								if (currentMaxTimesSameValue >= maxTimesSameValue) {
									isRandom = false;
									break;
								}
								else {
									currentMaxTimesSameValue++;
								}
							}
							else {
								currentMaxTimesSameValue = 0;
							}
							iterations++;
						}
						lastRandom = newRandom;
					}
					
					if (isRandom && iterations == (numbers.length - 1)) {
				        assert.ok(true, 'Tested ' + numbers.length + ' rounds of generateRandom() and it worked all iterations');	
					}
				});
				
				function testUpdateUserResults(assert) {
					updateUserResults(true);
					assert.ok(true, '******* Testing updateUserResults = true *******');
					assert.ok($('#' + resultsID).is(':visible'), 'Results panel showing');
					assert.ok($('#resultsText').text().search('Congratulation') >= 0, 'Results text success showing');
					
					$('#' + resultsID).hide();
					
					updateUserResults(false);
					assert.ok(true, '******* Testing updateUserResults = false *******');
					assert.ok($('#' + resultsID).is(':visible'), 'Results panel showing');
					assert.ok($('#resultsText').text().search('Sorry') >= 0, 'Results text failure showing');	
				}
				
				QUnit.test('Test updateUserResults()', function(assert) {
					testUpdateUserResults(assert);
				});

				QUnit.test('Test stop()', function(assert) {
					testUpdateUserResults(assert);
					testSetAllButtonsDisabled(assert);
				});
			}
		}
	};
};