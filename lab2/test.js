const { decimalToBinary, parseExpression, evaluatePostfix, shuntingYard, generateTruthTable, buildForms } = require('./second_lab');
const assert = require('assert');

describe('Logic Functions', () => {
    it('should convert decimal to binary', () => {
        assert.strictEqual(decimalToBinary(5, 4), '0101');
        assert.strictEqual(decimalToBinary(0, 3), '000');
        assert.strictEqual(decimalToBinary(7, 3), '111');
        assert.strictEqual(decimalToBinary(42, 8), '00101010');
    });

    it('should parse expressions', () => {
        assert.deepStrictEqual(parseExpression('(a∨b)∧¬c'), [['a', 'b', 'c'], '(a|b)&!c']);
        assert.deepStrictEqual(parseExpression('a→b∼c'), [['a', 'b', 'c'], 'a>b=c']);
        assert.deepStrictEqual(parseExpression('a ∧ (b | c)'), [['a', 'b', 'c'], 'a&(b|c)']);
    });

    it('should evaluate postfix expressions', () => {
        assert.strictEqual(evaluatePostfix(['a', 'b', '|'], { a: 1, b: 0 }), 1);
        assert.strictEqual(evaluatePostfix(['a', '!', 'b', '&'], { a: 1, b: 1 }), 0);
    });

    it('should implement Shunting Yard algorithm', () => {
        assert.deepStrictEqual(shuntingYard('a|b'), ['a', 'b', '|']);
        assert.deepStrictEqual(shuntingYard('!a&b'), ['a', '!', 'b', '&']);
        assert.deepStrictEqual(shuntingYard('(a|b)&c'), ['a', 'b', '|', 'c', '&']);
        assert.deepStrictEqual(shuntingYard('a|b&c'), ['a', 'b', 'c', '&', '|']);
    });

    it('should generate truth tables', () => {
        const variables = ['a'];
        const postfix = ['a', '!'];
        const table = generateTruthTable(variables, postfix);
        assert.deepStrictEqual(table, [[[0], 1], [[1], 0]]);
    });

    it('should build forms', () => {
        const table = [[[0], 0], [[1], 1]];
        const forms = buildForms(table, ['a']);
        assert.strictEqual(forms.sdnf, '(a)');
        assert.strictEqual(forms.sknf, '(a)');
        assert.strictEqual(forms.index, '1 (01)');
    });

    it('should handle full flow', () => {
        const [variables, parsedExpr] = parseExpression('a');
        const postfix = shuntingYard(parsedExpr);
        const table = generateTruthTable(variables, postfix);
        const forms = buildForms(table, variables);

        assert.strictEqual(forms.sdnf, '(a)');
        assert.strictEqual(forms.numeric_sdnf, '1');
        assert.strictEqual(forms.index, '1 (01)');
    });
});

if (require.main === module) {
    require('mocha').run();
}