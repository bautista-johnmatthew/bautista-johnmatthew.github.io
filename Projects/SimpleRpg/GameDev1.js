// Main canvas
const mcvs = $("#main_canvas");
const mcvsC = document.querySelector("#main_canvas").getContext("2d");
const MAIN_MAP = $("#Game_elements");
const START_SCREEN = $("#Start_screen");
// These variables are for the efx and weapon animations
const EQ_ELE_C = document.querySelector("#Equipped").getContext("2d");
const efx_canvas = document.querySelector("#efx_canvas");
const efx_cntxt = efx_canvas.getContext("2d");

// This object dictates which screen is active
var map_states = {
	start_screen: 1,
	gameover_screen: 0,
	main_map: 0,
	adventure_map: 0
}

// These are the functions to draw on the main_canvas
var draw_functions = {
	main_map_draw: function () {
		//Main_map or House_map
		mcvsC.beginPath(); mcvsC.rect(0, 0, 360, 240); mcvsC.fillStyle = "rgb(174,174,120)"; mcvsC.fill(); // Background
		mcvsC.beginPath(); mcvsC.rect(0, 0, 360, 30); mcvsC.fillStyle = "rgb(94,50,50)"; mcvs.strokeStyle = "rgb(94,50,50)"; mcvsC.fill(); mcvsC.stroke();
		mcvsC.beginPath(); mcvsC.rect(30, 0, 30, 30); mcvsC.fillStyle = "rgb(250,250,250)"; mcvsC.fill(); mcvsC.stroke();
		//The top corner representing the walls
		mcvsC.beginPath(); mcvsC.rect(60, 125, 90, 35); mcvsC.fillStyle = "#fff"; mcvsC.fill();
		mcvsC.lineWidth = "2"; mcvsC.strokeStyle = "#533"; mcvsC.moveTo(60, 150); mcvsC.lineTo(60, 180); mcvsC.moveTo(150, 150); mcvsC.lineTo(150, 180); mcvsC.stroke();//Table
		
		// Makes the map visible
		MAIN_MAP.css("display", "block"); 
		Movement.calibrate();
		map_states.main_map = 1;
		// Draws npc
		human_charac(Mc.cntxt, 0); human_charac(WIZARD_C, 100); 
		// Drawing the canvas Weapons
		WeaponClass.sword_design(WeaponClass.SWORD_C); 
		WeaponClass.spear_design(WeaponClass.SPEAR_C); 
		WeaponClass.hammer_design(WeaponClass.HAMMER_C);
	},
	adventure_map_draw: function () {
		// It creates a weird extended line idk where it came from
		function tree_tile(c, x, y) {
			// Trunk
			c.beginPath();c.rect(x + 12, y + 10, 6, 20);c.fillStyle = "rgb(200,120,100)";c.fill();
			// Leaves
			c.fillStyle = "rgba(0,100,0,0.9)";
			c.beginPath(); c.moveTo(x + 15, y);c.lineTo(x + 25, y + 10); c.lineTo(x + 5, y + 10);c.fill(); // Top part
			c.beginPath(); c.moveTo(x + 15, y + 5);c.lineTo(x + 27.5, y + 15); c.lineTo(x + 2.5, y + 15);c.fill(); // Middle part
			c.beginPath(); c.moveTo(x + 15, y + 10);c.lineTo(x + 30, y + 20); c.lineTo(x, y + 20);c.fill(); // Bottom part
		}
		// Adventure_map or area of encounters
		mcvsC.clearRect(0, 0, 360, 240);
		mcvsC.beginPath();mcvsC.rect(0, 0, 360, 240);mcvsC.fillStyle = "rgb(0,180,90)";mcvsC.fill();
		for (let i = 0; i < 360; i += 30)
		{
			tree_tile(mcvsC, i, 0);
			tree_tile(mcvsC, i, 210);
		}
	}
}

