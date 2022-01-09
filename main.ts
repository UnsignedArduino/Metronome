namespace SpriteKind {
    export const BeatBar = SpriteKind.create()
    export const SubBeatBar = SpriteKind.create()
}
function enable_metronome (en: boolean) {
    metronome_en = en
    if (en) {
        beat_of_measure = 0
        sprite_beat_pointer.setFlag(SpriteFlag.Invisible, false)
        sprite_beat_pointer.vx = beats_per_minute * beat_precision / 60 * px_per_beat
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
    tiles.destroySpritesOfKind(SpriteKind.SubBeatBar)
    sprites_beat_bars = []
    px_per_beat = (scene.screenWidth() - (28 + current_beat_text.length * 10)) / (beats_per_measure * beat_precision)
    for (let index = 0; index <= beats_per_measure * beat_precision - 1; index++) {
        if (index % beat_precision == 0) {
            sprite_beatbar = sprites.create(assets.image`beat_bar`, SpriteKind.BeatBar)
            sprite_beatbar.left = 8 + px_per_beat * index
        } else {
            sprite_beatbar = sprites.create(assets.image`sub_beat_bar`, SpriteKind.SubBeatBar)
            sprite_beatbar.left = 9 + px_per_beat * index
        }
        sprite_beatbar.top = 8
        sprites_beat_bars.push(sprite_beatbar)
    }
}
function create_text_sprites () {
    text_current_beat = textsprite.create(current_beat_text, 0, 15)
    text_current_beat.setMaxFontHeight(16)
    text_current_beat.top = 8
    text_current_beat.right = scene.screenWidth() - 8
}
function highlight_beat (beat: number) {
    for (let index = 0; index <= beats_per_measure * beat_precision - 1; index++) {
        if (beat == index) {
            if (sprites_beat_bars[index].kind() == SpriteKind.BeatBar) {
                sprites_beat_bars[index].setImage(assets.image`higlighted_beat_bar`)
            } else {
                sprites_beat_bars[index].setImage(assets.image`highlighted_sub_beat_bar`)
            }
        } else {
            if (sprites_beat_bars[index].kind() == SpriteKind.BeatBar) {
                sprites_beat_bars[index].setImage(assets.image`beat_bar`)
            } else {
                sprites_beat_bars[index].setImage(assets.image`sub_beat_bar`)
            }
        }
    }
}
let text_current_beat: TextSprite = null
let sprite_beatbar: Sprite = null
let sprites_beat_bars: Sprite[] = []
let px_per_beat = 0
let sprite_beat_pointer: Sprite = null
let current_beat_text = ""
let beat_of_measure = 0
let metronome_en = false
let beat_precision = 0
let beats_per_measure = 0
let beats_per_minute = 0
beats_per_minute = 120
beats_per_measure = 4
beat_precision = 4
let sound_en = false
metronome_en = false
beat_of_measure = 0
let last_beat = -500
current_beat_text = "" + (Math.floor(beat_of_measure / beat_precision) + 1) + "/" + beats_per_measure
scene.setBackgroundColor(13)
create_metronome_measure()
create_text_sprites()
create_beat_pointer()
enable_metronome(true)
game.onUpdate(function () {
    if (metronome_en) {
        if (game.runtime() - last_beat >= 60 / (beats_per_minute * beat_precision) * 1000) {
            last_beat = game.runtime()
            if (sound_en) {
                music.stopAllSounds()
                if (beat_of_measure == 0) {
                    music.playTone(523, music.beat(BeatFraction.Sixteenth))
                } else if (beat_of_measure % beat_precision == 0) {
                    music.playTone(262, music.beat(BeatFraction.Sixteenth))
                } else {
                    music.playTone(131, music.beat(BeatFraction.Sixteenth))
                }
            }
            sprite_beat_pointer.x = sprites_beat_bars[beat_of_measure].x
            highlight_beat(beat_of_measure)
            current_beat_text = "" + (Math.floor(beat_of_measure / beat_precision) + 1) + "/" + beats_per_measure
            text_current_beat.setText(current_beat_text)
            beat_of_measure += 1
            if (beat_of_measure >= beats_per_measure * beat_precision) {
                beat_of_measure = 0
            }
        }
    }
})
