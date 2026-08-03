import SwiftUI

/// Единая дизайн-система приложения — см. DESIGN_SYSTEM.md (источник истины).
/// Палитра v2 (2026-08-03, по референсу arcana-ui.html): тёплое золото для
/// Таро, насыщенное индиго/небесно-голубой для Нумерологии.
enum Theme {
    // MARK: - Общие цвета
    static let voidBackground = Color(hex: 0x0c1117)
    static let ink = Color(hex: 0xfff2d7)
    static let inkMuted = Color(hex: 0xaaa18f)
    static let hairline = Color(hex: 0xd9ad4f).opacity(0.3)

    // MARK: - Таро (глубокий зелёный + золото)
    enum Tarot {
        static let surface = Color(hex: 0x12342a)
        static let surface2 = Color(hex: 0x1b4938)
        static let gold = Color(hex: 0xd9ad4f)
        static let goldSoft = Color(hex: 0xf1cf74)
    }

    // MARK: - Нумерология (индиго + небесно-голубой)
    enum Numerology {
        static let surface = Color(hex: 0x1b1833)
        static let surface2 = Color(hex: 0x32295a)
        static let silver = Color(hex: 0xb4c9f3)
        static let silverSoft = Color(hex: 0xcbd7f3)
    }

    // MARK: - Типографика
    enum Font {
        /// Заголовки — засечный, атмосферный (замена Cormorant Garamond из мокапа
        /// системным serif, пока не подключён кастомный шрифт).
        static func display(_ size: CGFloat, weight: SwiftUI.Font.Weight = .medium) -> SwiftUI.Font {
            .system(size: size, weight: weight, design: .serif)
        }

        static func body(_ size: CGFloat, weight: SwiftUI.Font.Weight = .regular) -> SwiftUI.Font {
            .system(size: size, weight: weight, design: .default)
        }

        static func label(_ size: CGFloat = 11) -> SwiftUI.Font {
            .system(size: size, weight: .semibold, design: .default)
        }
    }
}

extension Color {
    init(hex: UInt32, opacity: Double = 1) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: opacity
        )
    }
}
