// tests/test.rs
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_decimal_to_straight() {
        assert_eq!(decimal_to_straight(10), "01010");
        assert_eq!(decimal_to_straight(-5), "1101");
        assert_eq!(decimal_to_straight(0), "0");
    }

    #[test]
    fn test_decimal_to_reverse() {
        assert_eq!(decimal_to_reverse("01010"), "01010");
        assert_eq!(decimal_to_reverse("10101"), "11010");
    }

    #[test]
    fn test_decimal_to_complement() {
        assert_eq!(decimal_to_complement("11010"), "11011");
        assert_eq!(decimal_to_complement("01010"), "01010");
    }

    #[test]
    fn test_complement_to_decimal() {
        assert_eq!(complement_to_decimal("01010".to_string()), 10);
        assert_eq!(complement_to_decimal("11101".to_string()), -2);
    }

    #[test]
    fn test_straight_to_decimal() {
        assert_eq!(straight_to_decimal("01010".to_string()), 10);
        assert_eq!(straight_to_decimal("10101".to_string()), -5);
    }

    #[test]
    fn test_add_in_complement() {
        assert_eq!(
            add_in_complement("11101".to_string(), "01010".to_string()),
            "100111"
        );
    }

    #[test]
    fn test_subtract_in_complement() {
        assert_eq!(
            subtract_in_complement("01010".to_string(), "10101".to_string()),
            "01111"
        );
    }

    #[test]
    fn test_multiply_in_straight() {
        assert_eq!(
            multiply_in_straight("01010".to_string(), "01010".to_string()),
            "01100100"
        );
        assert_eq!(
            multiply_in_straight("10101".to_string(), "01010".to_string()),
            "1110010"
        );
    }

    #[test]
    fn test_divide_in_straight() {
        assert_eq!(
            divide_in_straight("101010".to_string(), "01010".to_string()),
            "11"
        );
    }

    #[test]
    fn test_pad_binary() {
        assert_eq!(pad_binary("101", 5), "00101");
        assert_eq!(pad_binary("1", 3), "001");
    }

    #[test]
    fn test_float_to_ieee754() {
        let ieee = float_to_ieee754(12.5);
        assert_eq!(ieee.len(), 32);
    }

    #[test]
    fn test_parse_ieee754() {
        let (sign, exp, mant) = parse_ieee754("01000001001010000000000000000000");
        assert_eq!(sign, '0');
        assert_eq!(exp, 3);
        assert_eq!(mant, "01010000000000000000000");
    }
}
