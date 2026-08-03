import Foundation

@MainActor
final class SpreadViewModel: ObservableObject {
    let type: SpreadType
    let positions: [String]
    @Published private(set) var drawnCards: [DrawnCard]
    @Published private(set) var revealedIndices: Set<Int> = []
    @Published var selectedIndex: Int = 0
    @Published private(set) var isSaved = false

    private let profile: UserProfileStore

    init(type: SpreadType, profile: UserProfileStore) {
        self.type = type
        self.profile = profile
        switch type {
        case .question:
            positions = ["Ситуация", "Совет", "Итог"]
            drawnCards = TarotDeckLoader.draw(count: 3)
        case .day:
            positions = ["День"]
            drawnCards = TarotDeckLoader.draw(count: 1)
        }
    }

    var question: String? {
        if case let .question(text) = type, !text.isEmpty { return text }
        return nil
    }

    var allRevealed: Bool { revealedIndices.count == drawnCards.count }

    func reveal(_ index: Int) {
        guard !revealedIndices.contains(index) else {
            selectedIndex = index
            return
        }
        SoundService.play(.cardFlip)
        revealedIndices.insert(index)
        selectedIndex = index
    }

    func isRevealed(_ index: Int) -> Bool {
        revealedIndices.contains(index)
    }

    /// Толкование выбранной карты с обращением к пользователю по имени (ТЗ п.2.2).
    func interpretationText(for index: Int) -> String {
        let drawn = drawnCards[index]
        let base = drawn.card.interpretation(for: drawn.orientation)
        return "\(profile.displayName), \(base.prefix(1).lowercased())\(base.dropFirst())."
    }

    func cardTitle(for index: Int) -> String {
        let drawn = drawnCards[index]
        let orientationSuffix = drawn.orientation == .reversed ? " (перевёрнута)" : ""
        return "\(drawn.card.name)\(orientationSuffix) — \(positions[index])"
    }

    func save(using repository: HistoryRepository) {
        let title: String
        let summaryLines = drawnCards.enumerated().map { index, drawn -> String in
            let orientationSuffix = drawn.orientation == .reversed ? " (перевёрнута)" : ""
            return "\(positions[index]): \(drawn.card.name)\(orientationSuffix)"
        }
        switch type {
        case .question:
            title = "Расклад на вопрос"
        case .day:
            title = "Карта дня"
        }
        let entry = HistoryEntry(
            kind: .tarot,
            title: title,
            question: question,
            summary: summaryLines.joined(separator: "\n")
        )
        try? repository.save(entry)
        isSaved = true
    }
}
