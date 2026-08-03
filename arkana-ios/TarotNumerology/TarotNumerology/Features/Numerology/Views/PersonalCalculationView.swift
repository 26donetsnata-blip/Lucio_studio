import SwiftUI

struct PersonalCalculationView: View {
    @Environment(\.historyRepository) private var repository
    let profile: UserProfileStore

    @State private var name: String
    @State private var birthDate: Date
    @State private var selectedKind: NumerologyNumberKind = .destiny
    @State private var isSaved = false

    init(profile: UserProfileStore) {
        self.profile = profile
        _name = State(initialValue: profile.displayName == "друг" ? "" : profile.name)
        _birthDate = State(initialValue: profile.birthDate ?? Date())
    }

    private var results: [NumerologyNumberResult] {
        guard !name.trimmingCharacters(in: .whitespaces).isEmpty else { return [] }
        return NumerologyCalculator.allNumbers(name: name, birthDate: birthDate)
    }

    private var dateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd.MM.yyyy"
        return formatter
    }

    var body: some View {
        VStack(spacing: 18) {
            VStack(alignment: .leading, spacing: 12) {
                TextField("Полное имя", text: $name)
                    .font(Theme.Font.body(15))
                    .foregroundStyle(Theme.ink)
                    .padding(14)
                    .background(Theme.Numerology.surface2)
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))

                DatePicker("Дата рождения", selection: $birthDate, in: ...Date(), displayedComponents: .date)
                    .font(Theme.Font.body(14))
                    .foregroundStyle(Theme.inkMuted)
                    .tint(Theme.Numerology.silver)
                    .colorScheme(.dark)
            }

            if !results.isEmpty {
                HStack(spacing: 12) {
                    ForEach(results) { result in
                        Button {
                            selectedKind = result.kind
                        } label: {
                            NumberTile(
                                value: "\(result.value)",
                                label: result.kind.title,
                                accent: Theme.Numerology.silver,
                                isSelected: selectedKind == result.kind
                            )
                        }
                        .buttonStyle(.plain)
                    }
                }

                if let selected = results.first(where: { $0.kind == selectedKind }) {
                    InterpretationPanel(
                        title: "\(selected.kind.title) — \(selected.value)",
                        text: NumerologyCalculator.interpretation(
                            for: selected.kind,
                            value: selected.value,
                            name: profile.displayName
                        ),
                        accent: Theme.Numerology.silver,
                        surface: Theme.Numerology.surface2
                    )
                }

                PrimaryButton(
                    title: isSaved ? "Сохранено" : "Сохранить расчёт",
                    accent: Theme.Numerology.silver
                ) {
                    save()
                }
                .disabled(isSaved)
            } else {
                Text("Укажи имя, чтобы увидеть расчёт")
                    .font(Theme.Font.body(13))
                    .foregroundStyle(Theme.inkMuted)
            }

            Spacer(minLength: 12)
        }
        .onChange(of: name) { _, _ in isSaved = false }
        .onChange(of: birthDate) { _, _ in isSaved = false }
    }

    private func save() {
        let summary = results.map { "\($0.kind.title): \($0.value)" }.joined(separator: "\n")
        let entry = HistoryEntry(
            kind: .numerology,
            title: "Личный расчёт",
            question: "\(name), \(dateFormatter.string(from: birthDate))",
            summary: summary
        )
        try? repository.save(entry)
        isSaved = true
    }
}
