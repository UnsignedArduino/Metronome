namespace SpriteKind {
    export const BeatBar = SpriteKind.create()
}
function create_metronome_measure () {
    tiles.destroySpritesOfKind(SpriteKind.BeatBar)
    px_per_beat = (scene.screenWidth() - 32) / beats_per_measure
    for (let index = 0; index <= beats_per_measure - 1; index++) {
        sprite_beatbar = sprites.create(assets.image`beat_bar`, SpriteKind.BeatBar)
        sprite_beatbar.top = 16
        sprite_beatbar.left = 16 + px_per_beat * index
    }
}
let sprite_beatbar: Sprite = null
let px_per_beat = 0
let beats_per_measure = 0
let beats_per_minute = 120
beats_per_measure = 4
let enable_metronome = true
scene.setBackgroundColor(13)
create_metronome_measure()
forever(function () {
    if (enable_metronome) {
        timer.throttle("actual_beat", 60 / beats_per_minute * 1000, function () {
            music.playTone(262, music.beat(BeatFraction.Sixteenth))
        })
    }
})
