import SwiftUI

struct SpreadView: View {
    @Environment(\.historyRepository) private var repository
    @StateObject private var viewModel: SpreadViewModel

    init(type: SpreadType) {
        // UserProfileStore хранит данные через @AppStorage (UserDefaults.standard),
        // поэтому отдельный экземпляр здесь всегда видит актуальное имя —
        // не нужно прокидывать через EnvironmentObject и переинициализировать позже.
        _viewModel = StateObject(wrappedValue: SpreadViewModel(type: type, profile: UserProfileStore()))
    }

    var body: some View {
        ZStack {
            Theme.Tarot.surface.ignoresSafeArea()
            ScrollView {
                VStack(spacing: 22) {
                    if let question = viewModel.question {
                        Text("«\(question)»")
                            .font(Theme.Font.display(18).italic())
                            .foregroundStyle(Theme.Tarot.goldSoft)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 24)
                            .padding(.top, 20)
                    } else {
                        Text("Карта дня")
                            .font(Theme.Font.display(18))
                            .foregroundStyle(Theme.Tarot.goldSoft)
                            .padding(.top, 20)
                    }

                    HStack(spacing: 14) {
                        ForEach(viewModel.drawnCards.indices, id: \.self) { index in
                            SpreadCardView(
                                drawn: viewModel.drawnCards[index],
                                isRevealed: viewModel.isRevealed(index),
                                positionLabel: viewModel.positions[index]
                            ) {
                                viewModel.reveal(index)
                            }
                        }
                    }
                    .padding(.horizontal, 20)

                    if viewModel.drawnCards.count > 1 {
                        HStack(spacing: 22) {
                            ForEach(viewModel.positions.indices, id: \.self) { index in
                                Button {
                                    if viewModel.isRevealed(index) {
                                        viewModel.selectedIndex = index
                                    }
                                } label: {
                                    Text(viewModel.positions[index].uppercased())
                                        .font(Theme.Font.label(12))
                                        .tracking(1)
                                        .foregroundStyle(
                                            viewModel.selectedIndex == index && viewModel.isRevealed(index)
                                                ? Theme.Tarot.gold
                                                : Theme.inkMuted
                                        )
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }

                    if !viewModel.isRevealed(viewModel.selectedIndex) {
                        Text("Коснись карты, чтобы открыть")
                            .font(Theme.Font.body(12))
                            .foregroundStyle(Theme.inkMuted)
                    } else {
                        InterpretationPanel(
                            title: viewModel.cardTitle(for: viewModel.selectedIndex),
                            text: viewModel.interpretationText(for: viewModel.selectedIndex),
                            accent: Theme.Tarot.gold,
                            surface: Theme.Tarot.surface2
                        )
                        .padding(.horizontal, 20)
                        .transition(.opacity)
                    }

                    if viewModel.allRevealed {
                        PrimaryButton(
                            title: viewModel.isSaved ? "Сохранено" : "Сохранить расклад",
                            accent: Theme.Tarot.gold
                        ) {
                            viewModel.save(using: repository)
                        }
                        .disabled(viewModel.isSaved)
                        .padding(.horizontal, 20)
                    }

                    Spacer(minLength: 30)
                }
            }
        }
        .navigationTitle("ТАРО")
        .navigationBarTitleDisplayMode(.inline)
    }
}

private struct SpreadCardView: View {
    let drawn: DrawnCard
    let isRevealed: Bool
    let positionLabel: String
    let onTap: () -> Void

    @State private var flipped = false

    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                CardBackFace()
                    .opacity(flipped ? 0 : 1)
                CardFrontFace(card: drawn.card, orientation: drawn.orientation)
                    .opacity(flipped ? 1 : 0)
                    .rotation3DEffect(.degrees(180), axis: (x: 0, y: 1, z: 0))
            }
            .frame(width: 92, height: 138)
            .rotation3DEffect(.degrees(flipped ? 180 : 0), axis: (x: 0, y: 1, z: 0))
            .onTapGesture {
                onTap()
            }
            .onChange(of: isRevealed) { _, newValue in
                guard newValue else { return }
                // Кривая и длительность 1:1 с референсом (mockup.html: .card-inner
                // transition: transform 0.7s cubic-bezier(.4,.2,.2,1)).
                withAnimation(.timingCurve(0.4, 0.2, 0.2, 1, duration: 0.7)) {
                    flipped = true
                }
            }
            .onAppear {
                if isRevealed { flipped = true }
            }

            Text(positionLabel)
                .font(Theme.Font.label(10))
                .tracking(0.5)
                .foregroundStyle(Theme.inkMuted)
        }
    }
}

private struct CardBackFace: View {
    var body: some View {
        RoundedRectangle(cornerRadius: 14, style: .continuous)
            .fill(Theme.Tarot.surface2)
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .strokeBorder(Theme.Tarot.gold, lineWidth: 1.5)
                    .padding(6)
            )
            .overlay(
                Circle()
                    .strokeBorder(Theme.Tarot.gold.opacity(0.7), lineWidth: 1)
                    .frame(width: 34, height: 34)
            )
    }
}

private struct CardFrontFace: View {
    let card: TarotCard
    let orientation: CardOrientation

    var body: some View {
        RoundedRectangle(cornerRadius: 14, style: .continuous)
            .fill(Theme.Tarot.surface2)
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .strokeBorder(Theme.Tarot.gold.opacity(0.6), lineWidth: 1)
            )
            .overlay(
                VStack(spacing: 6) {
                    Image(systemName: card.suit?.symbol ?? "sparkle")
                        .font(.system(size: 18))
                        .foregroundStyle(Theme.Tarot.goldSoft)
                        .rotationEffect(.degrees(orientation == .reversed ? 180 : 0))
                    Text(card.name)
                        .font(Theme.Font.body(11, weight: .semibold))
                        .foregroundStyle(Theme.ink)
                        .multilineTextAlignment(.center)
                        .minimumScaleFactor(0.7)
                        .lineLimit(3)
                    if orientation == .reversed {
                        Text("перевёрнута")
                            .font(Theme.Font.label(8))
                            .foregroundStyle(Theme.inkMuted)
                    }
                }
                .padding(8)
            )
    }
}