// Object called Mc containg the x and y positions, and other properties
var Mc = {
	name: "main_character",
	health: 100,
	x: 3,
	y: 0,
	// Variables that dictate whether left,right,etc. movements are allowed
	// The function check_collision updates the variables; u,d,l,r, to either 1 or 0 allowing movement
	u: "", d: "", l: "", r: "",
	facing: "",
	ele: $("#main_character"),
	cntxt: document.querySelector("#main_character").getContext("2d"),
	// The WeaponClass object will be stored here
	equipped_weapon: null,
	// The DOM itself is equipped_element
	equipped_element: $("#Equipped"),
	// This function applies damage to the Mc
	hit: function (enemy) 
	{
		this.health = this.health - enemy.dmg;
		let health = this.health;
		console.log(health);
		if (health <= 0) {
			this.gameover();
		}
	
		// Change mc color based on remaining health
		this.cntxt.clearRect(0, 0, 30, 30);
		if (health <= 80 && health >= 70) { human_charac(this.cntxt, 250 - 80);}
		else if (health < 70 && health >= 50) { human_charac(this.cntxt, 250 - 50);}
		else if (health < 50 && health >= 30) { human_charac(this.cntxt, 250 - 20);}
		else if (health < 30 && health >= 10) { human_charac(this.cntxt, 250);}
		else 
		{
			human_charac(this.cntxt, 0);
		}
	},

	// Creates the gameover screen
	gameover: function ()
	{
		// Prevent further actions
		if (map_states.gameover_screen == 1)
		{
			return;
		}
		MAIN_MAP.remove();
		// Except for the A button
		Controls.A_BTN.on("touchstart mousedown", () => { Controls.press_A();})
		$(document).on("keypress", function (event) 
		{
			if (event.key == "k" || event.key == "a"){ Controls.press_A();}
		});

		// Create a new div element
		let gameover_screen = "<div class=main_screen> <h1> Game Over </h1> <p> You survived upto level "
		+ EnemyClass.difficulty + "</p> <p class=blink> Press A to Play Again </p> </div>";
		$("body").prepend(gameover_screen);
		map_states.gameover_screen = 1;
	},

	// Creates the victory screen
	victory : function ()
	{
		Controls.controls_active();
		MAIN_MAP.remove();
		let victory_screen = "<div class=main_screen> <h1> Victory </h1> <p> You defeated the slimes! </p> <p> You survived upto level "
+ EnemyClass.difficulty + "</p> <p class = blink> Press A to Play Again </p> </div>";

		$("body").prepend(victory_screen)
		map_states.gameover_screen = 1
	}
}

// Wizard character as npc
const WIZARD_C = document.querySelector("#wizard_character").getContext("2d");
const WIZARD = $("#wizard_character");

// Kind of related to the Mc object
// Draws the design for human characters (optional color value for their bodies)
function human_charac(C, color) {
	C.beginPath(); C.rect(5, 2, 20, 14); C.fillStyle = "rgb(238, 238, 170)"; C.fill(); // Head
	C.beginPath(); C.rect(11, 7, 5, 4); C.fillStyle = "rgb(0, 153, 255)"; C.fill(); // L eye
	C.beginPath(); C.rect(19, 7, 5, 4); C.fillStyle = "rgb(0, 153, 255)"; C.fill(); // R eye
	C.beginPath(); C.rect(5, 16, 20, 12); C.fillStyle = "rgb(0" + color + ", 136, 136)"; C.fill(); // Body
	C.beginPath(); C.rect(5, 26, 8, 4); C.fillStyle = "#111"; C.fill(); // L leg
	C.beginPath(); C.rect(17, 26, 8, 4); C.fillStyle = "#111"; C.fill(); // R leg
}


// Enemy class
// The class contains the behavior like tracking, attacking, and health
class EnemyClass {
	// Stores the Enemy instances
	static enemy_array = [];
	// Basis for the enemy id's
	static enemy_count = 0;
	// Basis for the enemy strength
	static difficulty = 2;

	constructor(h, x, y, id) {
		this.name = id;
		this.health = h;
		this.x = x;
		this.y = y;
		this.element = $("#" + id);
		this.facing = "";
		this.dmg = 10;
		this.u = "0";
		this.d = "0";
		this.l = "0";
		this.r = "0";
	}

	// Starts the creation of an enemy element
	// Takes additional values as the starting x coordinates
	// When calling for the first time set value to -1
	static spawn(x, y) {
		// Creation of element in the DOM
		let id = "enemy" + this.enemy_count;
		let enemy_cvs = "<canvas height=30 width=30 id=" + id + " class=enemy></canvas>";
		EnemyClass.enemy_count++;
		MAIN_MAP.prepend(enemy_cvs);

		EnemyClass.create_enemy(id, x, y);
	}

	// This draws and makes the EnemyClass object
	static create_enemy(id, x, y) {
		let cntxt = document.getElementById(id).getContext("2d");
		let enemy_object;
		// The slimes increase in health
		let health = 100 + EnemyClass.difficulty * 5;

		// When spawning normally
		if (x == -1 && y == -1) 
		{
			// Randomises whether spawns at left most or right most side
			let new_x = ((Math.random() * 2) > 1) ? 33 : 3;
			// Randomises y position
			let new_y = Math.round((Math.random() * 7)) * 3;
			enemy_object = new EnemyClass(health, new_x, new_y, id);
		}
		// When "multiplying"
		else {
			enemy_object = new EnemyClass(health, x, y, id);
		}

		EnemyClass.enemy_array.push(enemy_object);
		enemy_object.calibrate_enemy();
		enemy_object.draw_enemy(cntxt);
	}

