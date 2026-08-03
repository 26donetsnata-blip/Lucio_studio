import SwiftUI

/// In-memory заглушка на случай, если реальный репозиторий почему-то не был
/// подставлен через environment (не должно происходить в реальном рантайме —
/// App всегда внедряет SwiftDataHistoryRepository).
@MainActor
final class InMemoryHistoryRepository: HistoryRepository {
    private var storage: [HistoryEntry] = []

    func save(_ entry: HistoryEntry) throws { storage.append(entry) }
    func fetchAll() throws -> [HistoryEntry] { storage.sorted { $0.date > $1.date } }
    func delete(_ entry: HistoryEntry) throws { storage.removeAll { $0.id == entry.id } }
}

// Компилятор предупреждает про main-actor-изолированный defaultValue — это
// ожидаемо (протокол HistoryRepository сам @MainActor) и безвредно в Swift 5
// language mode проекта (SWIFT_VERSION в project.yml); станет ошибкой только
// при переходе на Swift 6 strict concurrency.
@MainActor
private struct HistoryRepositoryKey: EnvironmentKey {
    static let defaultValue: HistoryRepository = InMemoryHistoryRepository()
}

extension EnvironmentValues {
    var historyRepository: HistoryRepository {
        get { self[HistoryRepositoryKey.self] }
        set { self[HistoryRepositoryKey.self] = newValue }
    }
}
