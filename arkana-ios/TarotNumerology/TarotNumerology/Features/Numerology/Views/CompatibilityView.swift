import SwiftUI

struct CompatibilityView: View {
    @Environment(\.historyRepository) private var repository

    @State private var nameA = ""
    @State private var birthDateA = Date()
    @State private var nameB = ""
    @State private var birthDateB = Date()
    @State private var result: CompatibilityResult?
    @State private var isSaved = false

    private var canCalculate: Bool {
        !nameA.trimmingCharacters(in: .whitespaces).isEmpty &&
        !nameB.trimmingCharacters(in: .whitespaces).isEmpty
    }

    var body: some View {
        VStack(spacing: 18) {
            personBlock(title: "Первый человек", name: $nameA, birthDate: $birthDateA)
            personBlock(title: "Второй человек", name: $nameB, birthDate: $birthDateB)

            PrimaryButton(title: "Проверить совместимость", accent: Theme.Numerology.silver) {
                calculate()
            }
            .disabled(!canCalculate)
            .opacity(canCalculate ? 1 : 0.4)

            if let result {
                InterpretationPanel(
                    title: "Число судьбы \(result.destinyA) и \(result.destinyB)",
                    text: result.text,
                    accent: Theme.Numerology.silver,
                    surface: Theme.Numerology.surface2
                )

                PrimaryButton(
                    title: isSaved ? "Сохранено" : "Сохранить в историю",
                    accent: Theme.Numerology.silver
                ) {
                    save(result: result)
                }
                .disabled(isSaved)
            }

            Spacer(minLength: 12)
        }
    }

    private func personBlock(title: String, name: Binding<String>, birthDate: Binding<Date>) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title.uppercased())
                .font(Theme.Font.label())
                .tracking(1)
                .foregroundStyle(Theme.inkMuted)
            TextField("Имя", text: name)
                .font(Theme.Font.body(15))
                .foregroundStyle(Theme.ink)
                .padding(14)
                .background(Theme.Numerology.surface2)
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            DatePicker("Дата рождения", selection: birthDate, in: ...Date(), displayedComponents: .date)
                .font(Theme.Font.body(13))
                .foregroundStyle(Theme.inkMuted)
                .tint(Theme.Numerology.silver)
                .colorScheme(.dark)
        }
    }

    private func calculate() {
        let destinyA = NumerologyCalculator.destinyNumber(birthDate: birthDateA)
        let destinyB = NumerologyCalculator.destinyNumber(birthDate: birthDateB)
        result = NumerologyCalculator.compatibility(destinyA: destinyA, destinyB: destinyB)
        isSaved = false
    }

    private func save(result: CompatibilityResult) {
        let entry = HistoryEntry(
            kind: .numerology,
            title: "Совместимость",
            question: "\(nameA) и \(nameB)",
            summary: result.text
        )
        try? repository.save(entry)
        isSaved = true
    }
}
