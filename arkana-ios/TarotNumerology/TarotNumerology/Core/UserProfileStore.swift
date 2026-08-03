import Foundation
import SwiftUI

/// Профиль пользователя без регистрации: только имя (для обращения в текстах)
/// и опционально дата/время рождения (используются как значение по умолчанию
/// в личном нумерологическом расчёте). Хранится локально в UserDefaults —
/// ТЗ не предусматривает аккаунт в MVP (см. ТЗ п.3).
@MainActor
final class UserProfileStore: ObservableObject {
    @AppStorage("profile.name") var name: String = ""
    @AppStorage("profile.birthDate") private var birthDateRaw: Double = 0
    @AppStorage("profile.hasBirthTime") var hasBirthTime: Bool = false
    @AppStorage("profile.onboardingComplete") var onboardingComplete: Bool = false

    var birthDate: Date? {
        get { birthDateRaw == 0 ? nil : Date(timeIntervalSince1970: birthDateRaw) }
        set { birthDateRaw = newValue?.timeIntervalSince1970 ?? 0 }
    }

    /// Имя для подстановки в тексты, с безопасным фолбэком если пользователь его не указал.
    var displayName: String {
        name.trimmingCharacters(in: .whitespaces).isEmpty ? "друг" : name
    }
}
