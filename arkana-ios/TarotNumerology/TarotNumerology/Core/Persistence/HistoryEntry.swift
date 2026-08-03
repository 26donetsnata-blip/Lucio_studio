import Foundation
import SwiftData

enum HistoryKind: String, Codable {
    case tarot
    case numerology
}

/// Единая запись истории для обоих разделов. Хранится локально через SwiftData —
/// без аккаунта и бэкенда (см. ТЗ п.3). `payload` — сериализованные детали
/// конкретного расклада/расчёта на случай, если понадобится показать их повторно.
@Model
final class HistoryEntry {
    var id: UUID
    var kind: HistoryKind
    var date: Date
    var title: String
    var question: String?
    var summary: String
    var payload: Data?

    init(
        id: UUID = UUID(),
        kind: HistoryKind,
        date: Date = .now,
        title: String,
        question: String? = nil,
        summary: String,
        payload: Data? = nil
    ) {
        self.id = id
        self.kind = kind
        self.date = date
        self.title = title
        self.question = question
        self.summary = summary
        self.payload = payload
    }
}
