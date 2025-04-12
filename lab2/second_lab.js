function decimalToBinary(num, length) {
    let binary = '';
    for (let i = 0; i < length; i++) {
        binary = (num % 2) + binary;
        num = Math.floor(num / 2);
    }
    return binary;
}

function parseExpression(expr) {
    const variables = [...new Set([...expr].filter(c => /[abcde]/.test(c)))].sort();
    expr = expr.replace(/\s+/g, '');
    expr = expr.replace(/∨/g, '|').replace(/∧/g, '&');
    expr = expr.replace(/->|→/g, '>').replace(/~|∼/g, '=');
    expr = expr.replace(/¬/g, '!');
    return [variables, expr];
}

function evaluatePostfix(postfix, values) {
    const stack = [];
    for (const token of postfix) {
        if (token === '!') {
            const a = stack.pop();
            stack.push(1 - a);
        } else if (['&', '|', '>', '='].includes(token)) {
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case '&':
                    stack.push(a & b);
                    break;
                case '|':
                    stack.push(a | b);
                    break;
                case '>':
                    stack.push(a === 1 && b === 0 ? 0 : 1);
                    break;
                case '=':
                    stack.push(a === b ? 1 : 0);
                    break;
            }
        } else {
            stack.push(values[token]);
        }
    }
    return stack[0];
}

function shuntingYard(expr) {
    const precedence = { '!': 4, '&': 3, '|': 2, '>': 1, '=': 1 };
    const output = [];
    const stack = [];

    for (let i = 0; i < expr.length; i++) {
        const c = expr[i];
        if (/[abcde]/.test(c)) {
            output.push(c);
        } else if (c === '(') {
            stack.push(c);
        } else if (c === ')') {
            while (stack[stack.length - 1] !== '(') {
                output.push(stack.pop());
            }
            stack.pop();
        } else if (c === '!') {
            stack.push(c);
        } else {
            while (
                stack.length > 0 &&
                stack[stack.length - 1] !== '(' &&
                precedence[stack[stack.length - 1]] >= precedence[c]
            ) {
                output.push(stack.pop());
            }
            stack.push(c);
        }
    }

    while (stack.length > 0) {
        output.push(stack.pop());
    }

    return output;
}

function generateTruthTable(variables, postfix) {
    const n = variables.length;
    const table = [];
    for (let i = 0; i < 2 ** n; i++) {
        const combo = Array.from({ length: n }, (_, j) => (i >> (n - 1 - j)) & 1);
        const values = Object.fromEntries(variables.map((v, idx) => [v, combo[idx]]));
        const result = evaluatePostfix(postfix, values);
        table.push([combo, result]);
    }
    return table;
}

function buildForms(table, variables) {
    const sdnf = [];
    const sknf = [];
    const numericSdnf = [];
    const numericSknf = [];
    let index = 0;

    for (const [row, [combo, res]] of table.entries()) {
        index = (index << 1) | res;

        if (res === 1) {
            numericSdnf.push(row.toString());
            const terms = combo.map((val, idx) => `${val ? '' : '¬'}${variables[idx]}`);
            sdnf.push('(' + terms.join(' ∧ ') + ')');
        }

        if (res === 0) {
            numericSknf.push(row.toString());
            const terms = combo.map((val, idx) => `${val ? '¬' : ''}${variables[idx]}`);
            sknf.push('(' + terms.join(' ∨ ') + ')');
        }
    }

    return {
        sdnf: sdnf.join(' ∨ '),
        sknf: sknf.join(' ∧ '),
        numeric_sdnf: numericSdnf.join(', '),
        numeric_sknf: numericSknf.join(', '),
        index: `${index} (${decimalToBinary(index, table.length)})`,
    };
}

module.exports = {
    decimalToBinary,
    parseExpression,
    evaluatePostfix,
    shuntingYard,
    generateTruthTable,
    buildForms,
};