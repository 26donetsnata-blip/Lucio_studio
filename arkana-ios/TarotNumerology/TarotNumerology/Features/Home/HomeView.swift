import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var profile: UserProfileStore

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.voidBackground.ignoresSafeArea()
                VStack(spacing: 0) {
                    StarfieldHero()

                    VStack(spacing: 4) {
                        Text("Аркана")
                            .font(Theme.Font.display(26))
                            .tracking(1)
                            .foregroundStyle(Theme.ink)
                        Text("ТАРО И НУМЕРОЛОГИЯ")
                            .font(Theme.Font.label())
                            .tracking(3)
                            .foregroundStyle(Theme.inkMuted)
                    }
                    .padding(.top, 18)

                    VStack(spacing: 2) {
                        Text("Привет, \(profile.displayName)!")
                        Text("Что бы ты хотела сегодня посмотреть?")
                    }
                    .font(Theme.Font.display(15).italic())
                    .foregroundStyle(Theme.Tarot.goldSoft)
                    .multilineTextAlignment(.center)
                    .padding(.top, 14)
                    .padding(.horizontal, 28)

                    VStack(spacing: 14) {
                        NavigationLink {
                            SpreadTypeSelectionView()
                        } label: {
                            SectionDoorCard(
                                title: "Таро",
                                subtitle: "Расклад на вопрос или на день",
                                icon: "moon.stars.fill",
                                gradientTop: Theme.Tarot.gold,
                                gradientBottom: Theme.Tarot.surface
                            )
                        }

                        NavigationLink {
                            NumerologyTabView()
                        } label: {
                            SectionDoorCard(
                                title: "Нумерология",
                                subtitle: "Личный расчёт, совместимость, прогноз дня",
                                icon: "sparkles",
                                gradientTop: Theme.Numerology.silver,
                                gradientBottom: Theme.Numerology.surface
                            )
                        }

                        NavigationLink {
                            HistoryListView()
                        } label: {
                            HStack {
                                Image(systemName: "clock.arrow.circlepath")
                                Text("История")
                            }
                            .font(Theme.Font.body(13))
                            .foregroundStyle(Theme.inkMuted)
                            .padding(.top, 6)
                        }
                    }
                    .padding(.top, 22)
                    .padding(.horizontal, 20)

                    Spacer()
                }
            }
            .toolbar(.hidden)
        }
        .preferredColorScheme(.dark)
    }
}
