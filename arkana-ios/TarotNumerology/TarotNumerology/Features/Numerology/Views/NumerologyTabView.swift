import SwiftUI

private enum NumerologyTab: String, CaseIterable {
    case personal = "Личный расчёт"
    case compatibility = "Совместимость"
    case dayForecast = "Прогноз дня"
}

struct NumerologyTabView: View {
    @EnvironmentObject private var profile: UserProfileStore
    @State private var selectedTab: NumerologyTab = .personal

    var body: some View {
        ZStack {
            Theme.Numerology.surface.ignoresSafeArea()
            VStack(spacing: 0) {
                VStack(spacing: 6) {
                    Text("НУМЕРОЛОГИЯ")
                        .font(Theme.Font.label())
                        .tracking(3)
                        .foregroundStyle(Theme.Numerology.silverSoft)
                }
                .padding(.top, 24)
                .padding(.bottom, 14)

                HStack(spacing: 0) {
                    ForEach(NumerologyTab.allCases, id: \.self) { tab in
                        Button {
                            selectedTab = tab
                        } label: {
                            Text(tab.rawValue.uppercased())
                                .font(Theme.Font.label(11))
                                .tracking(0.5)
                                .foregroundStyle(selectedTab == tab ? Theme.Numerology.silver : Theme.inkMuted)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .overlay(Rectangle().fill(Theme.hairline).frame(height: 1), alignment: .bottom)
                .padding(.horizontal, 12)

                ScrollView {
                    Group {
                        switch selectedTab {
                        case .personal:
                            PersonalCalculationView(profile: profile)
                        case .compatibility:
                            CompatibilityView()
                        case .dayForecast:
                            DayForecastView(profile: profile)
                        }
                    }
                    .padding(20)
                }
            }
        }
        .navigationTitle("")
        .navigationBarTitleDisplayMode(.inline)
    }
}