	// Draws the design of the enemy
	draw_enemy(c, x = 15, y = 20) {
		c.strokeStyle = "rgb(77,77,77)";
		c.lineWidth = "2"
		// Body
		c.fillStyle = "rgba(100,100,255,0.8)";
		c.beginPath(); c.arc(x, y, 10, 0, Math.PI, 1); c.stroke(); c.fill();
		c.beginPath(); c.arc(x, y - 13.6, 16.8, Math.PI * 0.3, Math.PI * 0.7); c.stroke(); c.fill();
		// Shadow
		c.fillStyle = "rgba(50,50,255,0.4)";
		c.beginPath(); c.arc(x, y + 12.5, 16, Math.PI * 1.3, Math.PI * 1.7); c.fill();
		c.beginPath(); c.arc(x, y - 13.5, 16, Math.PI * 0.3, Math.PI * 0.7); c.fill();
		// L eye
		c.beginPath(); c.fillStyle = "rgb(250,250,250)";
		c.arc(x - 5, y - 5, 2, Math.PI * 1.3, Math.PI * 1.7); c.fill();
		c.arc(x - 5, y - 5, 2, Math.PI * 0.3, Math.PI * 0.7); c.fill();
		// R eye
		c.beginPath(); c.fillStyle = "rgb(250,250,250)";
		c.arc(x, y - 5, 2, Math.PI * 1.3, Math.PI * 1.7); c.fill();
		c.arc(x, y - 5, 2, Math.PI * 0.3, Math.PI * 0.7); c.fill();
	}

	// Iterates over the present enemies and activate movement
	static enemy_move() {
		for (let i = 0; i < EnemyClass.enemy_array.length; i++) {
			Movement.check_collision(EnemyClass.enemy_array[i]);
			EnemyClass.enemy_array[i].check_distance();
			EnemyClass.enemy_array[i].calibrate_enemy();
		}

	}

	// Decides the enemy action whether to move, spawn, or attack
	check_distance() {
		let choice = Math.round(Math.random() * 2);

		// First statement is to detect if enemy is already nearby if not then it updates
		if (Mc.y == this.y && (Mc.x - 3 == this.x || Mc.x + 3 == this.x)) {
			// The mc is infront or same y coords so attack
			this.calibrate_enemy();
			this.enemy_attack();
		}
		else if (choice == 1) {
			//update y
			if (Mc.y > this.y && this.d == "1") { this.y += 3; }
			else if (Mc.y < this.y && this.u == "1") { this.y -= 3; }
			else if (Mc.y == this.y) { return;}
		}
		else if (choice == 2) {
			//update x
			if (Mc.x > this.x && this.r == "1") { this.x += 3; this.facing = "right";}
			else if (Mc.x < this.x && this.l) { this.x -= 3; this.facing = "left";}
			else if (Mc.x == this.x) { return;}
		}
		// The enemy multplies itself
		else {
			// Unless there is too many enemies
			if (EnemyClass.enemy_array.length > Math.round(EnemyClass.difficulty / 2)){ this.check_distance(); return;}
			// This prevents it exceeding borders
			let temp_y = (this.y == 21) ? 18 : this.y + 3;
			EnemyClass.spawn(this.x, temp_y);
		}
	}

	// Updates the element's position in the html
	calibrate_enemy() 
	{
		if (this.facing == "left") { $(this.element).css("transform", "scale(1, 1)");}
		else if (this.facing == "right") { $(this.element).css("transform", "scale(-1, 1)");}
		$(this.element).animate({ "top": this.y + "rem", "left": this.x + "rem" }, 400);
	}

	// Plays the animation for the attack of the enemy
	async enemy_attack() {
		await Events.notif("You got hit hp : " + Mc.health);

		function attack_anim (c, x, y, i)
		{
			c.strokeStyle = "rgb(0,200,200)"; c.fillStyle = "rgb(0,0,255)"; c.lineWidth = 5 - i / 3.5; c.save(); c.clearRect(x, y, 30, 30);
			c.beginPath(); c.arc(x - i, y + i, 3.5, 0, Math.PI * 2, 0); c.stroke(); c.fill();
			c.beginPath(); c.arc((x + 3.5), (y - 6) - i, 3.5, 0, Math.PI * 2, 0); c.stroke(); c.fill();
			c.beginPath(); c.arc((x + 6) + i, y + i, 3.5, 0, Math.PI * 2, 0); c.stroke(); c.fill();
			i += 2.5;
			let a = setTimeout(attack_anim, 150, c, x, y, i);
			if (i == 10) {
				clearTimeout(a);
				Controls.controls_active();
				Mc.equipped_element.css({ "transform": "", "animation": "" });
				c.clearRect(0, 0, 360, 240);
			}
		}
		attack_anim(efx_cntxt, this.x * 10 + 15, this.y * 10 + 15, 0);
		// The application of damage is local to the Mc
		Mc.hit(this);
	}

