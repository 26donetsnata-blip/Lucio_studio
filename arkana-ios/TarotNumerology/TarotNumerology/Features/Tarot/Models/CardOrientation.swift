import Foundation

/// Прямое или перевёрнутое положение карты — определяется случайно при
/// выпадении карты в раскладе (ТЗ п.2.2).
enum CardOrientation: String, Codable, CaseIterable {
    case upright
    case reversed

    static func random() -> CardOrientation {
        Bool.random() ? .upright : .reversed
    }
}
