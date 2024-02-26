extends KinematicBody2D

var velocity = Vector2()
var tiles
var sprite
var jumping = false

func _ready():
	tiles = get_parent().get_node("Map")
	sprite = $"Sprite"

# Inspired from: https://docs.godotengine.org/en/3.0/tutorials/physics/using_kinematic_body_2d.html
func get_input():
	# Detect up/down/left/right keystate and only move when pressed 
	if Input.is_action_pressed("nokia_6"):
		velocity.x += 20
		sprite.play("walk_right")
	if Input.is_action_pressed("nokia_4"):
		velocity.x -= 20
		sprite.play("walk_left")
	if Input.is_action_just_pressed("nokia_2") and jumping:
		position.y -= 10
		velocity.y -= 30
		sprite.play("jump")
	if Input.is_action_just_released("nokia_4") or Input.is_action_just_released("nokia_6"):
		sprite.stop()
	if Input.is_action_just_released("nokia_2"):
		tiles.check_collision()
		jumping = false
	velocity = velocity.normalized() * 20
	
	
func _physics_process(delta):
	if is_on_wall():
		get_input()
		
	# Return to normal position
	if not sprite.playing:
		jumping = true
		sprite.play("default")
	
	velocity.y += 70 * delta
	
	var _a = move_and_slide(velocity)
	
	if Input.is_action_just_pressed("nokia_2"):
		# check if jump anim, and if no collision
		# decrease y again
		if sprite.animation == "jump" and get_slide_count() <= 0:
			position.y -= 10
