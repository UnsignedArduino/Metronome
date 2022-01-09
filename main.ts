namespace SpriteKind {
    export const BeatBar = SpriteKind.create()
}
function enable_metronome (en: boolean) {
    metronome_en = en
    if (en) {
        beat_of_measure = 0
        sprite_beat_pointer.setFlag(SpriteFlag.Invisible, false)
        sprite_beat_pointer.vx = 1000 / (60 / beats_per_minute * 1000) * px_per_beat
    } else {
        sprite_beat_pointer.setFlag(SpriteFlag.Invisible, true)
        sprite_beat_pointer.vx = 0
    }
}
function create_beat_pointer () {
    sprite_beat_pointer = sprites.create(assets.image`beat_pointer`, SpriteKind.Player)
    sprite_beat_pointer.top = sprites_beat_bars[0].bottom + 4
    sprite_beat_pointer.x = sprites_beat_bars[0].x
}
function create_metronome_measure () {
    tiles.destroySpritesOfKind(SpriteKind.BeatBar)
    sprites_beat_bars = []
    px_per_beat = (scene.screenWidth() - 32) / beats_per_measure
    for (let index = 0; index <= beats_per_measure - 1; index++) {
        sprite_beatbar = sprites.create(assets.image`beat_bar`, SpriteKind.BeatBar)
        sprite_beatbar.top = 16
        sprite_beatbar.left = 16 + px_per_beat * index
        sprites_beat_bars.push(sprite_beatbar)
    }
}
function highlight_beat (beat: number) {
    for (let index = 0; index <= beats_per_measure - 1; index++) {
        if (beat == index) {
            sprites_beat_bars[index].setImage(assets.image`higlighted_beat_bar`)
        } else {
            sprites_beat_bars[index].setImage(assets.image`beat_bar`)
        }
    }
}
let sprite_beatbar: Sprite = null
let sprites_beat_bars: Sprite[] = []
let px_per_beat = 0
let sprite_beat_pointer: Sprite = null
let metronome_en = false
let beat_of_measure = 0
let beats_per_measure = 0
let beats_per_minute = 0
beats_per_minute = 120
beats_per_measure = 4
beat_of_measure = 0
metronome_en = false
scene.setBackgroundColor(13)
create_metronome_measure()
create_beat_pointer()
enable_metronome(true)
forever(function () {
    if (metronome_en) {
        timer.throttle("actual_beat", 60 / beats_per_minute * 1000, function () {
            if (beat_of_measure == 0) {
                music.playTone(523, music.beat(BeatFraction.Sixteenth))
            } else {
                music.playTone(262, music.beat(BeatFraction.Sixteenth))
            }
            sprite_beat_pointer.x = sprites_beat_bars[beat_of_measure].x
            highlight_beat(beat_of_measure)
            beat_of_measure += 1
            if (beat_of_measure >= beats_per_measure) {
                beat_of_measure = 0
            }
        })
    }
})
