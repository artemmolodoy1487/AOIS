function decimalToBinary(n, bitLength = null) {
    if (n === 0) {
        return bitLength ? '0'.padStart(bitLength, '0') : '0';
    }
    let binary = [];
    while (n > 0) {
        binary.push((n % 2).toString());
        n = Math.floor(n / 2);
    }
    let binaryStr = binary.reverse().join('');
    if (bitLength) {
        binaryStr = binaryStr.padStart(bitLength, '0');
    }
    return binaryStr;
}

function binaryToDecimal(binaryStr) {
    let decimal = 0;
    for (let i = 0; i < binaryStr.length; i++) {
        decimal += parseInt(binaryStr[i]) * Math.pow(2, binaryStr.length - 1 - i);
    }
    return decimal;
}

function twosComplementToDecimal(binaryStr) {
    const bitLength = binaryStr.length;
    const unsignedVal = binaryToDecimal(binaryStr);
    if (binaryStr[0] === '0') {
        return unsignedVal;
    } else {
        return unsignedVal - (1 << bitLength);
    }
}

function getPositiveCode(n, bitLength) {
    const binaryStr = decimalToBinary(n, bitLength - 1);
    return '0' + binaryStr.padStart(bitLength - 1, '0');
}

function getNegativeCode(n, bitLength) {
    const binaryStr = decimalToBinary(Math.abs(n), bitLength - 1);
    return '1' + binaryStr.padStart(bitLength - 1, '0');
}

function getReverseCode(n, bitLength) {
    if (n >= 0) {
        return getPositiveCode(n, bitLength);
    }
    const posCode = decimalToBinary(Math.abs(n), bitLength - 1);
    const inverted = Array.from(posCode).map(bit => bit === '0' ? '1' : '0').join('');
    return '1' + inverted.padStart(bitLength - 1, '0');
}

function getAdditionalCode(n, bitLength) {
    if (n >= 0) {
        return getPositiveCode(n, bitLength);
    }
    const rev = getReverseCode(n, bitLength);
    let carry = 1;
    let additional = [];
    for (let i = rev.length - 1; i >= 0; i--) {
        const total = parseInt(rev[i]) + carry;
        additional.push((total % 2).toString());
        carry = Math.floor(total / 2);
    }
    return additional.reverse().join('').padStart(bitLength, '0');
}

function addInAdditionalCode(a, b, bitLength) {
    const aCode = getAdditionalCode(a, bitLength).padStart(bitLength, '0');
    const bCode = getAdditionalCode(b, bitLength).padStart(bitLength, '0');
    let result = [];
    let carry = 0;
    for (let i = bitLength - 1; i >= 0; i--) {
        const total = parseInt(aCode[i]) + parseInt(bCode[i]) + carry;
        result.push((total % 2).toString());
        carry = Math.floor(total / 2);
    }
    return result.reverse().join('').padStart(bitLength, '0');
}

function subtractInAdditionalCode(a, b, bitLength) {
    return addInAdditionalCode(a, -b, bitLength);
}

function multiplyInDirectCode(a, b, bitLength) {
    const signA = a >= 0 ? '0' : '1';
    const signB = b >= 0 ? '0' : '1';
    const magA = decimalToBinary(Math.abs(a), bitLength - 1);
    const magB = decimalToBinary(Math.abs(b), bitLength - 1);
    let product = "0";
    for (let i = magB.length - 1; i >= 0; i--) {
        if (magB[i] === '1') {
            const partial = magA + "0".repeat(magB.length - 1 - i);
            product = binaryAdd(product, partial);
        }
    }
    product = product.padStart(bitLength - 1, '0');
    const resultSign = signA === signB ? '0' : '1';
    return resultSign + product;
}

function divideInDirectCode(a, b, precision = 5, intBitLength = 8) {
    if (b === 0) {
        return ["Ошибка: деление на ноль", null];
    }
    const resultSign = (a >= 0 && b > 0) || (a < 0 && b < 0) ? '0' : '1';
    let dividend = decimalToBinary(Math.abs(a));
    const divisor = decimalToBinary(Math.abs(b));
    let quotient = "";
    let temp = "";
    for (const bit of dividend) {
        temp += bit;
        temp = temp.replace(/^0+/, '');
        if (!temp) temp = "0";
        if (binaryCompare(temp, divisor) >= 0) {
            quotient += "1";
            temp = binarySubtract(temp, divisor);
        } else {
            quotient += "0";
        }
    }
    quotient = quotient.replace(/^0+/, '') || "0";
    let remainder = temp;
    let fractional = "";
    for (let i = 0; i < precision; i++) {
        remainder += "0";
        remainder = remainder.replace(/^0+/, '') || "0";
        if (binaryCompare(remainder, divisor) >= 0) {
            fractional += "1";
            remainder = binarySubtract(remainder, divisor);
        } else {
            fractional += "0";
        }
    }
    const intPart = quotient.padStart(intBitLength - 1, '0');
    const directInt = resultSign + intPart;
    const finalResult = directInt + "." + fractional;
    const decInt = binaryToDecimal(quotient);
    let fracVal = 0;
    for (let i = 0; i < fractional.length; i++) {
        if (fractional[i] === "1") {
            fracVal += 1 / Math.pow(2, i + 1);
        }
    }
    const decResult = decInt + fracVal;
    return [finalResult, resultSign === '1' ? -decResult : decResult];
}

