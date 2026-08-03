import Foundation

enum ArcanaType: String, Codable {
    case major
    case minor
}

enum Suit: String, Codable, CaseIterable {
    case wands
    case cups
    case swords
    case pentacles

    var displayName: String {
        switch self {
        case .wands: return "Жезлы"
        case .cups: return "Кубки"
        case .swords: return "Мечи"
        case .pentacles: return "Пентакли"
        }
    }

    var symbol: String {
        switch self {
        case .wands: return "flame.fill"
        case .cups: return "drop.fill"
        case .swords: return "wind"
        case .pentacles: return "circle.hexagongrid.fill"
        }
    }
}

/// Прямое/перевёрнутое толкование одного "слоя" текстов.
struct CardInterpretation: Codable, Hashable {
    let upright: String
    let reversed: String

    func text(for orientation: CardOrientation) -> String {
        switch orientation {
        case .upright: return upright
        case .reversed: return reversed
        }
    }
}

/// Архитектурный задел из ТЗ п.2.2: структура карты сразу поддерживает второй
/// слой текстов — авторские персонализированные толкования с учётом сочетаний
/// карт (Этап 2). `personalized` сейчас всегда `nil` и не используется, но
/// схема данных под него уже готова — переделка не понадобится.
struct TarotCardInterpretations: Codable, Hashable {
    let classic: CardInterpretation
    var personalized: CardInterpretation? = nil
}

struct TarotCard: Codable, Identifiable, Hashable {
    let id: String
    let name: String
    let arcana: ArcanaType
    let suit: Suit?
    let number: Int?
    let interpretations: TarotCardInterpretations

    /// Толкование для показа пользователю: пока персонализированный слой пуст,
    /// всегда возвращает классическое (Уэйта) значение.
    func interpretation(for orientation: CardOrientation) -> String {
        (interpretations.personalized ?? interpretations.classic).text(for: orientation)
    }
}

/// Одна вытянутая карта в раскладе — карта + её положение при выпадении.
struct DrawnCard: Identifiable, Hashable {
    let id = UUID()
    let card: TarotCard
    let orientation: CardOrientation
}
