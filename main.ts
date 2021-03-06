namespace SpriteKind {
    export const BeatBar = SpriteKind.create()
    export const SubBeatBar = SpriteKind.create()
}
function update_beat_count () {
    beat_of_measure = 0
    current_beat_text = "" + (Math.floor(beat_of_measure / beat_precision) + 1) + "/" + beats_per_measure
    text_current_beat.setText(current_beat_text)
    text_current_beat.right = scene.screenWidth() - 8
    create_metronome_measure()
    if (metronome_en) {
        recalculate_pointer_velocity()
    }
}
sprites.onCreated(SpriteKind.SubBeatBar, function (sprite) {
    sprite.setFlag(SpriteFlag.Ghost, true)
})
function enable_metronome (en: boolean) {
    metronome_en = en
    if (en) {
        recalculate_pointer_velocity()
        beat_of_measure = 0
        last_beat = game.runtime() - (60 / (beats_per_minute * beat_precision) * 1000 - 1)
        offtime = 0
    } else {
        sprite_beat_pointer.vx = 0
    }
}
function create_beat_pointer () {
    sprite_beat_pointer = sprites.create(assets.image`beat_pointer`, SpriteKind.Player)
    sprite_beat_pointer.top = sprites_beat_bars[0].bottom + 4
    sprite_beat_pointer.x = sprites_beat_bars[0].x
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    increase_bpm()
})
function create_text_sprite_top_right (text: string, top: number, right: number) {
    temp_text = textsprite.create(text, 0, 15)
    temp_text.setMaxFontHeight(16)
    temp_text.top = top
    temp_text.right = right
    return temp_text
}
function decrease_bpm () {
    beats_per_minute = Math.max(beats_per_minute - 1, 40)
    if (metronome_en) {
        recalculate_pointer_velocity()
    }
}
controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
    increase_bpm()
})
function increase_bpm () {
    beats_per_minute = Math.min(beats_per_minute + 1, 208)
    if (metronome_en) {
        recalculate_pointer_velocity()
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    enable_metronome(!(metronome_en))
})
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
function create_text_sprite_top_left (text: string, top: number, left: number) {
    temp_text = textsprite.create(text, 0, 15)
    temp_text.setMaxFontHeight(16)
    temp_text.top = top
    temp_text.left = left
    return temp_text
}
sprites.onCreated(SpriteKind.Text, function (sprite) {
    sprite.setFlag(SpriteFlag.Ghost, true)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (controller.B.isPressed()) {
        beat_precision = Math.max(beat_precision - 1, 1)
    } else {
        beats_per_measure = Math.max(beats_per_measure - 1, 1)
    }
    update_beat_count()
})
function recalculate_pointer_velocity () {
    sprite_beat_pointer.vx = beats_per_minute * beat_precision / 60 * px_per_beat
}
sprites.onCreated(SpriteKind.BeatBar, function (sprite) {
    sprite.setFlag(SpriteFlag.Ghost, true)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (controller.B.isPressed()) {
        beat_precision = Math.min(beat_precision + 1, 8)
    } else {
        beats_per_measure = Math.min(beats_per_measure + 1, 16)
    }
    update_beat_count()
})
function create_text_sprites () {
    text_current_beat = create_text_sprite_top_right(current_beat_text, 8, scene.screenWidth() - 8)
    text_beats_per_minute = create_labeled_text_sprite_top_left("" + beats_per_minute, sprite_beat_pointer.bottom + 4, 8, "beats per minute")
    text_beats_per_measure = create_labeled_text_sprite_top_left("" + beats_per_measure, text_beats_per_minute.bottom + 4, 8, "beats per measure")
    text_divisions_per_beat = create_labeled_text_sprite_top_left("" + beat_precision, text_beats_per_measure.bottom + 4, 8, "subdivisions")
}
controller.down.onEvent(ControllerButtonEvent.Repeated, function () {
    decrease_bpm()
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    decrease_bpm()
})
function create_labeled_text_sprite_top_left (text: string, top: number, left: number, label: string) {
    temp_text = textsprite.create(text, 0, 15)
    temp_text.setMaxFontHeight(16)
    temp_text.top = top
    temp_text.left = left
    sprites.setDataBoolean(temp_text, "has_label", true)
    sprites.setDataSprite(temp_text, "label", textsprite.create(label, 0, 15))
    sprites.readDataSprite(temp_text, "label").bottom = temp_text.bottom
    sprites.readDataSprite(temp_text, "label").left = temp_text.right + 4
    return temp_text
}
sprites.onCreated(SpriteKind.Player, function (sprite) {
    sprite.setFlag(SpriteFlag.Ghost, true)
})
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
let text_divisions_per_beat: TextSprite = null
let text_beats_per_measure: TextSprite = null
let text_beats_per_minute: TextSprite = null
let sprite_beatbar: Sprite = null
let px_per_beat = 0
let temp_text: TextSprite = null
let sprites_beat_bars: Sprite[] = []
let sprite_beat_pointer: Sprite = null
let text_current_beat: TextSprite = null
let current_beat_text = ""
let offtime = 0
let last_beat = 0
let beat_of_measure = 0
let metronome_en = false
let beat_precision = 0
let beats_per_measure = 0
let beats_per_minute = 0
stats.turnStats(true)
beats_per_minute = 120
beats_per_measure = 4
beat_precision = 1
metronome_en = false
beat_of_measure = 0
last_beat = -500
offtime = 0
current_beat_text = "" + (Math.floor(beat_of_measure / beat_precision) + 1) + "/" + beats_per_measure
scene.setBackgroundColor(13)
create_metronome_measure()
create_beat_pointer()
create_text_sprites()
enable_metronome(false)
controller.configureRepeatEventDefaults(500, 50)
game.onUpdate(function () {
    text_beats_per_minute.setText("" + beats_per_minute)
    text_beats_per_measure.setText("" + beats_per_measure)
    if (beat_precision > 1) {
        text_divisions_per_beat.setText("" + beat_precision)
    } else {
        text_divisions_per_beat.setText("No")
    }
    sprites.readDataSprite(text_divisions_per_beat, "label").left = text_divisions_per_beat.right + 4
    for (let temp_text of sprites.allOfKind(SpriteKind.Text)) {
        if (!(sprites.readDataBoolean(temp_text, "has_label"))) {
            continue;
        }
        sprites.readDataSprite(temp_text, "label").left = temp_text.right + 4
    }
})
forever(function () {
    if (metronome_en) {
        if (game.runtime() - (last_beat - offtime) >= 60 / (beats_per_minute * beat_precision) * 1000) {
            offtime = game.runtime() - (last_beat - offtime) - 60 / (beats_per_minute * beat_precision) * 1000
            last_beat = game.runtime()
            music.stopAllSounds()
            if (beat_of_measure == 0) {
                music.playTone(523, music.beat(BeatFraction.Eighth))
            } else if (beat_of_measure % beat_precision == 0) {
                music.playTone(262, music.beat(BeatFraction.Eighth))
            } else {
                music.playTone(131, music.beat(BeatFraction.Eighth))
            }
            sprite_beat_pointer.x = sprites_beat_bars[beat_of_measure].x
            current_beat_text = "" + (Math.floor(beat_of_measure / beat_precision) + 1) + "/" + beats_per_measure
            text_current_beat.setText(current_beat_text)
            text_current_beat.right = scene.screenWidth() - 8
            highlight_beat(beat_of_measure)
            beat_of_measure += 1
            if (beat_of_measure >= beats_per_measure * beat_precision) {
                beat_of_measure = 0
            }
        }
    }
})
