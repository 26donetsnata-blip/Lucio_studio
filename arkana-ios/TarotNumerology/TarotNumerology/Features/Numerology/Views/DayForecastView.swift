import SwiftUI

struct DayForecastView: View {
    @Environment(\.historyRepository) private var repository
    let profile: UserProfileStore

    @State private var text: String?
    @State private var isSaved = false

    private var todayFormatted: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMMM"
        formatter.locale = Locale(identifier: "ru_RU")
        return formatter.string(from: .now)
    }

    var body: some View {
        VStack(spacing: 18) {
            if let birthDate = profile.birthDate {
                Text("Сегодня, \(todayFormatted)")
                    .font(Theme.Font.label())
                    .tracking(1)
                    .foregroundStyle(Theme.inkMuted)

                if let text {
                    InterpretationPanel(
                        title: "\(profile.displayName), твой день",
                        text: text,
                        accent: Theme.Numerology.silver,
                        surface: Theme.Numerology.surface2
                    )

                    PrimaryButton(
                        title: isSaved ? "Сохранено" : "Сохранить в историю",
                        accent: Theme.Numerology.silver
                    ) {
                        save(text: text)
                    }
                    .disabled(isSaved)
                } else {
                    PrimaryButton(title: "Узнать прогноз", accent: Theme.Numerology.silver) {
                        let destiny = NumerologyCalculator.destinyNumber(birthDate: birthDate)
                        text = NumerologyCalculator.dayForecastText(destinyNumber: destiny)
                        isSaved = false
                    }
                }
            } else {
                Text("Чтобы получить прогноз дня, укажи дату рождения в разделе «Личный расчёт».")
                    .font(Theme.Font.body(13))
                    .foregroundStyle(Theme.inkMuted)
                    .multilineTextAlignment(.center)
            }

            Spacer(minLength: 12)
        }
    }

    private func save(text: String) {
        let entry = HistoryEntry(
            kind: .numerology,
            title: "Прогноз дня",
            question: todayFormatted,
            summary: text
        )
        try? repository.save(entry)
        isSaved = true
    }
}
