const { parseExpression, shuntingYard, generateTruthTable, buildForms } = require('./second_lab');

function main() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question("Введите логическое выражение: ", (expr) => {
        const [variables, parsedExpr] = parseExpression(expr);
        const postfix = shuntingYard(parsedExpr);
        const table = generateTruthTable(variables, postfix);
        const forms = buildForms(table, variables);

        console.log("\nТаблица истинности:");
        const header = variables.join(' | ') + ' | Результат';
        console.log(header);
        console.log('-'.repeat(header.length));
        for (const [combo, res] of table) {
            console.log(combo.join(' | ') + ` | ${res}`);
        }

        console.log("\nСДНФ:");
        console.log(forms.sdnf);
        console.log(`Числовая форма СДНФ: ∨(${forms.numeric_sdnf})`);

        console.log("\nСКНФ:");
        console.log(forms.sknf);
        console.log(`Числовая форма СКНФ: ∧(${forms.numeric_sknf})`);

        console.log("\nИндексная форма:");
        console.log(forms.index);

        readline.close();
    });
}

if (require.main === module) {
    main();
}