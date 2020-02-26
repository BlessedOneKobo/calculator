class CalculatorEvaluation {
  constructor() {
    this.operands = [0];
    this.operator = '';
    this.divideByZeroError = false;
  }

  // Evaluate expression
  evaluate(displayObj) {
    let result;

    switch(this.operator) {
      case 'add': result = this.add();          break;
      case 'sub': result = this.sub();          break;
      case 'mul': result = this.mul();          break;
      case 'div': result = this.div();          break;
      default:    result = this.operands.pop(); break;
    }

    this.clear();
    displayObj.clear();
    return result;
  }

  // Addition helper
  add() {
    return this.operands[0] + this.operands[1];
  }

  // Subtraction helper
  sub() {
    return this.operands[0] - this.operands[1];
  }

  // Multiplication helper
  mul() {
    return this.operands[0] * this.operands[1];
  }

  // Division helper; Returns undefined for division by zero
  div() {
    if (this.operands[1] === 0) {
      return undefined;
    }

    return this.operands[0] / this.operands[1];
  }

  // Reset evaluation object
  clear(displayObj, operatorBtns) {
    this.operands = [];
    this.operator = '';
    this.divideByZeroError = false;
  }
}

class CalculatorDisplay {
  constructor(domObj, maxDisplayDigits) {
    this.str = '0';
    this.domObj = domObj;
    this.maxDisplayDigits = maxDisplayDigits;
    this.show();
  }

  // Display error message
  showError(errorMsg) {
    this.str = '0';
    this.show(errorMsg);
  }

  // Display number
  showNumber(num) {
    this.str = String(num);
    this.show();
  }

  // Display number input from calculator button
  showNumberFromButton(numStr, previousClick) {
    // Check if clicked number should be displayed as is or appended
    if (previousClick.type === 'decimal' || this.str !== '0') {
      if (this.canBeDisplayed(this.str + numStr)) {
        this.str += numStr;
      }
    } else {
      this.str = numStr;
    }
    
    return this;
  }

  // Append decimal point to display
  showDecimalPoint(previousClick) {
    if (previousClick.type === 'operator') {
      this.clear();
    }

    if (!this.str.includes('.')) {
      this.str += '.';
    }

    return this;
  }

  // TODO - Disable backspace for calculation result
  // Delete a single digit from display
  removeCharacter() {
    if (
      (this.str.length === 2 && this.str.startsWith('-'))
      || this.str.length < 2
    ) {
      this.str = '0';
    } else {
      this.str = this.str.slice(0, this.str.length - 1);
    }

    this.show();
  }

  // Check if a given string will fit on the display
  canBeDisplayed(str) {
    let strLen;
    if (str.includes('.')) {
      process this.checkFloat(str);
      strLen = str.length - 1;
    } else {
      strLen = str.length;
    }

    return strLen <= this.maxDisplayDigits;
  }

  // Try and fit a floating point number on the display
  processFloat(floatStr) {
    const numDigits = floatStr.length - 1;
    const numDigitsWholeNumber = floatStr.split('.')[0].length;

    if (numDigits > this.maxDisplayDigits) {
      let decimalPlaces = displayObj.maxDisplayDigits - numDigitsWholeNumber;
      decimalPlaces = (decimalPlaces < 0) ? 0 : decimalPlaces;
      floatStr = Number(floatStr).toFixed(decimalPlaces);
    }

    return floatStr;
  }

  // Push a string to the display
  show(str) {
    this.domObj.textContent = str || this.str;
  }

  // Clear display contents
  clear() {
    this.str = '0';
    this.domObj.textContent = this.str;
  }
}

// ---| INITIALIZATION |---

// DOM ELEMENTS
const numberDisplay = document.querySelector('.display > .number');
const numberBtns = document.querySelectorAll('button[data-type="number"]');
const operatorBtns = document.querySelectorAll('button[data-type="operator"]');
const utilityBtns = document.querySelectorAll('button[data-type="utility"]');

// CUSTOM OBJECTS
const previousClick = {type: null};
const evalObj = new CalculatorEvaluation();
const displayObj = new CalculatorDisplay(numberDisplay, 9);

// ---| EVENT LISTENERS |---
numberBtns.forEach((btn) => {
  btn.addEventListener('click', handleNumberClick)
});
operatorBtns.forEach((btn) => {
  btn.addEventListener('click', handleOperatorClick)
});
utilityBtns.forEach((btn) => {
  btn.addEventListener('click', handleUtilityClick)
});

// ---| EVENT HANDLERS |---

function handleNumberClick(e) {
  const clickedNumber = e.target.textContent;

  if (previousClick.type === 'operator') {
    if (evalObj.divideByZeroError) {
      disableButtonCollection(operatorBtns);
    }

    displayObj.clear();
  }

  displayObj.showNumberFromButton(clickedNumber, previousClick).show();
  previousClick.type = 'number';
}

function handleOperatorClick(e) {
  const clickedOperator = e.target.dataset.key;

  if (previousClick.type === 'number') {
    const newOperand = Number(displayObj.str);
    evalObj.operands.push(newOperand);
  }

  if (evalObj.operands.length === 2 || clickedOperator === 'equ') {
    const result = evalObj.evaluate(displayObj);
    determineDisplayAction(result);
  }

  evalObj.operator = clickedOperator;
  previousClick.type = 'operator';
}

function handleUtilityClick(e) {
  const clickedUtility = e.target.dataset.key;

  switch(clickedUtility) {
    case 'cls':
      displayObj.clear();
      evalObj.clear();
      enableButtonCollection(operatorBtns, numberBtns, utilityBtns);
      break;
    case 'dec':
      displayObj.showDecimalPoint(previousClick);
      break;
    case 'bck':
      displayObj.removeCharacter();
      break;
  }
}

// ---| CALCULATOR UTILITIES |---

function determineDisplayAction(result) {
  let resultStr = String(result);

  if (result === undefined) {
    resultStr = 'Cannot divide by zero';
  } else {
    resultStr = displayObj.canBeDisplayed(resultStr) ? resultStr : 'Overflow';
  }

  if (!isNaN(resultStr)) {
    displayObj.showNumber(resultStr);
    evalObj.operands.push(Number(resultStr));
  } else {
    displayObj.showError(resultStr);
    disableButtonCollection(operatorBtns, numberBtns, utilityBtns);
    document.querySelector('[data-key="cls"]').disabled = false;
  }
}

function disableButtonCollection(...btnCollection) {
  btnCollection.forEach((group) => {
    group.forEach((btn) => btn.disabled = true);
  });
}

function enableButtonCollection(...btnCollection) {
  btnCollection.forEach((group) => {
    group.forEach((btn) => btn.disabled = false);
  });
}
