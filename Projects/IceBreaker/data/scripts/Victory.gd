extends Control
# This node does;t work seperately
var game
var scoreboard
var bg_music:AudioStream = preload("res://data/music/bad_melody.wav")

# Called when the node enters the scene tree for the first time.
func _ready():
	AudioManager.play_music(bg_music)
	game = get_parent()
	scoreboard = $"Icons/Scoreboard"
	var format_string = "%d x 10 \n%d x 10 \n%d x 10 \n%d x 10 \n%d x 30 \nTotal : %d"
	# Calculation of score
	var total = game.scores[4] * 30
	for i in range(0,4):
		total += game.scores[i] * 10
	var actual_string = format_string % [game.scores[3], game.scores[2], game.scores[1], game.scores[0], game.scores[4], total]
	scoreboard.clear()
	scoreboard.append_bbcode(actual_string)


func _process(_delta):
	if Input.is_action_just_pressed("ui_accept"):
		var _a = get_tree().reload_current_scene()
