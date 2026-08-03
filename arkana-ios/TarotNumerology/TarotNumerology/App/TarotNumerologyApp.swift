import SwiftUI
import SwiftData

@main
struct TarotNumerologyApp: App {
    @StateObject private var profile = UserProfileStore()

    let modelContainer: ModelContainer

    init() {
        do {
            modelContainer = try ModelContainer(for: HistoryEntry.self)
        } catch {
            fatalError("Не удалось создать SwiftData ModelContainer: \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(profile)
                .environment(
                    \.historyRepository,
                    SwiftDataHistoryRepository(context: modelContainer.mainContext)
                )
                .preferredColorScheme(.dark)
        }
        .modelContainer(modelContainer)
    }
}

private struct RootView: View {
    @EnvironmentObject private var profile: UserProfileStore

    var body: some View {
        if profile.onboardingComplete {
            HomeView()
        } else {
            OnboardingView()
        }
    }
}
