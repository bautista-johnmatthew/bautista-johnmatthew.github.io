extends Node


var _music:AudioStreamPlayer
var _sfx:AudioStreamPlayer


func _ready() -> void:
	_music = AudioStreamPlayer.new()
	_music.bus = "Music"
	_sfx = AudioStreamPlayer.new()
	_sfx.bus = "Sfx"
	var _b = _sfx.connect("finished", self, "_on_sfx_finished")
	var _a = _music.connect("finished", self, "_on_music_finished")
	add_child(_music)
	add_child(_sfx)


func play_music(music_stream: AudioStream) -> void:
	_music.stop()
	_music.stream = music_stream
	_music.play()


func stop_music() -> void:
	_music.stop()

func play_sfx(sfx_stream: AudioStream) -> void:
	_music.stream_paused = true
	_sfx.stop()
	_sfx.stream = sfx_stream
	_sfx.play()
	yield(get_tree().create_timer(1.0), "timeout")
	_music.stream_paused = false


func _on_sfx_finished() -> void:
	AudioServer.set_bus_mute(1, false)

func _on_music_finished() -> void:
	AudioServer.set_bus_mute(1, false)
	_music.play()
