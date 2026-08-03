import SwiftUI

/// Программная заглушка для hero-изображения главного экрана (звёздное небо +
/// золотая мандала), пока заказчик не предоставит финальную графику.
struct StarfieldHero: View {
    var accent: Color = Theme.Tarot.gold
    private let stars: [(CGFloat, CGFloat, CGFloat)] = (0..<40).map { i in
        let seed = Double(i)
        return (
            CGFloat((seed * 37).truncatingRemainder(dividingBy: 100)) / 100,
            CGFloat((seed * 71).truncatingRemainder(dividingBy: 100)) / 100,
            CGFloat.random(in: 1...2.4)
        )
    }

    var body: some View {
        ZStack {
            RadialGradient(
                colors: [Theme.Tarot.surface.opacity(0.9), Theme.voidBackground],
                center: .center,
                startRadius: 10,
                endRadius: 260
            )
            GeometryReader { proxy in
                ForEach(0..<stars.count, id: \.self) { i in
                    Circle()
                        .fill(Color.white.opacity(0.6))
                        .frame(width: stars[i].2, height: stars[i].2)
                        .position(
                            x: stars[i].0 * proxy.size.width,
                            y: stars[i].1 * proxy.size.height
                        )
                }
            }
            Circle()
                .strokeBorder(accent.opacity(0.5), lineWidth: 1)
                .frame(width: 140, height: 140)
            Circle()
                .strokeBorder(accent.opacity(0.3), lineWidth: 1)
                .frame(width: 90, height: 90)
        }
        .frame(maxWidth: .infinity)
        .frame(height: 300)
        .mask(
            LinearGradient(
                stops: [
                    .init(color: .black, location: 0),
                    .init(color: .black, location: 0.75),
                    .init(color: .clear, location: 1)
                ],
                startPoint: .top,
                endPoint: .bottom
            )
        )
    }
}

/// Карточка-«дверь» для перехода в раздел (Таро / Нумерология) на главном экране.
struct SectionDoorCard: View {
    let title: String
    let subtitle: String
    let icon: String
    let gradientTop: Color
    let gradientBottom: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Rectangle()
                .fill(gradientTop)
                .frame(width: 28, height: 2)
            HStack {
                Text(title)
                    .font(Theme.Font.display(24))
                    .foregroundStyle(Theme.ink)
                Spacer()
                Image(systemName: icon)
                    .foregroundStyle(gradientTop)
            }
            Text(subtitle)
                .font(Theme.Font.body(13))
                .foregroundStyle(Theme.inkMuted)
        }
        .padding(22)
        .frame(maxWidth: .infinity, alignment: .leading)
        .frame(minHeight: 108)
        .background(
            LinearGradient(
                colors: [gradientTop.opacity(0.22), gradientBottom.opacity(0.55)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .strokeBorder(Theme.hairline, lineWidth: 1)
        )
    }
}

/// Визуальное оформление главной кнопки — без встроенного жеста, чтобы
/// безопасно использовать и внутри `Button`, и внутри `NavigationLink`.
struct PrimaryButtonLabel: View {
    let title: String
    var accent: Color = Theme.Tarot.gold

    var body: some View {
        Text(title.uppercased())
            .font(Theme.Font.label(13))
            .tracking(1.2)
            .foregroundStyle(accent)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .strokeBorder(accent, lineWidth: 1)
            )
    }
}

/// Основная кнопка приложения (используется как "Сохранить расклад/расчёт").
struct PrimaryButton: View {
    let title: String
    var accent: Color = Theme.Tarot.gold
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            PrimaryButtonLabel(title: title, accent: accent)
        }
        .buttonStyle(.plain)
    }
}

/// Карточка одного нумерологического числа (Число судьбы, Число души и т.д.).
struct NumberTile: View {
    let value: String
    let label: String
    var accent: Color = Theme.Numerology.silver
    var isSelected: Bool = false

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(Theme.Font.display(32))
                .foregroundStyle(Theme.ink)
            Text(label.uppercased())
                .font(Theme.Font.label(10))
                .tracking(1)
                .foregroundStyle(Theme.inkMuted)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 18)
        .background(Theme.Numerology.surface2.opacity(isSelected ? 1 : 0.6))
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .strokeBorder(isSelected ? accent : Theme.hairline, lineWidth: isSelected ? 1.5 : 1)
        )
    }
}

/// Панель толкования — заголовок + текст, единый стиль для Таро и Нумерологии.
struct InterpretationPanel: View {
    let title: String
    let text: String
    var accent: Color = Theme.Tarot.gold
    var surface: Color = Theme.Tarot.surface2

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(Theme.Font.display(18, weight: .semibold))
                .foregroundStyle(accent)
            Text(text)
                .font(Theme.Font.body(14))
                .foregroundStyle(Theme.ink.opacity(0.92))
                .lineSpacing(4)
        }
        .padding(20)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(surface)
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .strokeBorder(Theme.hairline, lineWidth: 1)
        )
    }
}
