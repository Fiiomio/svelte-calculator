// +server.ts

import type { Request, Response } from '@sveltejs/kit';

export async function get({ query }: Request): Promise<Response> {
    const expression = query.get('expression');
    const result = evaluateExpression(expression);

    return {
        body: JSON.stringify({ result }),
    };
}

// Helper function to check if a character is an operator
function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

// Helper function to perform arithmetic operations
function applyOperator(operator, operand1, operand2) {
    switch (operator) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            return operand1 / operand2;
    }
}

// Function to evaluate a mathematical expression
function evaluateExpression(expression) {
    const tokens = expression.split(' ');

    const valuesStack = [];
    const operatorsStack = [];

    tokens.forEach((token) => {
        if (!isNaN(token)) {
            valuesStack.push(parseFloat(token));
        } else if (isOperator(token)) {
            while (
                operatorsStack.length > 0 &&
                getPrecedence(operatorsStack[operatorsStack.length - 1]) >= getPrecedence(token)
            ) {
                const operator = operatorsStack.pop();
                const operand2 = valuesStack.pop();
                const operand1 = valuesStack.pop();
                const result = applyOperator(operator, operand1, operand2);
                valuesStack.push(result);
            }
            operatorsStack.push(token);
        }
    });

    while (operatorsStack.length > 0) {
        const operator = operatorsStack.pop();
        const operand2 = valuesStack.pop();
        const operand1 = valuesStack.pop();
        const result = applyOperator(operator, operand1, operand2);
        valuesStack.push(result);
    }

    return valuesStack[0];
}

// Helper function to get the precedence of an operator
function getPrecedence(operator) {
    if (operator === '+' || operator === '-') return 1;
    if (operator === '*' || operator === '/') return 2;
    return 0;
}
