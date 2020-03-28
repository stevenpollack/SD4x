/*
 * Implement all your JavaScript in this file!
 */
var clearDisplay = function() {
    $('#display').val('');
    return false // unclear if this is necessary
}

var displayVal = function(x) {
    return $('#display').val(x);
}

// make sure calculator display is empty on page-load
$(document).ready(clearDisplay);

// global variables
var trailingDigitRegexp = /[+*\-\/]0*\.?\d+$/; // op0*(.|)dddddd
var inputString = '';
var histArray = []; // this isn't used.
var displayString = '';
var lastOperation = '';
var calcResult = '';

// the only buttons with value attributes are digits
// they modify the input string, and nothing else
$('button[value]').click(function(){
/*    If the display string has been reset, but calcResult isn't empty,
      the user has finished a string of calculations.
      If we push a button number button after this point, the input string
      should no longer hold calcResult, but the new number.
      The logic for ^^ has been pushed to the op-button handlers.
 */
    inputString += $(this).val(); 
    displayString += $(this).val();
    displayVal(displayString);
    // console.log(`digitButton: ${inputString}`);
});

// have C clear input string and display
$('#clearButton').click(function(){
    inputString = '';
    displayString = '';
    calcResult = '';
    displayVal('');
});

var opDict = {
    subtractButton: "-",
    addButton: "+",
    multiplyButton: "*",
    divideButton: "/"
};

// create a function factory to handle +-*/ button events
/*  the op Button handler's rely on the idea that `inputString` is
    reset upon "=". This is an indication that a string of operations
    is to be "exhausted" and the user wants to start a new string.
    If a calculation is returned and a user *immediately* presses an operation
    the assumption is that the new string will begin with the freshly returned
    `calcResult`. Otherwise, the cases we need to pay attention to are:
    
    * inputString & calcResult are both empty, which symbolizes as clear calculator.
    In this case, adding an op to the inputString would make eval() break, and makes
    no sense.
    * the user has pushed two successive operations (e.g. + and then -). In this case,
    the "-" operator will replace the "+" in inputString.
    * the user has pushed an operator after a string of numbers. This is the primary
    anticipated case, and should have the operator appended to the end of inputString.

*/
var opButtonHandler = function(buttonId) {
    return function() {
        if (inputString === '' && calcResult === '') {
            // do nothing since this would be syntactically wrong 
            return false;
        }

        // if a calculation has just finished & an operation is pressed, the result
        // should start the input string
        if (displayString === '' && calcResult !== '') {
            inputString = calcResult;
        }

        var op = opDict[buttonId]
        // if inputString has a trailing op, clobber it
        if (/\D$/.test(inputString)) {
            inputString = inputString.replace(/\D$/, op);
        } else if (/\d$/.test(inputString)) { // input string has trailing digit:
            // 1. send evaluated string to display
            displayVal(eval(inputString));
            // 2. append new op to input string
            inputString += op;
        }
        // after input string has been modified, we need to clear the display
        // to prepare it for future input -- the number buttons will modify
        // display string upon click.
        displayString = '';
        // console.log(`opButton: ${inputString}`);
    }
};

// assign the correct button handlers according to the button Id attr
for (var buttonId in opDict) {
    $('#' + buttonId).click(opButtonHandler(buttonId));
};

// this is a helper function that is heavily used in the "=" button handler.
// the purpose is to update the DOM with calculation results/history before resetting
// inputString and displayString. In the instance where a mal-formed input string
// is attempted to be computed, an error flag is set and calcResult is reset.
var calcCaptureAndResetStrings = function(evalString, throwError=false) {
    calcResult = eval(evalString);
    $('ol.history').prepend(`<li>${inputString} = ${calcResult}</li>`);
    histArray.push(inputString);

    if (throwError) {
        displayVal("SYNTAX ERROR: " + inputString);
    } else {
        displayVal(calcResult);
    }
    
    inputString = '';
    displayString = '';
    // in the instance of an infinite or undefined value, reset calcResult
    if (calcResult == undefined || !Number.isFinite(calcResult)) {
        calcResult = '';
    }

    return calcResult;
}

// have "=" evaluate inputString
/*
    The "=" button has some rules:
    1. successive clicks of "=" repeat the last operation. For example "1+2===" = "1+2+2+2"
    2. we can't click "=" on a malformed string like "88+=". This should yield an error but
    instead we've been told to just "ignore" the operation.
*/
$('#equalsButton').click(function(){
    // if both inputString & calcResult are empty, we're dealing with a blank
    // calculator and there's nothing to "="
    if (inputString == '' && calcResult == '') {
        return false;
    }

    /* Cases:
    1. string is unambiguous (e.g. ^1+2$) -> eval and capture last \D\d*
    2. string has trailing op (e.g. 88+) -> display syntax error
    3. string is unambiguous and = is hit again
    4. string is just a number (e.g. 1): display it as the identity (e.g. 1=1)
    */

    // "=" is hit for the first time.
    if (trailingDigitRegexp.test(inputString)) {
        // console.log(inputString);
        // capture last operation for potential "replay" of "=" (see next case):
        lastOperation = trailingDigitRegexp.exec(inputString)[0];
        calcResult = calcCaptureAndResetStrings(inputString);
   
    } else if (displayString == '' && calcResult != '') {
        // "=" has just been hit an Nth time.
        // console.log("case2 " + inputString);
        inputString = calcResult + lastOperation;
        calcResult = calcCaptureAndResetStrings(inputString);
        
    } else if (/\D$/.test(inputString)) { 
        // string has trailing op -> ~this is a syntax error~ ignore
        // calcCaptureAndResetStrings('', throwError=true);
        return false;
    } else { 
        // string is non-empty but has no op: display it as the identity
        // and clear lastOperation
        // console.log("case3: " + inputString);
        calcCaptureAndResetStrings(inputString);
        lastOperation = '';
    }

    return false;

});