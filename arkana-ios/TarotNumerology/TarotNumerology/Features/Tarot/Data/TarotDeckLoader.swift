import Foundation

enum TarotDeckLoader {
    static let shared: [TarotCard] = load()

    private static func load() -> [TarotCard] {
        guard let url = Bundle.main.url(forResource: "tarot_cards", withExtension: "json") else {
            assertionFailure("tarot_cards.json не найден в бандле")
            return []
        }
        do {
            let data = try Data(contentsOf: url)
            return try JSONDecoder().decode([TarotCard].self, from: data)
        } catch {
            assertionFailure("Не удалось разобрать tarot_cards.json: \(error)")
            return []
        }
    }

    /// Тянет `count` уникальных случайных карт с независимо определённой ориентацией.
    static func draw(count: Int) -> [DrawnCard] {
        shared.shuffled().prefix(count).map { card in
            DrawnCard(card: card, orientation: .random())
        }
    }
}
