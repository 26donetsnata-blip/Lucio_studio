import Foundation

private struct LetterValuesFile: Codable {
    let vowels: [String]
    let letters: [String: Int]
}

private struct CompatibilityFile: Codable {
    let pairs: [String: String]
}

/// Загрузка JSON-данных нумерологии из бандла. Все три файла — черновые
/// данные, ожидающие проверки практикующим нумерологом (см. CLAUDE.md).
enum NumerologyDataLoader {
    static let letterVowels: Set<Character> = Set(letterValuesFile.vowels.compactMap(\.first))
    static let letterValues: [Character: Int] = Dictionary(
        uniqueKeysWithValues: letterValuesFile.letters.compactMap { key, value in
            key.first.map { ($0, value) }
        }
    )

    static let dayForecastBank: [String: [String]] = decode("day_forecast_bank")
    static let numberInterpretations: [String: [String: String]] = decode("number_interpretations")

    static let compatibilityPairs: [String: String] = {
        let file: CompatibilityFile = decode("compatibility_table")
        return file.pairs
    }()

    private static let letterValuesFile: LetterValuesFile = decode("letter_values")

    private static func decode<T: Decodable>(_ resource: String) -> T {
        guard let url = Bundle.main.url(forResource: resource, withExtension: "json") else {
            fatalError("Отсутствует ресурс \(resource).json в бандле")
        }
        do {
            let data = try Data(contentsOf: url)
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            fatalError("Не удалось разобрать \(resource).json: \(error)")
        }
    }
}
