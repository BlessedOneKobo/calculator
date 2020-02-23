const maxDisplayDigits = 9;
let displayValue = 0;
let operands = [displayValue];
let operator = '';
let previousClick = '';
let divideByZeroFlag = false;

// Calculator components

const numberDisplay = document.querySelector('.display > .number');
numberDisplay.textContent = displayValue;
const numberBtns = document.querySelectorAll('button[data-type="number"]');
const operatorBtns = document.querySelectorAll('button[data-type="operator"]');
const clearBtn = document.querySelector('button[data-key="clear"]');

// Event listeners

numberBtns.forEach((btn) => btn.addEventListener('click', handleNumberClick));
operatorBtns.forEach((btn) => btn.addEventListener('click', handleOperatorClick));
clearBtn.addEventListener('click', handleReset);

// Event handlers

function handleNumberClick(e) {
  if (previousClick === 'operator') {
    if (divideByZeroFlag) {
      operatorBtns.forEach((btn) => btn.disabled = false);
      divideByZeroFlag = false;
    }

    clearDisplay();
  }

  const temp = displayValue * 10 + Number(e.target.textContent);
  if (canBeDisplayed(temp)) {
    displayValue = temp;
    numberDisplay.textContent = displayValue;
  }

  previousClick = 'number';
}

function handleOperatorClick(e) {
  const clickedOperator = e.target.dataset.key;
  if (previousClick === 'number') {
    operands.push(displayValue);
  }

  if (operands.length === 2 || clickedOperator === 'equ') {
    let result = operate(operands, operator);

    if (result === undefined) {
      // Handle division by zero
      displayValue = 0;
      divideByZeroFlag = true;
      numberDisplay.textContent = 'Cannot divide by zero';
      operatorBtns.forEach((btn) => btn.disabled = true);
    } else if (!canBeDisplayed(result)) {
      // Handle integer overflow
      displayValue = 0;
      numberDisplay.textContent = 'Overflow';
      operatorBtns.forEach((btn) => btn.disabled = true);
    } else {
      const resultStr = String(result);

      // Handle floating point output
      if (resultStr.includes('.')) {
        const numDigits = resultStr.length - 1;
        const numDigitsWholeNumber = resultStr.split('.')[0].length;

        if (numDigits > maxDisplayDigits) {
          const decimalPlaces = maxDisplayDigits - numDigitsWholeNumber;
          if (decimalPlaces < 0) {
            result = Number(result.toFixed(0));
          } else {
            result = Number(result.toFixed(decimalPlaces));
          }
        }
      }

      // Save result and display it
      operands.push(result);
      displayValue = result;
      numberDisplay.textContent = displayValue;
    }
  }

  operator = clickedOperator;
  previousClick = 'operator';
}

function handleReset() {
  displayValue = 0;
  numberDisplay.textContent = displayValue;
  operands = [];
  operator = '';
  operatorBtns.forEach((btn) => btn.disabled = false);
}

// Calculator Operators/Utilities

function canBeDisplayed(number) {
  const minInt = 0;
  const maxInt = 999999999;
  return minInt <= number && number <= maxInt;
}

function clearDisplay() {
  displayValue = 0;
  numberDisplay.textContent = displayValue;
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

  handleReset();
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
