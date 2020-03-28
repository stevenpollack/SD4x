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

var trailingDigitRegexp = /[+*\-\/]0*\.?\d+$/; // op0*(.|)dddddd
var inputString = '';
var histArray = [];
var displayString = '';
var lastOperation = '';
var calcResult = '';

// the only buttons with value attributes are digits
// they modify the input string, and nothing else
$('button[value]').click(function(){
    inputString += $(this).val();
    displayString += $(this).val(); 
    displayVal(displayString);
});

// have C clear input string and display
$('#clearButton').click(function(){
    inputString = '';
    displayString = '';
    displayVal('');
});

var opDict = {
    subtractButton: "-",
    addButton: "+",
    multiplyButton: "*",
    divideButton: "/"
};
// need to fix bug with + when starting fresh

// create a function factory to handle +-*/ button events
var opButtonHandler = function(buttonId) {
    return function() {
        if (inputString == '') { // do nothing since this would be syntactically wrong
            return false;
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
    }
};

for (var buttonId in opDict) {
    $('#' + buttonId).click(opButtonHandler(buttonId));
};

var calcCaptureAndResetStrings = function(evalString) {
    calcResult = eval(evalString);
    displayVal(calcResult);
    $('ol.history').prepend(`<li>${inputString} = ${calcResult}</li>`);
    histArray.push(inputString);
    // set inputString to calcResult so that we can chain future calculations
    inputString = calcResult;
    displayString = '';
    return calcResult;
}

// have "=" evaluate inputString
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
        console.log(inputString);
        // capture last operation for potential "replay" of "=" (see next case):
        lastOperation = trailingDigitRegexp.exec(inputString)[0];
        calcResult = calcCaptureAndResetStrings(inputString);
   
    } else if (displayString == '' && calcResult != '') {
        // "=" has just been hit an Nth time.
        inputString = calcResult + lastOperation;
        calcResult = calcCaptureAndResetStrings(inputString);

    } else if (/\D$/.test(inputString)) { 
        // string has trailing op -> this is a syntax error
        displayVal("SYNTAX ERROR: " + inputString);
    } else { 
        // string is non-empty but has no op: display it as the identity
        calcCaptureAndResetStrings(inputString);
    }

    return false;

});


// capture button presses
$('button').click(function() {
    return false; // short circuit
    var buttonValue = $(this).val();

    if (buttonValue) { // only numbers have truthy val's
        inputString += buttonValue;
        displayValue += buttonValue;
        $('#display').val(displayValue); 
        return false;
    }
    
    var buttonId = $(this).attr('id');

    if (buttonId == 'equalsButton') {
        // memory: extract the last "...(+|-|*|/)digit" in the inputStack
        lastOperation = /\D\d*$/.exec(inputString);
        if (lastOperation != null) {
            lastOperation = lastOperation[0];
        } else {
            lastOperation = '';
        }
        // display the evaluation of our arithmetic operations
        $('#display').val(eval(inputString));
        // clear display for next operation
        displayValue = '';
        return false;

    } else if (buttonId == 'clearButton') {
        displayValue = '';
        $('#display').val(displayValue);
        inputString = displayValue;
        return false; // break early
    }

    /*
    1. Need to make sure the display clears between inputed numbers.
    E.g. 2 > * > CLEAR > 11 > = > CLEAR > 22
    2. Need to make sure back-to-back ops clober.
    E.g. 2 > + > - > 1 === 2 > - > 1
    */
    // two back-to-back ops clobber:
    var operand;
    switch (buttonId) {
        case 'addButton': operand = '+'; break;
        case 'subtractButton': operand = '-'; break;
        case 'multiplyButton': operand = '*'; break;
        case 'divideButton': operand = '/'; break;
    }

    // an operand has been punched so clear the display value
    displayValue = '';

    // either inputStack has a trailing digit or operand
    if (/\d$/.test(inputString)) {
        // trailing digit: collapse current expression
        //inputStack = eval(inputStack);
        inputString += operand;
    } else {
        // replace trailing operands: (\D is non-digit symbol)
        inputString = inputString.replace(/\D$/, operand);
    }


    // debugging:
    $('#output').html(inputString);
});

// need to handle collapsing of string
// when people do x + =...
