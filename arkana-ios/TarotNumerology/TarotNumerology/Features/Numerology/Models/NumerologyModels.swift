import Foundation

enum NumerologyNumberKind: String, Codable, CaseIterable {
    case destiny
    case soul
    case personality

    var title: String {
        switch self {
        case .destiny: return "Число судьбы"
        case .soul: return "Число души"
        case .personality: return "Число характера"
        }
    }

    var jsonKey: String { rawValue }
}

struct NumerologyNumberResult: Identifiable {
    var id: NumerologyNumberKind { kind }
    let kind: NumerologyNumberKind
    let value: Int
}

struct PersonProfile {
    var name: String
    var birthDate: Date
}

struct CompatibilityResult {
    let destinyA: Int
    let destinyB: Int
    let text: String
}