	// Applies damage to the chosen enemy
	async declare_hit ()
	{
		this.health = this.health - Mc.equipped_weapon.base_dmg;
		await Events.notif(this.name + " hp: " + this.health)
		// Animation of getting hit
		$(this.element).animate({"background-color": "rgb(255,0,0)"}, 300);
		if (this.health <= 0)
		{
			this.death();
		}
	}

	// When the enemy's health is depleted
	death ()
	{
		// Remove from the array	
		EnemyClass.enemy_array.splice(EnemyClass.enemy_array.indexOf(this), 1);
		$(this.element).remove();
		EnemyClass.difficulty += 1

		// If all the enemies are cleared declare victory
		if (EnemyClass.enemy_array.length <= 0) { Mc.victory();}
	}

}


// Weapons
// A class instanced to create a weapon object
// The elements in the DOM are created beforehand
class WeaponClass {
	// Limit of attacking per turn
	static usage = 0;
	// Declaration of variables for the weapon's canvas context
	static SWORD_C = document.querySelector("#WSO_1").getContext("2d");
	static SPEAR_C = document.querySelector("#WSO_2").getContext("2d");
	static HAMMER_C = document.querySelector("#WSO_3").getContext("2d");

	constructor(type, dmg, rnge, use_times, element) 
	{
		this.wpn_type = type;
		this.base_dmg = dmg;
		this.range = rnge
		this.uses = use_times;
		this.name = type;
		this.ele = element;
	}

	// The design of the weapons
	static sword_design(C) {
		C.beginPath(); C.moveTo(150, 240); C.lineTo(150, 50); C.strokeStyle = "rgb(88,88,88)"; C.lineWidth = "10"; C.stroke();
		C.beginPath(); C.rect(120, 240, 60, 10); C.fillStyle = "rgb(0,0,100)"; C.fill(); C.lineWidth = "4"; C.stroke();
		C.beginPath(); C.rect(145, 250, 10, 40); C.fill(); C.stroke(); //The last 2 lines of rect are the handle

	}
	static spear_design(C) {
		C.beginPath(); C.moveTo(150, 300); C.lineTo(150, 40); C.strokeStyle = "rgb(88,88,88)"; C.lineWidth = "8"; C.stroke();
		C.beginPath(); C.moveTo(150, 40); C.lineTo(130, 120); C.lineTo(170, 120); C.lineTo(150, 40); //The triangle
		C.fillStyle = "rgb(99,99,99)"; C.fill(); C.strokeStyle = "rgb(200,200,80)"; C.lineWidth = "4"; C.stroke();
	}
	static hammer_design(C) {
		C.beginPath(); C.moveTo(150, 100); C.lineTo(150, 290); C.lineWidth = "9"; C.strokeStyle = "rgb(88,88,88)"; C.stroke();
		C.beginPath(); C.rect(80, 40, 140, 60); C.fillStyle = "rgb(100,88,88)"; C.fill(); C.strokeStyle = "rgb(200,80,80)"; C.lineWidth = "5"; C.stroke(); //The head
	}

	// Weapon animations
	static slash_anim(c, x, y, i, d) {
		c.strokeStyle = "rgba(0,0,100,.8)"; c.lineWidth = "4"; c.fillStyle = "rgb(0,100,200)"; c.save();
		c.clearRect(0, 0, 360, 240);
		// This section checks and changes arguments depending whether Mc is left or right facing
		let end_point;
		let rotation;
		if (d == -1) { end_point = Math.PI * (1 - i); rotation = 1; }
		else { end_point = Math.PI * i; rotation = 0 }

		c.beginPath(); c.arc(x - 10 * d, y, 15, Math.PI * (1.5 + i * d), end_point, rotation); c.stroke(); c.fill();
		c.beginPath(); c.arc(x - 15 * d, y, 15, Math.PI * (1.5 + i * d), end_point, rotation); c.stroke(); c.fill();
		c.beginPath(); c.arc(x - 20 * d, y, 15, Math.PI * (1.5 + i * d), end_point, rotation); c.stroke(); c.fill();
		i += .15;
		let a = setTimeout(WeaponClass.slash_anim, 250, c, x, y, i, d);
		// This is the end conditon of the animations
		if (i > .45) {
			// These lines reset the animation and controls
			clearTimeout(a);
			Controls.controls_active();
			Mc.equipped_element.css({ "transform": "", "animation": "" });
			c.clearRect(0, 0, 360, 240);
		}
	}

