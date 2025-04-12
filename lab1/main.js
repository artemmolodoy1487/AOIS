const readline = require('readline');

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    console.log("Введите два целых числа для анализа");

    // Ввод первого числа
    let num1 = await askQuestion("Первое число: ");
    while (isNaN(parseInt(num1))) {
        console.log("Ошибка! Введите целое число");
        num1 = await askQuestion("Первое число: ");
    }
    num1 = parseInt(num1);

    // Ввод второго числа
    let num2 = await askQuestion("Второе число: ");
    while (isNaN(parseInt(num2))) {
        console.log("Ошибка! Введите целое число");
        num2 = await askQuestion("Второе число: ");
    }
    num2 = parseInt(num2);

    const bitLength = 8;
    console.log(`\nБитовая длина представления: ${bitLength} бит`);

    // Вывод представлений для первого числа
    console.log("\nПредставления первого числа:");
    if (num1 > 0) {
        console.log(`Прямой код: ${getPositiveCode(num1, bitLength)}`);
    } else {
        console.log(`Прямой код: ${getNegativeCode(num1, bitLength)}`);
    }
    console.log(`Обратный код: ${getReverseCode(num1, bitLength)}`);
    console.log(`Дополнительный код: ${getAdditionalCode(num1, bitLength)}`);

    // Вывод представлений для второго числа
    console.log("\nПредставления второго числа:");
    if (num2 > 0) {
        console.log(`Прямой код: ${getPositiveCode(num2, bitLength)}`);
    } else {
        console.log(`Прямой код: ${getNegativeCode(num2, bitLength)}`);
    }
    console.log(`Обратный код: ${getReverseCode(num2, bitLength)}`);
    console.log(`Дополнительный код: ${getAdditionalCode(num2, bitLength)}`);

    // Арифметические операции
    console.log("\nРезультаты арифметических операций:");

    // Сложение
    const sumResult = addInAdditionalCode(num1, num2, bitLength);
    console.log(`\nСложение (${num1} + ${num2}):`);
    console.log(`Дополнительный код: ${sumResult}`);
    console.log(`Десятичный результат: ${twosComplementToDecimal(sumResult)}`);

    // Вычитание
    const subResult = subtractInAdditionalCode(num1, num2, bitLength);
    console.log(`\nВычитание (${num1} - ${num2}):`);
    console.log(`Дополнительный код: ${subResult}`);
    console.log(`Десятичный результат: ${twosComplementToDecimal(subResult)}`);

    console.log("\nТестирование умножения в прямом коде:");
    const mulCode = multiplyInDirectCode(num1, num2, 8);

    function directCodeToDecimal(directStr) {
        const bitLength = directStr.length;
        if (directStr[0] === '0') {
            return binaryToDecimal(directStr.slice(1));
        } else {
            return -binaryToDecimal(directStr.slice(1));
        }
    }

    console.log(`Умножение ${num1} и ${num2}:`);
    console.log(`Результат (bin): ${mulCode}`);
    console.log(`Результат (dec): ${directCodeToDecimal(mulCode)}`);

    if (num2 === 0) {
        console.log("\nДеление на ноль невозможно!");
    } else {
        const [divResult, divDec] = divideInDirectCode(num1, num2, 5, bitLength);
        console.log(`\nДеление (${num1} / ${num2}):`);
        console.log(`Прямой код: ${divResult}`);
        console.log(`Десятичный результат: ${divDec.toFixed(5)}`);
    }

    console.log("\nТестирование сложения чисел с плавающей точкой по IEEE-754:");
    const a = parseFloat(await askQuestion("Введите первое число (например, 3.3): "));
    const b = parseFloat(await askQuestion("Введите второе число (например, 4.9): "));

    const ieeeA = convertFloatToIEEE754(a);
    const ieeeB = convertFloatToIEEE754(b);

    console.log("\nПредставление чисел в IEEE-754 (32 бит):");
    console.log(`A = ${a} -> ${ieeeA}`);
    console.log(`B = ${b} -> ${ieeeB}`);

    const ieeeResult = addIEEE754(ieeeA, ieeeB);
    console.log("\nРезультат сложения в формате IEEE-754 (32 бит):");
    console.log(ieeeResult);

    const decResult = ieee754ToDecimal(ieeeResult);
    console.log("\nРезультат сложения (десятичное значение):");
    console.log(decResult);

    rl.close();
}

main();