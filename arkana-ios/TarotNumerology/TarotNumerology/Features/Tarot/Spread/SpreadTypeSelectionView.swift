import SwiftUI

enum SpreadType: Hashable {
    case question(String)
    case day
}

/// Экран выбора типа запроса (ТЗ п.2.2): расклад на желание/вопрос ИЛИ
/// расклад на день.
struct SpreadTypeSelectionView: View {
    @State private var question: String = ""
    @State private var showingQuestionField = false

    var body: some View {
        ZStack {
            Theme.Tarot.surface.ignoresSafeArea()
            VStack(spacing: 24) {
                VStack(spacing: 6) {
                    Text("ТАРО")
                        .font(Theme.Font.label())
                        .tracking(3)
                        .foregroundStyle(Theme.Tarot.goldSoft)
                    Text("Какой расклад сделаем?")
                        .font(Theme.Font.display(20))
                        .foregroundStyle(Theme.ink)
                }
                .padding(.top, 40)

                VStack(spacing: 14) {
                    Button {
                        withAnimation { showingQuestionField = true }
                    } label: {
                        optionCard(
                            title: "На вопрос или желание",
                            subtitle: "Сформулируй, что тебя волнует — разложим три карты: ситуация, совет, итог"
                        )
                    }
                    .buttonStyle(.plain)

                    if showingQuestionField {
                        VStack(alignment: .leading, spacing: 12) {
                            TextField("Например: стоит ли мне сейчас менять работу?", text: $question, axis: .vertical)
                                .font(Theme.Font.body(15))
                                .foregroundStyle(Theme.ink)
                                .padding(14)
                                .background(Theme.Tarot.surface2)
                                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                                .lineLimit(3...5)

                            NavigationLink {
                                SpreadView(type: .question(question.trimmingCharacters(in: .whitespacesAndNewlines)))
                            } label: {
                                PrimaryButtonLabel(title: "Разложить карты")
                            }
                            .disabled(question.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                            .opacity(question.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? 0.4 : 1)
                        }
                        .transition(.opacity.combined(with: .move(edge: .top)))
                    }

                    NavigationLink {
                        SpreadView(type: .day)
                    } label: {
                        optionCard(
                            title: "Карта дня",
                            subtitle: "Одна карта — короткая подсказка на сегодня"
                        )
                    }
                    .buttonStyle(.plain)
                }
                .padding(.horizontal, 20)

                Spacer()
            }
        }
        .navigationTitle("")
        .toolbarBackground(.hidden, for: .navigationBar)
    }

    private func optionCard(title: String, subtitle: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(Theme.Font.display(17, weight: .semibold))
                .foregroundStyle(Theme.ink)
            Text(subtitle)
                .font(Theme.Font.body(13))
                .foregroundStyle(Theme.inkMuted)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(18)
        .background(Theme.Tarot.surface2)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .strokeBorder(Theme.hairline, lineWidth: 1)
        )
    }
}
