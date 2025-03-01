pub mod logic {
    // Функция для перевода числа в прямой код
    pub fn decimal_to_straight(num: i32) -> String {
        if num == 0 {
            return "0".to_string(); // Возвращаем строку "0", если число равно 0
        }
        let mut binary = String::new(); // Инициализация пустой строки для двоичного представления
        let abs = num.abs(); // Получение абсолютного значения
        let mut n = abs; // Копируем значение для работы с ним
        while n > 0 {
            let remainder = n % 2; // Остаток от деления на 2
            binary.push_str(&remainder.to_string()); // Добавляем остаток к строке
            n /= 2; // Делим число на 2
        }
        let result = binary.chars().rev().collect::<String>(); // Реверсируем строку
        if num < 0 {
            return format!("1{}", result); // Для отрицательных чисел добавляем "1" в начале
        }
        return format!("0{}", result); // Для положительных чисел добавляем "0" в начале
    }

    // Функция для перевода числа в обратный код
    pub fn decimal_to_reverse(straight_code: &str) -> String {
        if &straight_code[0..1] == "0" {
            return straight_code.to_string(); // Если число положительное, возвращаем прямой код
        }
        let mut reversed = "1".to_string(); // Инициализация обратного кода
        for c in straight_code[1..].chars() {
            // Итерируем по символам, начиная со второго
            reversed.push(if c == '0' { '1' } else { '0' }); // Инвертируем биты
        }
        reversed
    }

    // Функция для перевода числа в дополнительный код
    pub fn decimal_to_complement(reverse_code: &str) -> String {
        if &reverse_code[0..1] == "0" {
            return reverse_code.to_string(); // Если число положительное, возвращаем обратный код
        }
        let mut complement = reverse_code.to_string(); // Копируем обратный код
        let mut carry = 1; // Начинаем с переноса
        let mut chars: Vec<char> = complement.chars().rev().collect(); // Реверсируем символы
        for i in 0..chars.len() {
            if chars[i] == '1' && carry == 1 {
                chars[i] = '0'; // Если 1 и перенос, делаем 0
            } else if chars[i] == '0' && carry == 1 {
                chars[i] = '1'; // Если 0 и перенос, делаем 1 и убираем перенос
                carry = 0;
            }
        }
        complement = chars.into_iter().rev().collect(); // Реверсируем обратно
        complement
    }

    // Функция для перевода числа из дополнительного кода в десятичный формат
    pub fn complement_to_decimal(complement_code: String) -> i32 {
        if &complement_code[0..1] == "0" {
            return straight_to_decimal(complement_code); // Если положительное, используем прямой код
        }
        let reverse_code = decimal_to_reverse(&complement_code); // Находим обратный код
        let straight_code = decimal_to_straight(-straight_to_decimal(reverse_code)); // Преобразуем в прямой код
        -straight_to_decimal(straight_code) // Возвращаем отрицательное значение
    }

    // Функция для перевода числа из прямого кода в десятичный формат
    pub fn straight_to_decimal(straight_code: String) -> i32 {
        let sign = if &straight_code[0..1] == "1" { -1 } else { 1 }; // Определяем знак
        let mut decimal = 0; // Инициализация переменной для десятичного значения
        for (i, c) in straight_code[1..].chars().rev().enumerate() {
            // Итерируем по символам, начиная со второго
            if c == '1' {
                decimal += 1 << i; // Сдвиг влево для получения значения
            }
        }
        sign * decimal // Возвращаем десятичное значение с учетом знака
    }

    // Функция для сложения двух чисел в дополнительном коде
    pub fn add_in_complement(num1: String, num2: String) -> String {
        let mut result = String::new(); // Инициализация результата
        let mut carry = 0; // Перенос
        let max_len = std::cmp::max(num1.len(), num2.len()); // Определяем максимальную длину
        let num1_padded = pad_binary(&num1, max_len); // Дополняем нулями
        let num2_padded = pad_binary(&num2, max_len); // Дополняем нулями

        for i in (0..max_len).rev() {
            // Итерация с конца
            let bit1 = num1_padded.chars().nth(i).unwrap() as u8 - '0' as u8; // Получаем бит из первого числа
            let bit2 = num2_padded.chars().nth(i).unwrap() as u8 - '0' as u8; // Получаем бит из второго числа
            let sum = bit1 + bit2 + carry; // Суммируем биты и перенос
            if sum == 2 {
                result.push('0'); // Сумма 2 дает 0 и перенос
                carry = 1;
            } else if sum == 3 {
                result.push('1'); // Сумма 3 дает 1 и перенос
                carry = 1;
            } else {
                result.push((sum as u8 + '0' as u8) as char); // Сумма 0 или 1 без переноса
                carry = 0;
            }
        }
        if carry == 1 {
            result.push('1'); // Если есть перенос, добавляем его
        }
        result.chars().rev().collect() // Реверсируем и возвращаем результат
    }

    // Функция для вычитания двух чисел в дополнительном коде
    pub fn subtract_in_complement(num1: String, num2: String) -> String {
        let negated_num2 = {
            let decimal_value = -straight_to_decimal(num2.clone()); // Находим отрицательное значение
            let straight_code = decimal_to_straight(decimal_value); // Преобразуем в прямой код
            let reverse_code = decimal_to_reverse(&straight_code); // Находим обратный код
            decimal_to_complement(&reverse_code) // Преобразуем в дополнительный код
        };
        add_in_complement(num1, negated_num2) // Суммируем первое число и отрицательное второе
    }

    // Функция для умножения двух чисел в прямом коде
    pub fn multiply_in_straight(num1: String, num2: String) -> String {
        let decimal_num1 = straight_to_decimal(num1.clone()); // Преобразуем в десятичное
        let decimal_num2 = straight_to_decimal(num2.clone()); // Преобразуем в десятичное
        let product = decimal_num1 * decimal_num2; // Умножаем
        decimal_to_straight(product) // Возвращаем результат в прямом коде
    }

    // Функция для деления двух чисел в прямом коде
    pub fn divide_in_straight(num1: String, num2: String) -> String {
        let decimal_num1 = straight_to_decimal(num1.clone()); // Преобразуем в десятичное
        let decimal_num2 = straight_to_decimal(num2.clone()); // Преобразуем в десятичное
        let quotient = (decimal_num1 as f64 / decimal_num2 as f64).round() as i32; // Округляем результат
        decimal_to_straight(quotient) // Возвращаем результат в прямом коде
    }

    // Функция для сложения двух чисел с плавающей точкой по стандарту IEEE-754
    pub fn add_ieee754(num1: f64, num2: f64) -> (String, f64) {
        let ieee1 = float_to_ieee754(num1); // Преобразуем первое число в IEEE-754
        let ieee2 = float_to_ieee754(num2); // Преобразуем второе число в IEEE-754
        let (sign1, exp1, mant1) = parse_ieee754(&ieee1); // Парсим первое число
        let (_sign2, exp2, mant2) = parse_ieee754(&ieee2); // Парсим второе число

        let (exp, mant) = if exp1 >= exp2 {
            align_mantissas(exp1, &mant1, exp2, &mant2) // Выравниваем мантиссы
        } else {
            align_mantissas(exp2, &mant2, exp1, &mant1) // Выравниваем мантиссы
        };

        let mut result_mant = add_mantissas(mant.clone(), mant2.clone()); // Складываем мантиссы
        let mut result_exp = exp; // Сохраняем экспоненту

        // Проверяем переполнение мантиссы
        if result_mant.len() > 23 {
            result_mant.remove(0); // Убираем старший бит
            result_exp += 1; // Увеличиваем экспоненту
        }

        // Формируем результат в формате IEEE-754
        let result_ieee = format!("{}{:08b}{}", sign1, result_exp + 127, result_mant);
        (result_ieee.clone(), ieee754_to_float(result_ieee)) // Возвращаем результат
    }

    // Вспомогательные функции

    pub fn pad_binary(binary: &str, length: usize) -> String {
        format!("{:0>width$}", binary, width = length) // Дополняем строку нулями слева
    }

    pub fn float_to_ieee754(num: f64) -> String {
        let bits = unsafe { std::mem::transmute::<f64, u64>(num) }; // Преобразуем число в битовое представление
        format!("{:064b}", bits)[32..].to_string() // Получаем строку из 64 бит
    }

    pub fn parse_ieee754(ieee: &str) -> (char, i32, String) {
        let sign = ieee.chars().nth(0).unwrap(); // Получаем знак
        let exp = i32::from_str_radix(&ieee[1..9], 2).unwrap() - 127; // Получаем экспоненту
        let mant = ieee[9..].to_string(); // Получаем мантиссу
        (sign, exp, mant) // Возвращаем результаты
    }

    pub fn align_mantissas(exp1: i32, mant1: &str, exp2: i32, mant2: &str) -> (i32, String) {
        let shift = exp1 - exp2; // Вычисляем сдвиг
        let shifted_mant2 = shift_mantissa(mant2, shift); // Сдвигаем мантиссу
        (exp1, shifted_mant2) // Возвращаем экспоненту и сдвинутую мантиссу
    }

    pub fn shift_mantissa(mant: &str, shift: i32) -> String {
        let mut shifted = mant.to_string(); // Копируем мантиссу
        for _ in 0..shift {
            // Сдвигаем
            shifted.insert(0, '0'); // Добавляем нули слева
        }
        shifted
    }

    pub fn add_mantissas(mant1: String, mant2: String) -> String {
        let mut result = String::new(); // Инициализация результата
        let mut carry = 0; // Перенос
        let max_len = std::cmp::max(mant1.len(), mant2.len()); // Определяем максимальную длину
        let mant1_padded = pad_binary(&mant1, max_len); // Дополняем
        let mant2_padded = pad_binary(&mant2, max_len); // Дополняем

        for i in (0..max_len).rev() {
            // Итерация с конца
            let bit1 = mant1_padded.chars().nth(i).unwrap() as u8 - '0' as u8; // Получаем бит из первой мантиссы
            let bit2 = mant2_padded.chars().nth(i).unwrap() as u8 - '0' as u8; // Получаем бит из второй мантиссы
            let sum = bit1 + bit2 + carry; // Суммируем биты и перенос
            if sum == 2 {
                result.push('0'); // Сумма 2 дает 0 и перенос
                carry = 1;
            } else if sum == 3 {
                result.push('1'); // Сумма 3 дает 1 и перенос
                carry = 1;
            } else {
                result.push((sum as u8 + '0' as u8) as char); // Сумма 0 или 1 без переноса
                carry = 0;
            }
        }
        if carry == 1 {
            result.push('1'); // Если есть перенос, добавляем его
        }
        result.chars().rev().collect() // Реверсируем и возвращаем результат
    }

    pub fn ieee754_to_float(ieee: String) -> f64 {
        let sign = if &ieee[0..1] == "1" { -1.0 } else { 1.0 }; // Определяем знак
        let exp = i32::from_str_radix(&ieee[1..9], 2).unwrap() - 127; // Получаем экспоненту
        let mant = &ieee[9..]; // Получаем мантиссу
        let mut value = 1.0; // Инициализация значения мантиссы
        for (i, c) in mant.chars().enumerate() {
            // Итерируем по мантиссе
            if c == '1' {
                value += 1.0 / (2.0_f64.powi(i as i32 + 1)); // Увеличиваем значение
            }
        }
        sign * value * 2.0_f64.powi(exp) // Возвращаем итоговое значение
    }
}
