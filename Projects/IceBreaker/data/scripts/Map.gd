extends Node2D

# The other nodes
var platforms
var area
var mc
var sprite
var main
# Variables for the tiles
var tile_index 
var tile_pos

var jump_sfx:AudioStream = preload("res://data/sfx/blip10.wav")
var coin_sfx:AudioStream = preload("res://data/sfx/good3.wav")

func _ready():
	platforms = $"Platforms"
	area = $"Area"
	sprite = get_parent().get_node("MainCharacter/Sprite")
	mc = get_parent().get_node("MainCharacter")
	main = get_parent().get_parent()

func _process(_delta):
	check_event()

func check_collision():
	# When there is no collision
	if mc.get_slide_count() <= 0:
		return
	var slide_collision = mc.get_slide_collision(0)
	# Convert the collided into tile coords
	tile_pos = slide_collision.position
	tile_pos.x = tile_pos.x / 16
	tile_pos.y = tile_pos.y / 16
	tile_index = platforms.get_cellv(tile_pos)

	if slide_collision.collider.is_in_group("Breakable"):
		# 4 denotes the platform1 index
		# Erase the platform
		if tile_index == 4:
			platforms.set_cellv(tile_pos, -1)
			main.scores[tile_index - 4] += 1
			AudioManager.play_sfx(jump_sfx)
		elif tile_index > 4 and tile_index < 8:
		# Reduce the durability
			platforms.set_cellv(tile_pos, tile_index - 1)
			main.scores[tile_index - 4] += 1
			AudioManager.play_sfx(jump_sfx)
			

func check_event():
	if mc.get_slide_count() <= 0:
		return
	var slide_collision = mc.get_slide_collision(0)
	# Convert the collided into tile coords
	tile_pos = slide_collision.position
	tile_pos.x = tile_pos.x / 16
	tile_pos.y = tile_pos.y / 16
	tile_index = platforms.get_cellv(tile_pos)
	
	# When hitting a snowflake
	if slide_collision.collider.is_in_group("Solid"):
		tile_index = area.get_cellv(tile_pos)
		if tile_index == 11:
			AudioManager.play_sfx(coin_sfx)
			area.set_cellv(tile_pos, -1)
			main.scores[4] += 1
	
	if slide_collision.collider.is_in_group("Breakable"):
		# When colliding with a pillar or midair
		if tile_index == -1 or tile_index == 3:
			mc.jumping = false
		if tile_index == 11:
			main.victory()
			
		# Changing speed on conveyors
		var speed = 30
		if mc.position.y < 230:
			speed = 60
		# Conveyor belt platforms
		if tile_index == 9:
			mc.velocity.x += speed
		elif tile_index == 10:
			mc.velocity.x -= speed
		


