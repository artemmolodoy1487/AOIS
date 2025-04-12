const {
    decimalToBinary,
    binaryToDecimal,
    getPositiveCode,
    getNegativeCode,
    getReverseCode,
    getAdditionalCode,
    addInAdditionalCode,
    subtractInAdditionalCode,
    multiplyInDirectCode,
    divideInDirectCode,
    convertFloatToIEEE754,
    ieee754ToDecimal,
    addIEEE754,
    twosComplementToDecimal
} = require('./run');

describe('Test Binary Arithmetic', () => {
    test('decimalToBinary', () => {
        expect(decimalToBinary(5, 8)).toBe("00000101");
        expect(decimalToBinary(0, 8)).toBe("00000000");
        expect(decimalToBinary(15, 8)).toBe("00001111");
    });

    test('binaryToDecimal', () => {
        expect(binaryToDecimal("00000101")).toBe(5);
        expect(binaryToDecimal("00001111")).toBe(15);
    });

    test('getPositiveCode', () => {
        expect(getPositiveCode(5, 8)).toBe("00000101");
    });

    test('getNegativeCode', () => {
        expect(getNegativeCode(-5, 8)).toBe("10000101");
    });

    test('getReverseCode', () => {
        expect(getReverseCode(-5, 8)).toBe("11111010");
    });

    test('getAdditionalCode', () => {
        expect(getAdditionalCode(-5, 8)).toBe("11111011");
        expect(getAdditionalCode(5, 8)).toBe("00000101");
    });

    test('addInAdditionalCode', () => {
        const sumCode = addInAdditionalCode(5, -3, 8);
        expect(twosComplementToDecimal(sumCode)).toBe(2);
    });

    test('subtractInAdditionalCode', () => {
        const subCode = subtractInAdditionalCode(2, 3, 8);
        expect(twosComplementToDecimal(subCode)).toBe(-1);
    });

    test('multiplyInDirectCode', () => {
        const mulCode = multiplyInDirectCode(5, -3, 8);

        function directCodeToDecimal(directStr) {
            if (directStr[0] === '0') {
                return binaryToDecimal(directStr.slice(1));
            } else {
                return -binaryToDecimal(directStr.slice(1));
            }
        }

        expect(directCodeToDecimal(mulCode)).toBe(-15);
    });

    test('divideInDirectCode', () => {
        const [divBin, divDec] = divideInDirectCode(7, -3, 5, 8);
        expect(divDec).toBeCloseTo(-2.3125, 3);
    });
});

describe('Test IEEE754 Functions', () => {
    test('convertAndRevert', () => {
        const testValues = [1.0, 3.3, 4.9, 0.15625, 123.456];
        for (const value of testValues) {
            const ieee = convertFloatToIEEE754(value);
            const dec = ieee754ToDecimal(ieee);
            expect(dec).toBeCloseTo(value, 4);
        }
    });

    test('addition', () => {
        const a = 3.3;
        const b = 4.9;
        const ieeeA = convertFloatToIEEE754(a);
        const ieeeB = convertFloatToIEEE754(b);
        const ieeeSum = addIEEE754(ieeeA, ieeeB);
        const decSum = ieee754ToDecimal(ieeeSum);
        const expectedSum = a + b;
        expect(decSum).toBeCloseTo(expectedSum, 4);
    });

    test('ieeeFormat', () => {
        const a = 3.3;
        const ieee = convertFloatToIEEE754(a);
        expect(ieee.length).toBe(32);
        expect([...ieee].every(bit => bit === '0' || bit === '1')).toBe(true);
    });
});