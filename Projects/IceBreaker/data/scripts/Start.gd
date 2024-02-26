extends Node

var accept = false
var bg_music:AudioStream = preload("res://data/music/bad_melody.wav")

func _ready():
	AudioManager.play_music(bg_music)

func _process(_delta):
	if Input.is_action_just_pressed("ui_accept") and not accept:
		# Add the Game scene
		var scene = preload("res://data/scenes/Game.tscn").instance()
		add_child(scene)
		var start = $"Start"
		remove_child(start)
		accept = true