	static strike_anim(c, x, y, i, d) {
		c.strokeStyle = "rgb(0,100," + (100 + i) + ")"; c.lineWidth = "4"; c.fillStyle = "rgb(200,200,80)"; c.save(); c.clearRect(0, 0, 360, 300);
		c.beginPath(); c.moveTo((x + 3.5) + i, y); c.lineTo(x + i, y + 6); c.lineTo((x + 6) + i, y + 6); c.lineTo((x + 3.5) + i, y + 11); c.lineTo((x + 3.5) + i, y);
		c.stroke(); c.fill();
		i += 5 * d;
		let a = setTimeout(WeaponClass.strike_anim, 100, c, x, y, i, d);
		if (i == 25 * d) {
			clearTimeout(a);
			Controls.controls_active();
			Mc.equipped_element.css({ "transform": "", "animation": "" });
			c.clearRect(0, 0, 360, 300);
		}
	}

	static smash_anim(c, x, y, i) {
		c.strokeStyle = "rgb(200,200,0)"; c.fillStyle = "rgb(" + (80 + i) + ",0,0)"; c.lineWidth = 5 - i / 3.5; c.save(); c.clearRect(0, 0, 360, 300);
		c.beginPath(); c.arc(x - i, y + i, 3.5, 0, Math.PI * 2, 0); c.stroke(); c.fill();
		c.beginPath(); c.arc((x + 3.5), (y - 6) - i, 3.5, 0, Math.PI * 2, 0); c.stroke(); c.fill();
		c.beginPath(); c.arc((x + 6) + i, y + i, 3.5, 0, Math.PI * 2, 0); c.stroke(); c.fill();
		i += 2.5;
		let a = setTimeout(WeaponClass.smash_anim, 150, c, x, y, i);
		if (i == 10) {
			clearTimeout(a);
			Controls.controls_active();
			Mc.equipped_element.css({ "transform": "", "animation": "" });
			c.clearRect(0, 0, 360, 300);
		}
	}

	// The basic attack animation of any weapon and applies the attacking functionality
	async basic_attack() 
	{
		// Checks the maximum usage of a weapon per turn
		if (WeaponClass.usage >= this.uses)
		{
			await Events.notif("Out of Stamina");
			return true;
		}
		else 
		{
			WeaponClass.usage += 1;
		}
		
		// Checks if enemies are hit
		this.check_hit();

		// Stores what the animation should be for the weapon, whether right or left facing
		let weapon_anim = ""
		// Dictates the direction of animation whether 1 or -1
		// And manipulate animation x position through the plus variable
		let anim_d = 0  
		let plus = (anim_d == -1) ? 20 : 50;

		// Checks what direction its facing
		if (Mc.facing == "right") {
			weapon_anim = "basic_atk 500ms linear 0ms";
			anim_d = 1;
			Mc.equipped_element.css("left", (Mc.x + 1) + "rem");
		}
		else if (Mc.facing == "left") {
			weapon_anim = "basic_atk_left 500ms linear 0ms";
			anim_d = -1;
			Mc.equipped_element.css("left", (Mc.x - 3) + "rem");
		}

		//This line plays the animation based of weapon type
		this.ele.css("animation", weapon_anim);
		switch (this.wpn_type) {
			case "Sword":
				WeaponClass.slash_anim(efx_cntxt, (Mc.x * 10) + (plus * anim_d), (Mc.y * 10) + 10, 0.15, anim_d);
				break;
			case "Spear":
				WeaponClass.strike_anim(efx_cntxt, (Mc.x * 10) + (plus * anim_d), (Mc.y * 10) + 5, 0, anim_d);
				break;
			case "Hammer":
				WeaponClass.smash_anim(efx_cntxt, (Mc.x * 10) + (plus * anim_d), (Mc.y * 10) + 20, 0);
				break;
			default:
				await Events.notif("Error");
		}
	}

	// Checks if the enemies are in the range of the attack
	check_hit() 
	{
		// d = direction, dictates what x position to search
		let d;
		if (Mc.facing == "right"){d = 1;}
		else if (Mc.facing == "left"){d = -1;}

		for (let i = 0; i < EnemyClass.enemy_array.length; i++)
		{
			let current = EnemyClass.enemy_array[i];
			for (let j = this.range; j > 0; j--)
			{
				let hit_x = Mc.x + (j * 3 * d);
				if (current.x == hit_x && current.y == Mc.y)
				{ 
					current.declare_hit(); 
				}
			}
		}
		return;
	}

}


