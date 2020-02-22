let operands = [];
let operator = '';
let displayValue = 0;
let previousClick = '';

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
    clearDisplay();
  }

  displayValue = displayValue * 10 + Number(e.target.textContent);
  numberDisplay.textContent = displayValue;
  previousClick = 'number';
}

function handleOperatorClick(e) {
  if (previousClick === 'number') {
    operands.push(displayValue);
  }

  if (operands.length === 2) {
    displayValue = operate(operands, operator);
    numberDisplay.textContent = displayValue;
    operands.push(displayValue);
  }

  operator = e.target.dataset.key;
  previousClick = 'operator';
}

function handleReset() {
  displayValue = 0;
  numberDisplay.textContent = displayValue;
  operands = [];
  operator = '';
}

// Calculator Operators/Utilities

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
  return a / b;
}
