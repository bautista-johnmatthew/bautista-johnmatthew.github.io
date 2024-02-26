extends Node


var music:AudioStream = preload("res://data/music/jingle1.wav")
var scores = [0, 0, 0, 0, 0]

func _ready() -> void:
	AudioManager.play_music(music)

func victory():
	var scene = preload("res://data/scenes/Victory.tscn").instance()
	add_child(scene)
	var ui = $"UI"
	remove_child(ui)