// Movement Section
// Note: The map has 7 rows 11 columns with 3rem each 'block'
// Checking functions for events and boundaries
var Movement = {
	// Checks the collision with elements on the map
	// Also signals the completion of a movement
	check_collision : function(obj) 
	{
		// Normal Restrictions for any screen
		if (obj.y > 0) { obj.u = "1"; } else if (obj.y <= 0) { obj.u = "0"; }
		if (obj.y < 21) { obj.d = "1"; } else if (obj.y >= 21) { obj.d = "0"; }
		if (obj.x > 0) { obj.l = "1"; } else if (obj.x <= 0) { obj.l = "0"; }
		if (obj.x < 33) { obj.r = "1"; } else if (obj.x >= 33) { obj.r = "0"; }

		// When the Mc moves again the weapon usage resets
		if (obj.name == "main_character")
		{
			WeaponClass.usage = 0;
		}

		if (map_states.main_map == 1) {
			// Restrictions for the table
			if (obj.x < 15 && obj.x > 3) {
				if (obj.y == 9) { obj.d = "0"; }
				if (obj.y == 15) { obj.u = "0"; }
			}
			if (obj.x == 3 && obj.y == 12) { obj.r = "0";}
			if (obj.x == 15 && obj.y == 12) { obj.l = "0";}
			// Wizard character borders
			if (obj.x == 12 && obj.y == 18) { obj.r = "0";}
			if (obj.x == 18 && obj.y == 18) { obj.l = "0";}
			if (obj.x == 15 && obj.y == 15) { obj.d = "0";}
			if (obj.x == 15 && obj.y == 21) { obj.u = "0";}
		}
		// If the enemies are activated also call check_collision_characters
		else if (map_states.adventure_map == 1)
		{
			this.check_collision_characters(obj);
		}		
		return;
	},

	// Checks if the chosen object collides with other objects
	check_collision_characters : function (obj)
	{
		let x = obj.x;
		let y = obj.y;
		let auto_attack = false;

		for (let i = 0; i < EnemyClass.enemy_array.length; i++)
		{
			let current = EnemyClass.enemy_array[i];

			// If its the Mc enable auto_attack
			if (obj.name == "main_character") { auto_attack = true;}
			// If the obj is also an enemy check when it hits the Mc
			else if (obj.name == current.name) { current = Mc;}
			
			// If the other enemies are beside the current obj
			if (x + 3 == current.x && y == current.y)
			{
				// Auto attacks if the mc is about to face the enemy	
				if (auto_attack && obj.facing == "right") {					
					obj.equipped_weapon.basic_attack();
					WeaponClass.usage = 0;
				}
				obj.r = "0";
			}
			if (x - 3 == current.x && y == current.y)
			{
				if (auto_attack && obj.facing == "left") { 					
					obj.equipped_weapon.basic_attack();
					WeaponClass.usage = 0;
				}
				obj.l = "0";
			}

			// Below or above
			if (y == current.y + 3 && x == current.x){ obj.u = "0";}
			if (y == current.y - 3 && x == current.x){ obj.d = "0";}
		}
	},

	//Function to match Mc.y and Mc.x with actual position
	calibrate : function() 
	{
		Mc.ele.animate({ top: Mc.y + "rem", left: Mc.x + "rem" }, 400);
		// If the weapon was chosen align it beside the Mc
		if (Events.event_state.weapon_choosing == 1) 
		{
			let add = (Mc.facing == "right") ? 1 : -3;
			Mc.equipped_element.animate({ "left": (Mc.x + add) + "rem", "top": (Mc.y - 1.5) + "rem" }, 400);
		}
		// If a battle is happening activate movement of the enemies
		// Simulates a 'turn'
		if (Events.event_state.exit_house == 1) 
		{
			EnemyClass.enemy_move();
		}
	}
}


