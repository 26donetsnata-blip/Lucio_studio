import Foundation

/// Задел под монетизацию Этапа 2 (подписка/покупки, см. ТЗ п.6). В MVP всё
/// бесплатно и безусловно доступно; когда появится IAP, экраны будут спрашивать
/// `EntitlementProvider` вместо хардкода — переделка схемы не потребуется.
protocol EntitlementProvider {
    func isUnlocked(_ feature: PremiumFeature) -> Bool
}

enum PremiumFeature {
    case personalizedTarotReadings
    case extendedNumerologyReports
}

struct FreeEntitlementProvider: EntitlementProvider {
    func isUnlocked(_ feature: PremiumFeature) -> Bool { true }
}
