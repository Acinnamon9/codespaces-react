import React, { useState } from 'react';
import './Calculator.css'; // We'll create this CSS file next

function Calculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [operand1, setOperand1] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand2, setWaitingForOperand2] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand2) {
      setDisplayValue(String(digit));
      setWaitingForOperand2(false);
    } else {
      // Prevent multiple leading zeros, handle initial '0'
      setDisplayValue(displayValue === '0' ? String(digit) : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    // Prevent adding decimal if already waiting for next operand
    if (waitingForOperand2) {
        setDisplayValue('0.');
        setWaitingForOperand2(false);
        return;
    }
    // Prevent adding multiple decimals
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearDisplay = () => {
    setDisplayValue('0');
    setOperand1(null);
    setOperator(null);
    setWaitingForOperand2(false);
  };

  const toggleSign = () => {
      setDisplayValue(prevValue => String(parseFloat(prevValue) * -1));
  }

  const inputPercent = () => {
      const currentValue = parseFloat(displayValue);
      if (currentValue === 0) return;
      setDisplayValue(String(currentValue / 100));
  }


  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(displayValue);

    // Handle sequence like 5 * - = -> should use 5 as operand2
    if (operand1 == null) {
      setOperand1(inputValue);
    } else if (operator) {
      // If there's already an operator, calculate the result first
      const result = calculate(operand1, inputValue, operator);
      setDisplayValue(String(result));
      setOperand1(result);
    }

    setWaitingForOperand2(true);
    setOperator(nextOperator);
  };

  const calculate = (op1, op2, op) => {
    switch (op) {
      case '+':
        return op1 + op2;
      case '-':
        return op1 - op2;
      case '*':
        return op1 * op2;
      case '/':
        // Handle division by zero (basic case)
        return op2 === 0 ? 'Error' : op1 / op2;
      default:
        return op2; // Should not happen with '=' handling
    }
  };

   const handleEquals = () => {
       const inputValue = parseFloat(displayValue);

       if (operand1 !== null && operator) {
           const result = calculate(operand1, inputValue, operator);
           setDisplayValue(String(result));
           // Prepare for next calculation chain (e.g., 5 + 3 = 8, then + 2 =)
           setOperand1(result); // Store result as new operand1
           // setOperand1(null); // Or uncomment this to reset after equals
           setOperator(null);
           setWaitingForOperand2(true); // Allow overwriting display on next digit
       }
       // If only a number is entered and = is pressed, do nothing or just keep the number
   }

  return (
    <div className="calculator">
      <div className="display">{displayValue}</div>
      <div className="keypad">
        <div className="keypad-row">
          <button className="key function" onClick={clearDisplay}>AC</button>
          <button className="key function" onClick={toggleSign}>+/-</button>
          <button className="key function" onClick={inputPercent}>%</button>
          <button className="key operator" onClick={() => performOperation('/')}>÷</button>
        </div>
        <div className="keypad-row">
          <button className="key digit" onClick={() => inputDigit(7)}>7</button>
          <button className="key digit" onClick={() => inputDigit(8)}>8</button>
          <button className="key digit" onClick={() => inputDigit(9)}>9</button>
          <button className="key operator" onClick={() => performOperation('*')}>×</button>
        </div>
        <div className="keypad-row">
          <button className="key digit" onClick={() => inputDigit(4)}>4</button>
          <button className="key digit" onClick={() => inputDigit(5)}>5</button>
          <button className="key digit" onClick={() => inputDigit(6)}>6</button>
          <button className="key operator" onClick={() => performOperation('-')}>−</button>
        </div>
        <div className="keypad-row">
          <button className="key digit" onClick={() => inputDigit(1)}>1</button>
          <button className="key digit" onClick={() => inputDigit(2)}>2</button>
          <button className="key digit" onClick={() => inputDigit(3)}>3</button>
          <button className="key operator" onClick={() => performOperation('+')}>+</button>
        </div>
        <div className="keypad-row">
          <button className="key digit zero" onClick={() => inputDigit(0)}>0</button>
          <button className="key digit" onClick={inputDecimal}>.</button>
          <button className="key operator" onClick={handleEquals}>=</button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;