function binaryAdd(a, b) {
    const maxLen = Math.max(a.length, b.length);
    a = a.padStart(maxLen, '0');
    b = b.padStart(maxLen, '0');
    let carry = 0;
    let result = "";
    for (let i = maxLen - 1; i >= 0; i--) {
        const sumBit = (a[i] === '1' ? 1 : 0) + (b[i] === '1' ? 1 : 0) + carry;
        result = (sumBit % 2 === 1 ? '1' : '0') + result;
        carry = sumBit >= 2 ? 1 : 0;
    }
    if (carry) result = '1' + result;
    return result;
}

function binarySubtract(a, b) {
    const maxLen = Math.max(a.length, b.length);
    a = a.padStart(maxLen, '0');
    b = b.padStart(maxLen, '0');
    let result = "";
    let borrow = 0;
    for (let i = maxLen - 1; i >= 0; i--) {
        let diff = (a[i] === '1' ? 1 : 0) - (b[i] === '1' ? 1 : 0) - borrow;
        if (diff < 0) {
            diff += 2;
            borrow = 1;
        } else {
            borrow = 0;
        }
        result = (diff === 1 ? '1' : '0') + result;
    }
    result = result.replace(/^0+/, '') || "0";
    return result;
}

function binaryCompare(a, b) {
    a = a.replace(/^0+/, '');
    b = b.replace(/^0+/, '');
    if (a.length > b.length) return 1;
    if (a.length < b.length) return -1;
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
}

function convertFloatToIEEE754(num) {
    let signBit = "0";
    if (num < 0) {
        signBit = "1";
        num = -num;
    }
    const intPart = Math.floor(num);
    const fracPart = num - intPart;
    let binInt = "";
    if (intPart === 0) {
        binInt = "0";
    } else {
        let temp = intPart;
        while (temp > 0) {
            binInt = (temp % 2) + binInt;
            temp = Math.floor(temp / 2);
        }
    }
    let binFrac = "";
    let tempFrac = fracPart;
    for (let i = 0; i < 30; i++) {
        tempFrac *= 2;
        if (tempFrac >= 1) {
            binFrac += "1";
            tempFrac -= 1;
        } else {
            binFrac += "0";
        }
    }
    let exponent, mantissa;
    if (binInt !== "0") {
        exponent = binInt.length - 1;
        mantissa = (binInt.slice(1) + binFrac).slice(0, 23).padEnd(23, '0');
    } else {
        let index = 0;
        while (index < binFrac.length && binFrac[index] === "0") index++;
        if (index === binFrac.length) {
            exponent = -127;
            mantissa = "0".repeat(23);
        } else {
            exponent = -(index + 1);
            mantissa = binFrac.slice(index + 1, index + 1 + 23).padEnd(23, '0');
        }
    }
    const expVal = exponent + 127;
    let expBits = "";
    let tempExp = expVal;
    for (let i = 0; i < 8; i++) {
        expBits = (tempExp % 2) + expBits;
        tempExp = Math.floor(tempExp / 2);
    }
    return signBit + expBits + mantissa;
}

function ieee754ToDecimal(ieee) {
    const sign = ieee[0] === "0" ? 1 : -1;
    let exponent = 0;
    for (let i = 1; i <= 8; i++) {
        exponent = exponent * 2 + (ieee[i] === "1" ? 1 : 0);
    }
    exponent -= 127;
    let mantissa = 1.0;
    const fracBits = ieee.slice(9);
    let power = 0.5;
    for (const bit of fracBits) {
        if (bit === "1") mantissa += power;
        power /= 2;
    }
    return sign * mantissa * Math.pow(2, exponent);
}

function addIEEE754(bin1, bin2) {
    const sign1 = bin1[0] === '0' ? 0 : 1;
    const sign2 = bin2[0] === '0' ? 0 : 1;
    let exp1 = 0, exp2 = 0;
    for (let i = 1; i <= 8; i++) {
        exp1 = exp1 * 2 + (bin1[i] === "1" ? 1 : 0);
        exp2 = exp2 * 2 + (bin2[i] === "1" ? 1 : 0);
    }
    let mant1 = (1 << 23) + parseInt(bin1.slice(9), 2);
    let mant2 = (1 << 23) + parseInt(bin2.slice(9), 2);
    let exp = exp1;
    if (exp1 > exp2) {
        const shift = exp1 - exp2;
        mant2 >>= shift;
    } else if (exp2 > exp1) {
        const shift = exp2 - exp1;
        mant1 >>= shift;
        exp = exp2;
    }
    let resultMant, resultSign;
    if (sign1 === sign2) {
        resultMant = mant1 + mant2;
        resultSign = sign1;
    } else {
        if (mant1 >= mant2) {
            resultMant = mant1 - mant2;
            resultSign = sign1;
        } else {
            resultMant = mant2 - mant1;
            resultSign = sign2;
        }
    }
    if (resultMant === 0) return "0".repeat(32);
    while (resultMant >= (1 << 24)) {
        resultMant >>= 1;
        exp += 1;
    }
    while (resultMant < (1 << 23)) {
        resultMant <<= 1;
        exp -= 1;
    }
    const frac = resultMant - (1 << 23);
    let expBits = "";
    let tempExp = exp;
    for (let i = 0; i < 8; i++) {
        expBits = ((tempExp % 2) === 1 ? "1" : "0") + expBits;
        tempExp = Math.floor(tempExp / 2);
    }
    let fracBits = "";
    for (let i = 0; i < 23; i++) {
        const bit = (frac >> (22 - i)) & 1;
        fracBits += bit === 1 ? "1" : "0";
    }
    return (resultSign === 0 ? "0" : "1") + expBits + fracBits;
}

module.exports = {
    decimalToBinary,
    binaryToDecimal,
    twosComplementToDecimal,
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
};