import Foundation
import SwiftData

/// Абстракция хранения истории. На Этапе 2 (регистрация + облачная синхронизация,
/// см. ТЗ п.3) сюда добавится, например, `CloudHistoryRepository` — экраны и
/// вью-модели не изменятся, т.к. работают только через этот протокол.
@MainActor
protocol HistoryRepository {
    func save(_ entry: HistoryEntry) throws
    func fetchAll() throws -> [HistoryEntry]
    func delete(_ entry: HistoryEntry) throws
}

@MainActor
final class SwiftDataHistoryRepository: HistoryRepository {
    private let context: ModelContext

    init(context: ModelContext) {
        self.context = context
    }

    func save(_ entry: HistoryEntry) throws {
        context.insert(entry)
        try context.save()
    }

    func fetchAll() throws -> [HistoryEntry] {
        let descriptor = FetchDescriptor<HistoryEntry>(
            sortBy: [SortDescriptor(\.date, order: .reverse)]
        )
        return try context.fetch(descriptor)
    }

    func delete(_ entry: HistoryEntry) throws {
        context.delete(entry)
        try context.save()
    }
}
