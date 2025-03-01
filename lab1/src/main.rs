use lab1::logic::add_ieee754;
use lab1::logic::add_in_complement;
use lab1::logic::complement_to_decimal;
use lab1::logic::decimal_to_complement;
use lab1::logic::decimal_to_reverse;
use lab1::logic::decimal_to_straight;
use lab1::logic::divide_in_straight;
use lab1::logic::float_to_ieee754;
use lab1::logic::multiply_in_straight;
use lab1::logic::pad_binary;
use lab1::logic::parse_ieee754;
use lab1::logic::straight_to_decimal;
use lab1::logic::subtract_in_complement;

fn main() {
    let num1 = 10; // Объявление переменной num1 типа i32
    let num2 = -5; // Объявление переменной num2 типа i32

    // Перевод числа из десятичного формата в двоичный (прямой, обратный, дополнительный коды)
    let straight_code_num1 = decimal_to_straight(num1); // Прямой код
    let reverse_code_num1 = decimal_to_reverse(&straight_code_num1); // Обратный код
    let complement_code_num1 = decimal_to_complement(&reverse_code_num1); // Дополнительный код

    let straight_code_num2 = decimal_to_straight(num2); // Прямой код для num2
    let reverse_code_num2 = decimal_to_reverse(&straight_code_num2); // Обратный код для num2
    let complement_code_num2 = decimal_to_complement(&reverse_code_num2); // Дополнительный код для num2

    // Вывод результатов
    println!("Число {}: Прямой код: {}", num1, straight_code_num1);
    println!("Число {}: Обратный код: {}", num1, reverse_code_num1);
    println!(
        "Число {}: Дополнительный код: {}",
        num1, complement_code_num1
    );

    println!("Число {}: Прямой код: {}", num2, straight_code_num2);
    println!("Число {}: Обратный код: {}", num2, reverse_code_num2);
    println!(
        "Число {}: Дополнительный код: {}",
        num2, complement_code_num2
    );

    // Сложение двух чисел в дополнительном коде
    let sum_complement =
        add_in_complement(complement_code_num1.clone(), complement_code_num2.clone());
    println!(
        "Сложение {} и {}: Дополнительный код: {}, Десятичное значение: {}",
        num1,
        num2,
        sum_complement,
        complement_to_decimal(sum_complement.clone())
    );

    // Вычитание через комбинацию отрицания и сложения
    let difference_complement =
        subtract_in_complement(complement_code_num1.clone(), complement_code_num2.clone());
    println!(
        "Вычитание {} и {}: Дополнительный код: {}, Десятичное значение: {}",
        num1,
        num2,
        difference_complement,
        complement_to_decimal(difference_complement.clone())
    );

    // Умножение двух чисел в прямом коде
    let product_straight =
        multiply_in_straight(straight_code_num1.clone(), straight_code_num2.clone());
    println!(
        "Умножение {} и {}: Прямой код: {}, Десятичное значение: {}",
        num1,
        num2,
        product_straight,
        straight_to_decimal(product_straight.clone())
    );

    // Деление двух чисел в прямом коде
    let quotient_straight =
        divide_in_straight(straight_code_num1.clone(), straight_code_num2.clone());
    println!(
        "Деление {} на {}: Прямой код: {}, Десятичное значение: {}",
        num1,
        num2,
        quotient_straight,
        straight_to_decimal(quotient_straight.clone())
    );

    // Сложение двух положительных чисел с плавающей точкой по стандарту IEEE-754
    let float_num1 = 12.5; // Число с плавающей точкой
    let float_num2 = 3.75; // Число с плавающей точкой
    let ieee_sum = add_ieee754(float_num1, float_num2);
    println!(
        "Сложение {} и {} в формате IEEE-754: {}, Десятичное значение: {}",
        float_num1, float_num2, ieee_sum.0, ieee_sum.1
    );
}
