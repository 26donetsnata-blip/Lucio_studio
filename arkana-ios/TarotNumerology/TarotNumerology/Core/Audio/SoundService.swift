import AVFoundation

enum SoundEffect: String {
    case cardFlip = "card_flip"
}

/// Проигрывание звуковых эффектов (ТЗ п.5: "Звук и анимация при открытии карты
/// Таро"). Аудиофайлы заказчик предоставит позже — до тех пор вызов тихо
/// ничего не делает, никаких крашей или заглушающих исключений.
enum SoundService {
    private static var activePlayer: AVAudioPlayer?

    static func play(_ effect: SoundEffect) {
        guard let url = Bundle.main.url(forResource: effect.rawValue, withExtension: "mp3") else {
            return
        }
        do {
            let player = try AVAudioPlayer(contentsOf: url)
            activePlayer = player
            player.play()
        } catch {
            // Файл повреждён/отсутствует — просто без звука.
        }
    }
}