// Controls
var Controls = {
	// Varaibles of the button elements
	UP_BTN: $("#Up_Button"),
	DWN_BTN: $("#Down_Button"),
	LFT_BTN: $("#Left_Button"),
	RHT_BTN: $("#Right_Button"),
	A_BTN: $("#A_Button"),
	B_BTN: $("#B_Button"),
	HOW2_BTN: $("#Tutorial"),

	// Functions that change positions of Mc
	go_up: function () 
	{
		Movement.check_collision(Mc);
		if (Mc.u == "1") { Mc.y -= 3; }
	},

	go_down: function () 
	{
		Movement.check_collision(Mc);
		if (Mc.d == "1") { Mc.y += 3; }//I removed calibrate here
	},

	go_left: function () 
	{
		Mc.ele.css({ "transform": "scale(-1,1)" });
		Mc.facing = "left";
		Movement.check_collision(Mc);
		if (Mc.l == "1") { Mc.x -= 3; }
	},

	go_right: function () 
	{
		Mc.ele.css({ "transform": "scale(1,1)" });
		Mc.facing = "right"
		Movement.check_collision(Mc);
		if (Mc.r == "1") { Mc.x += 3; }
	},

	// Basic interaction that calls check_event
	// Allows further modification for A button
	press_A: function () 
	{
		Events.check_event();
	},

	// The button for attacking
	press_B: function () 
	{
		// Prevent activation without a weapon equipped
		if (Events.event_state.weapon_choosing == 0){ return;}
		Controls.controls_deactivate();
		if (Mc.equipped_weapon.basic_attack())
		{
			Controls.controls_active();
		}
	},

	// Attaches the function to the chosen keyboard keys
	// Unprecedented behavior, spamming queues each press
	keyboard_support: function () {
		var clicks = 0;

		$(document).on("keypress", function (event) {	
			// This part is to prevent holding down a key
			clicks += 1;
			if (clicks > 3){ return;}

			switch (event.key) 
			{
				case ("k"):
					Controls.press_A();
					break;
				case ("l"):
					Controls.press_B();
					break;
				case ("w"):
					Controls.go_up();
					Movement.calibrate();
					break;
				case ("s"):
					Controls.go_down();
					Movement.calibrate();
					break;
				case ("a"):
					Controls.go_left();
					Movement.calibrate();
					break;
				case ("d"):
					Controls.go_right();
					Movement.calibrate();
					break;
				// These numbers are temporary for testing 
				case ("h"):
					Events.tutorial();
					break;
				default:
					return;
			};

			$(document).on("keyup", () => { clicks = 0;})
		});
	},

	// Remove the event listeners of the buttons
	// To prevent spamming
	controls_deactivate: function () {
		this.UP_BTN.off("touchstart");
		this.UP_BTN.off("touchend");
		this.DWN_BTN.off("touchstart");
		this.DWN_BTN.off("touchend");
		this.LFT_BTN.off("touchstart");
		this.LFT_BTN.off("touchend");
		this.RHT_BTN.off("touchstart");
		this.RHT_BTN.off("touchend");
		this.A_BTN.off("touchstart mousedown");
		this.B_BTN.off("touchstart mousedown");
		this.B_BTN.off("touchend mouseup");
		$(document).off("keypress");
	},

	// Attach event listeners to each button with their respective functions
	controls_active: function () {
		// To prevent the assignement of event listeners multiple times
		Controls.controls_deactivate();

		this.UP_BTN.on("touchstart", () => { this.go_up(); });
		this.UP_BTN.on("touchend", () => { Movement.calibrate(); });
		this.DWN_BTN.on("touchstart", () => { this.go_down(); });
		this.DWN_BTN.on("touchend", () => { Movement.calibrate(); });
		this.LFT_BTN.on("touchstart", () => { this.go_left(); });
		this.LFT_BTN.on("touchend", () => { Movement.calibrate(); });
		this.RHT_BTN.on("touchstart", () => { this.go_right(); });
		this.RHT_BTN.on("touchend", () => { Movement.calibrate(); });
		this.A_BTN.on("touchstart mousedown", () => { this.press_A(); });
		this.B_BTN.on("touchstart", () => { Movement.calibrate(); });
		this.B_BTN.on("touchend", () => { this.press_B(); });
		this.HOW2_BTN.on("touchstart", () => { Events.tutorial();});
		Controls.keyboard_support();
	}
}


