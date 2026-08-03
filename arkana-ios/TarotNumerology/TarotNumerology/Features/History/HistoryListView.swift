import SwiftUI

/// Единый список истории (ТЗ п.2.4): все прошлые расклады и расчёты, с датой,
/// вопросом и результатом. Доступен без регистрации — хранится локально.
struct HistoryListView: View {
    @Environment(\.historyRepository) private var repository
    @State private var entries: [HistoryEntry] = []

    var body: some View {
        ZStack {
            Theme.voidBackground.ignoresSafeArea()
            if entries.isEmpty {
                VStack(spacing: 8) {
                    Image(systemName: "clock.arrow.circlepath")
                        .font(.system(size: 28))
                        .foregroundStyle(Theme.inkMuted)
                    Text("История пока пуста")
                        .font(Theme.Font.body(14))
                        .foregroundStyle(Theme.inkMuted)
                }
            } else {
                ScrollView {
                    VStack(spacing: 12) {
                        ForEach(entries) { entry in
                            historyRow(entry)
                        }
                    }
                    .padding(20)
                }
            }
        }
        .navigationTitle("История")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear(perform: reload)
    }

    private func historyRow(_ entry: HistoryEntry) -> some View {
        let accent = entry.kind == .tarot ? Theme.Tarot.gold : Theme.Numerology.silver
        let surface = entry.kind == .tarot ? Theme.Tarot.surface2 : Theme.Numerology.surface2

        return VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(entry.title)
                    .font(Theme.Font.display(16, weight: .semibold))
                    .foregroundStyle(Theme.ink)
                Spacer()
                Text(entry.date, format: .dateTime.day().month().year().hour().minute())
                    .font(Theme.Font.label(10))
                    .foregroundStyle(Theme.inkMuted)
            }
            if let question = entry.question, !question.isEmpty {
                Text(question)
                    .font(Theme.Font.body(13).italic())
                    .foregroundStyle(accent)
            }
            Text(entry.summary)
                .font(Theme.Font.body(13))
                .foregroundStyle(Theme.ink.opacity(0.85))
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(surface)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .strokeBorder(Theme.hairline, lineWidth: 1)
        )
    }

    private func reload() {
        entries = (try? repository.fetchAll()) ?? []
    }
}
