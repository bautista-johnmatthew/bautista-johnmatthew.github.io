const details = document.querySelector("#Details");
const extra_msg = document.querySelector("#extra_message");
const info_btn = document.querySelector("#info_button");
const ext_btn = document.querySelector("#exit_button");
var info_state = 1;
const cnvs1 = document.querySelector("#canvas1");
const cnvs1C = cnvs1.getContext("2d");
const animated = document.querySelector("#Animated");
const change_days = document.querySelector("#Days_change");
const start = document.querySelector("#Start_fill");
const reset = document.querySelector("#Reset");
var days = 10;
var animState = 0; 
//Helps in the animation and dictates the starting position or square that will be colored
var anim = 1; 
//var that dictates whether its animated or not
var coordsX = []; //List for x positions
var coordsY = []; //List for y positions

/* A function that shows a hidden message
 where each click reveals and removes the message respectively */
function show_info(){
    if (info_state == 1){
     info_btn.style.display = "none";
     ext_btn.style.display = "block";
     extra_msg.style.display = "block";
     info_state = 0;} 
    else if (info_state == 0){
     info_btn.style.display = "block";
     ext_btn.style.display = "none";
     extra_msg.style.display = "none";
     info_state = 1;}
}
details.addEventListener("click",show_info);

    //Functions for respective buttons
function animate(){
    anim++;
    if (anim > 1){anim = 0;}
    if (anim == 0){
    animated.style.backgroundColor = "#e00";}
    else if (anim == 1){
    animated.style.backgroundColor = "#0e0";}
}
animated.addEventListener("click",animate);

    //This func sets the variable days
function askdays(){
    let no = prompt("How many days? \nEnter a number",1);
    if (no < 0 || no == NaN || no == null || no/1 != no){
        alert("Wrong input/No input detected");
        reset_func();
        return;}
//Makes sure the current value is not changed if the prompt returns nothing
    if (no > 90){
        no = 90;
        alert("Input is higher than 90");}
    no = Math.abs(no);//Confirms the value is positive
    days = Math.round(no);//Translate the value to an integer
    reset_func();
}
change_days.addEventListener("click",askdays);

/*  -This activates the animation
    - Assigned to a variable to allow clearInterval 
    - function fill checks whether to use the static or animated version then calls it */
var interval = setInterval(fill_anim,500); 
function fill() {
    reset_func();
    if (anim > 1){anim = 0;}
    if (anim == 1){
        animState = 0;
        interval = setInterval(fill_anim,500); 
    } else if (anim == 0){
        fill_static(days);
    } else {console.log("Error");}
    start.removeEventListener("click",fill);
}
start.addEventListener("click",fill);

//Functions connected to fill function
/* Function that fills the object with color by iterating through two arrays that contains x and y coordinates of the boxes drawn.*/
function fill_static(n){
    for (let i = 0;i < n;i++){
        cnvs1C.beginPath();
        cnvs1C.rect(coordsX[i],
        coordsY[i], 20, 20);
        cnvs1C.fillStyle = "#0f0";
        cnvs1C.fill(); cnvs1C.lineWidth = "1"; cnvs1C.stroke();
    }
}

/*Animated version of fill_static function */
function fill_anim(){
    if (animState < days){
        cnvs1C.beginPath();
        cnvs1C.rect(coordsX[animState],
        coordsY[animState], 20, 20);
        cnvs1C.fillStyle = "#0f0";
        cnvs1C.fill(); cnvs1C.lineWidth = "1"; cnvs1C.stroke();
        animState++;
        } else {return;}
}

function reset_func(){
    clearInterval(interval);//Stops the animation in case
    create9();create0();
    start.addEventListener("click",fill);
}
reset.addEventListener("click",reset_func);

    //Functions responsible for creation of canvas
function row6sqrs (x,y,w = 20,h = 20){
/* - x and y dixtates where the row will be created
- w and h are width and height of the squares
- This func creates a row that has 6 columns*/
    for (let i = 1; i <= 6; i++) {
        cnvs1C.beginPath();
        cnvs1C.rect(x + (w*i), y + h, w, h);
   //This part assigns values to the lists
        let num = coordsX.length;
        coordsX[num] = x + (w*i);
        coordsY[num] = y + h;
        cnvs1C.fillStyle = "#fff";
        cnvs1C.fill();
        cnvs1C.lineWidth = "1";
        cnvs1C.stroke();
        } 
    }
    
/* Creates a row where the 3rd & 4th positions are empty
which makes the row empty in the middle*/
function rowEmptyMiddle (x,y,w = 20,h = 20){
    for (let i = 1; i <= 6 ; i++) {
        if (i == 3){i = 5;}
        cnvs1C.beginPath();
        cnvs1C.rect(x + (w*i), y + h, w, h);
        let num = coordsX.length;
        coordsX[num] = x + (w*i);
        coordsY[num] = y + h;
        cnvs1C.fill();
        cnvs1C.stroke();
        } 
    
    }
    
/* Creates a row where squares only exist 
at the end  */
function rowFinal2 (x,y,w = 20,h = 20){
    for (let i = 1; i <= 6 ; i++) {
        if (i == 1){i = 5;}
        cnvs1C.beginPath();
        cnvs1C.rect(x + (w*i), y + h, w, h);
        let num = coordsX.length;
        coordsX[num] = x + (w*i);
        coordsY[num] = y + h;
        cnvs1C.fillStyle = "#fff";
        cnvs1C.fill();
        cnvs1C.lineWidth = "1";
        cnvs1C.stroke();
        } 
    } 

        //Creation of the canvas
let ny = 20;//Neutral y position ,or top position
 
//Creation of number 9
function create9 (){
row6sqrs(10,20 + ny*1); 
row6sqrs(10,20 + ny*2);
rowEmptyMiddle(10,20 + ny*3);
rowEmptyMiddle(10,20 + ny*4);
row6sqrs(10,20 + ny*5); 
row6sqrs(10,20 + ny*6); 
rowFinal2(10,20 + ny*7);
row6sqrs(10,20 + ny*8); 
row6sqrs(10,20 + ny*9); 
/* It was written this way to indicate which row it is 
ex. ny*1 is row1  */
}

//Cretion of zero
function create0(){
row6sqrs(170,20 + ny*1);
row6sqrs(170,20 + ny*2);
rowEmptyMiddle(170,20 + ny*3);
rowEmptyMiddle(170,20 + ny*4);
rowEmptyMiddle(170,20 + ny*5);
rowEmptyMiddle(170,20 + ny*6);
rowEmptyMiddle(170,20 + ny*7);
row6sqrs(170,20 + ny*8);
row6sqrs(170,20 + ny*9);
}
/* The process was turned to a function to enable resetting the canvas */
create9();
create0();