// In game events
var Events = {
	// Dictates if an event already happened like 'flags'
	event_state: {
		weapon_choosing: 0,
		exit_house: 0
	},

	// Checks the condition for each event
	check_event: function () {
		// Draws the main_map and removes the starting screen
		// This feature is mainly for aesthetics but also to prevent loading all at once
		if (map_states.start_screen == 1) {
			draw_functions.main_map_draw();
			map_states.start_screen = 0;
			START_SCREEN.remove();
			$("#msg_area").css("display", "block"); 
			Controls.controls_active();
		}
		// Restart the game
		if (map_states.gameover_screen == 1)
		{
			// Inspired by: https://stackoverflow.com/questions/5404839/how-do-i-refresh-a-page-using-javascript
			location.reload();
		}
		// Dialog of wizard npc
		if ((map_states.main_map == 1) && (Events.event_state.weapon_choosing == 0) && (Mc.x == 12 && Mc.y == 18)) 
		{ 
			Events.dialog_1(); 
		}  
		// Exiting the main_map and activate adventure_map
		if ((map_states.main_map == 1) && (Events.event_state.weapon_choosing == 1) && (Mc.x == 3 && Mc.y == 0)) 
		{ 
			Events.exit_house_event(); 
		} 
	},

	msg_area : $("#msg_area").find("p"),

	notif : function (text) {				
		return new Promise((resolve) => 
		{					
			// Clear msg area if too much
			if (this.msg_area.contents().length >= 3) {
				setTimeout(() => {
					this.msg_area.empty();
				}, 1000);			
			}	

			setTimeout(() => {
				resolve(this.msg_area.append(text + "\n"))
			}, 1000);								
		})		
	},	

	// Posts a msg that needs button press to continue
	msg : function (text) {				
		return new Promise((resolve) => 
		{			
			// Move on if pressed a key
			Controls.A_BTN.on("touchstart mousedown", () => {				
				resolve(this.msg_area.text(text))
			});
			$(document).on("keypress",(event) => {
				if (event.key == "k" ) {
					resolve(this.msg_area.text(text))
				}
			})
		});		
	},	

	// Activates the dialog of the npc and assigns a weapon for the Mc
	dialog_1: async function () {
		Controls.controls_deactivate();
		Events.event_state.weapon_choosing = 1;
		this.msg_area.text("Welcome my grandson, don't be shocked as I have you called you here. I am in need of your strength and skills as a former adventurer");
		await this.msg("The slimes have appeared in the nearby forest and slowly approaching the town!");
		await this.msg("Choose one of these weapons laid out on the table and eradicate those beasts!!");
		await this.msg("Go on young one so you'll be able to finish before sundown.\n\nGoodluck and be careful.");
		let weapon_choice = prompt(" - Sword (1)\n - Spear (2)\n - Hammer (3)\nWhich is your choice?", "Input number");	

		// Selection of weapon and removal
		if (weapon_choice == 1) {
			WeaponClass.sword_design(EQ_ELE_C); 
			Mc.equipped_weapon = new WeaponClass("Sword", 10, 1, 2, Mc.equipped_element);
		}
		else if (weapon_choice == 2) {
			WeaponClass.spear_design(EQ_ELE_C); 
			Mc.equipped_weapon = new WeaponClass("Spear", 10, 2, 1, Mc.equipped_element);
		}
		else if (weapon_choice == 3) {
			WeaponClass.hammer_design(EQ_ELE_C); 
			Mc.equipped_weapon = new WeaponClass("Hammer", 25, 1, 1, Mc.equipped_element);
		}
		else { 
			Events.event_state.weapon_choosing = 0; 
		} 		

		// Hides the chosen weapon from the table
		let chosen = $(".Weapon_Select_Object");
		chosen.eq(weapon_choice - 1).toggle();
		// Show the equipped weapon on screen
		Mc.equipped_element.css({ "display": "inline" });
		Movement.calibrate();	
		Controls.controls_active();
		setTimeout(() => {
			this.msg_area.empty();
		}, 2000);			
	},

	// Activates the next 'scene' and removes the irrelevant elements on screen
	exit_house_event: function () {
		draw_functions.adventure_map_draw();
		map_states.adventure_map = 1;
		map_states.main_map = 0;
		Events.event_state.exit_house = 1;

		//This part below removes the items of the main_map
		WIZARD.remove();
		$("#Weapon_Selection").remove();

		Mc.y = 12; Mc.x = 0;Mc.facing = "right";
		Movement.calibrate();
		EnemyClass.spawn(-1, -1);
	},

	tutorial: async function ()
	{
		// Use the js to ask yes or no
		let a = confirm("Do you want to read the tutorial?") ;

		if (a)
		{
			this.msg_area.text("The game is designed as a 2.5d environment limited to left and right directions \n" + 
			"It has a semi turn based movement \n ps. click one at a time \n Press A");

			await this.msg("Starting the game \n Approach the npc and choose a weapon, then proceed by pressing A at the door to leave the house");

			await this.msg("Weapon Types \n Every 'move' allows the player to attack but the different weapons have some characteristics : \n " + 
			"Spear - Has a range of 2 with 10 damage. \n Sword - Can swing twice in a turn with 15 damage. \n Hammer - Deals 20 damage");

			await this.msg("Beating the game \n Defeat and clear the slimes completely, but beware the slimes can multiply " + 
			"and their health increases as more of them gets killed. \n The slimes can attack you when you move infront of them or they approach you.")

			await this.msg("This game is not as optimised but here are some tips: \n" + 			 
			"- The Mc changes color as it sustains damage \n" + 
			"- Auto attacks happen when you move away from the enemy (up/down) \n" +
			"- Avoid moving towards the enemy, try side to side \n" +
			"  Have fun!! (as much fun as this game can be). ");

			await this.msg("  ");
		} 
		else 
		{
			return;
		} 
	}

};

// Activates the important buttons on load
function start_up() {
	$(document).on("keypress", function (event) 
	{
		if (event.key == "k" || event.key == "a"){ Controls.press_A();}
	});
	Controls.A_BTN.on("touchstart mousedown", () => { Controls.press_A(); });
};

start_up();
