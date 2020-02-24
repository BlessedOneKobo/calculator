const maxDisplayDigits = 9;
let displayStr = '0';

let operands = [0];
let operator = '';
let previousClick = '';
let divideByZeroFlag = false;

// Calculator components

const numberDisplay = document.querySelector('.display > .number');
numberDisplay.textContent = displayStr;
const numberBtns = document.querySelectorAll('button[data-type="number"]');
const operatorBtns = document.querySelectorAll('button[data-type="operator"]');
const utilityBtns = document.querySelectorAll('button[data-type="utility"]');

// Event listeners

numberBtns.forEach((btn) => {
  btn.addEventListener('click', handleNumberClick)
});
operatorBtns.forEach((btn) => {
  btn.addEventListener('click', handleOperatorClick)
});
utilityBtns.forEach((btn) => {
  btn.addEventListener('click', handleUtilityClick)
});

// Event handlers

function handleNumberClick(e) {
  const clickedNumber = e.target.textContent;

  if (previousClick === 'operator') {
    if (divideByZeroFlag) {
      operatorBtns.forEach((btn) => btn.disabled = false);
      divideByZeroFlag = false;
    }

    clearDisplay();
  }

  // Check if clicked number should be displayed as is or appended
  if (previousClick === 'decimal' || displayStr !== '0') {
    displayStr += clickedNumber;
  } else {
    displayStr = clickedNumber;
  }

  // Don't display if number is too big (i.e leave previous value)
  if (canBeDisplayed(displayStr)) {
    numberDisplay.textContent = displayStr;
  }

  previousClick = 'number';
}

function handleOperatorClick(e) {
  let hasOverflowed = false;
  const clickedOperator = e.target.dataset.key;
  if (previousClick === 'number') {
    operands.push(Number(displayStr));
  }

  if (operands.length === 2 || clickedOperator === 'equ') {
    const result = operate(operands, operator);
    displayStr = String(result);

    if (result === undefined) {
      // Handle division by zero
      displayStr = '0';
      divideByZeroFlag = true;
      numberDisplay.textContent = 'Cannot divide by zero';
    } else {
      hasOverflowed = !canBeDisplayed(displayStr);
      if (displayStr.includes('.')) {
        hasOverflowed = processFloatResult(result);
      }

      if (hasOverflowed) {
        displayStr = '0';
        numberDisplay.textContent = 'Overflow'
      } else {
        numberDisplay.textContent = displayStr;
      }

      operands.push(Number(displayStr));
    }

    if (divideByZeroFlag || hasOverflowed) {
      operatorBtns.forEach((btn) => btn.disable = true);
    }
  }

  operator = clickedOperator;
  previousClick = 'operator';
}

function handleUtilityClick(e) {
  const utilityType = e.target.dataset.key;

  switch(utilityType) {
    case 'cls': clearCalculator(); break;
    case 'dec': addDecimalPoint(); break;
  }
}

// Calculator Operators/Utilities

function processFloatResult(result) {
  const numDigits = displayStr.length - 1;
  const numDigitsWholeNumber = displayStr.split('.')[0].length;

  if (numDigits > maxDisplayDigits) {
    const decimalPlaces = maxDisplayDigits - numDigitsWholeNumber;
    displayStr = result.toFixed((decimalPlaces < 0) ? 0 : decimalPlaces);
  }

  return !canBeDisplayed(displayStr);
}

function canBeDisplayed(str) {
  const strLen = str.includes('.') ? str.length - 1 : str.length;
  return strLen <= maxDisplayDigits;
}

function clearDisplay() {
  displayStr = '0';
  numberDisplay.textContent = displayStr;
}

function clearCalculator() {
  // Reset display
  displayStr = '0';
  numberDisplay.textContent = displayStr;

  // Reset calculation utilities
  operands = [];
  operator = '';
  operatorBtns.forEach((btn) => btn.disabled = false);
}

function addDecimalPoint() {
  if (previousClick === 'operator') {
    clearDisplay();
  }

  if (!displayStr.includes('.')) {
    displayStr += '.';
  }

  previousClick = 'decimal';
}

function operate(operands, operator) {
  let result;

  switch(operator) {
    case 'add': result = add(...operands); break;
    case 'sub': result = sub(...operands); break;
    case 'mul': result = mul(...operands); break;
    case 'div': result = div(...operands); break;
    default:    result = operands.pop();   break;
  }

  clearCalculator();
  return result;
}

function add(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

function mul(a, b) {
  return a * b;
}

function div(a, b) {
  if (b === 0) {
    return undefined;
  }

  return a / b;
}
