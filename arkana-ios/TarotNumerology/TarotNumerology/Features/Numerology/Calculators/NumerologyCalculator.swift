import Foundation

/// Чистые функции расчётов нумерологии по формулам из
/// `tarot_numerologiya_kontent_v2.md`. Данные (таблица букв, банк прогнозов,
/// таблица совместимости) — черновые, см. CLAUDE.md.
enum NumerologyCalculator {
    private static let masterNumbers: Set<Int> = [11, 22, 33]

    /// Сведение к однозначному числу с исключением для мастер-чисел 11/22/33.
    static func reduce(_ value: Int) -> Int {
        var current = value
        while current > 9 && !masterNumbers.contains(current) {
            current = String(current).compactMap(\.wholeNumberValue).reduce(0, +)
        }
        return current
    }

    /// Число судьбы: сумма всех цифр полной даты рождения (ТЗ: 14.03.1994 → 4).
    static func destinyNumber(birthDate: Date) -> Int {
        let calendar = Calendar(identifier: .gregorian)
        let components = calendar.dateComponents([.day, .month, .year], from: birthDate)
        let digitsSource = "\(components.day ?? 0)\(components.month ?? 0)\(components.year ?? 0)"
        let sum = digitsSource.compactMap(\.wholeNumberValue).reduce(0, +)
        return reduce(sum)
    }

    /// Число души: сумма значений гласных букв полного имени.
    static func soulNumber(fullName: String) -> Int {
        sumLetterValues(in: fullName, vowelsOnly: true)
    }

    /// Число характера: сумма значений согласных букв полного имени.
    static func personalityNumber(fullName: String) -> Int {
        sumLetterValues(in: fullName, vowelsOnly: false)
    }

    private static func sumLetterValues(in name: String, vowelsOnly: Bool) -> Int {
        let sum = name.uppercased().reduce(0) { partial, character in
            guard let value = NumerologyDataLoader.letterValues[character] else { return partial }
            let isVowel = NumerologyDataLoader.letterVowels.contains(character)
            return isVowel == vowelsOnly ? partial + value : partial
        }
        return reduce(sum)
    }

    static func allNumbers(name: String, birthDate: Date) -> [NumerologyNumberResult] {
        [
            NumerologyNumberResult(kind: .destiny, value: destinyNumber(birthDate: birthDate)),
            NumerologyNumberResult(kind: .soul, value: soulNumber(fullName: name)),
            NumerologyNumberResult(kind: .personality, value: personalityNumber(fullName: name)),
        ]
    }

    static func interpretation(for kind: NumerologyNumberKind, value: Int, name: String) -> String {
        let template = NumerologyDataLoader.numberInterpretations[kind.jsonKey]?["\(value)"]
            ?? "{name}, для числа \(value) толкование пока не готово."
        return template.replacingOccurrences(of: "{name}", with: name)
    }

    /// Прогноз дня: число судьбы + цифры текущей даты, сведённые к однозначному числу.
    static func dayForecastNumber(destinyNumber: Int, date: Date = .now) -> Int {
        let calendar = Calendar(identifier: .gregorian)
        let components = calendar.dateComponents([.day, .month, .year], from: date)
        let dateDigitsSum = "\(components.day ?? 0)\(components.month ?? 0)\(components.year ?? 0)"
            .compactMap(\.wholeNumberValue)
            .reduce(0, +)
        return reduce(destinyNumber + dateDigitsSum)
    }

    static func dayForecastText(destinyNumber: Int, date: Date = .now) -> String {
        let number = dayForecastNumber(destinyNumber: destinyNumber, date: date)
        let variants = NumerologyDataLoader.dayForecastBank["\(number)"] ?? []
        return variants.randomElement() ?? "Прогноз для числа \(number) пока не готов."
    }

    /// Совместимость по MVP-методу: числа судьбы обоих людей, поиск в таблице пар.
    static func compatibility(destinyA: Int, destinyB: Int) -> CompatibilityResult {
        let key = "\(min(destinyA, destinyB))-\(max(destinyA, destinyB))"
        let text = NumerologyDataLoader.compatibilityPairs[key]
            ?? "Для сочетания \(destinyA) и \(destinyB) толкование пока не готово."
        return CompatibilityResult(destinyA: destinyA, destinyB: destinyB, text: text)
    }
}
