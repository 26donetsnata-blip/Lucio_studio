import SwiftUI

/// Единоразовый экран знакомства: только имя обязательно (для обращения в
/// текстах толкований по всему приложению), дата/время рождения опциональны
/// и используются как значение по умолчанию в личном расчёте нумерологии.
struct OnboardingView: View {
    @EnvironmentObject private var profile: UserProfileStore

    @State private var name: String = ""
    @State private var includeBirthDate = false
    @State private var birthDate = Date()

    var body: some View {
        ZStack {
            Theme.voidBackground.ignoresSafeArea()
            VStack(spacing: 28) {
                Spacer()
                VStack(spacing: 8) {
                    Text("Аркана")
                        .font(Theme.Font.display(28))
                        .foregroundStyle(Theme.ink)
                    Text("Как к вам обращаться?")
                        .font(Theme.Font.body(14))
                        .foregroundStyle(Theme.inkMuted)
                }

                VStack(alignment: .leading, spacing: 14) {
                    TextField("Ваше имя", text: $name)
                        .textFieldStyle(.plain)
                        .font(Theme.Font.body(17))
                        .foregroundStyle(Theme.ink)
                        .padding(16)
                        .background(Theme.Tarot.surface2)
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))

                    Toggle(isOn: $includeBirthDate.animation()) {
                        Text("Указать дату рождения сейчас")
                            .font(Theme.Font.body(13))
                            .foregroundStyle(Theme.inkMuted)
                    }
                    .tint(Theme.Tarot.gold)

                    if includeBirthDate {
                        DatePicker(
                            "Дата рождения",
                            selection: $birthDate,
                            in: ...Date(),
                            displayedComponents: .date
                        )
                        .datePickerStyle(.graphical)
                        .tint(Theme.Tarot.gold)
                        .colorScheme(.dark)
                    }
                }
                .padding(20)
                .background(Theme.Tarot.surface)
                .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))

                Spacer()

                PrimaryButton(title: "Продолжить") {
                    profile.name = name
                    if includeBirthDate {
                        profile.birthDate = birthDate
                    }
                    profile.onboardingComplete = true
                }
                .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
                .opacity(name.trimmingCharacters(in: .whitespaces).isEmpty ? 0.4 : 1)
            }
            .padding(24)
        }
    }
}
