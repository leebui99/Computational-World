
var socket = io.connect("http://76.28.150.193:8888");


function initCanvas(){
    var ctx = document.getElementById('my_canvas').getContext('2d');
    var cW = ctx.canvas.width;
    var cH = ctx.canvas.height;
    var enemies = [ {"id":"enemy1","x":100,"y":-20,"w":40,"h":20},
                    {"id":"enemy2","x":225,"y":-20,"w":40,"h":20},
                    {"id":"enemy3","x":350,"y":-20,"w":40,"h":20},
                    {"id":"enemy4","x":475,"y":-20,"w":40,"h":20},
                    {"id":"enemy5","x":590,"y":-20,"w":40,"h":20},
                    
                    {"id":"enemy6","x":100,"y":-70,"w":40,"h":20},
                    {"id":"enemy7","x":225,"y":-70,"w":40,"h":20},
                    {"id":"enemy8","x":350,"y":-70,"w":40,"h":20},
                    {"id":"enemy9","x":475,"y":-70,"w":40,"h":20},
                    {"id":"enemy10","x":590,"y":-70,"w":40,"h":20},

                    {"id":"enemy11","x":100,"y":-120,"w":40,"h":20},
                    {"id":"enemy12","x":225,"y":-120,"w":40,"h":20},
                    {"id":"enemy13","x":350,"y":-120,"w":40,"h":20},
                    {"id":"enemy14","x":475,"y":-120,"w":40,"h":20},
                    {"id":"enemy14","x":590,"y":-120,"w":40,"h":20},

                    {"id":"enemy11","x":100,"y":-170,"w":40,"h":20},
                    {"id":"enemy12","x":225,"y":-170,"w":40,"h":20},
                    {"id":"enemy13","x":350,"y":-170,"w":40,"h":20},
                    {"id":"enemy14","x":475,"y":-170,"w":40,"h":20},
                    {"id":"enemy14","x":590,"y":-170,"w":40,"h":20},

    ];
    
    socket.on("load", function (data) {

        enemies = data.data.enemies
        console.log(data);           
    });
    
    function renderEnemies(){
        for(var i = 0; i < enemies.length; i++){

            ctx.fillStyle = "blue";
            ctx.fillRect(enemies[i].x, enemies[i].y+=.5, enemies[i].w, enemies[i].h);
       
            if(enemies[i].y > 650){//check for the position of the enimies
                console.log("You lose");
                clearInterval(animateInterval);
                ctx.fillStyle = '#FC0';
                ctx.font = 'bold 36px Arial, sans-serif';
                ctx.fillText('GAME OVER!', cW*.5-130, 50, 300);
                
            }
        }
    }
    
    //Adding into the list of entity
    renderEnemies.prototype = new Entity();
    renderEnemies.prototype.constructor = renderEnemies;

    function Launcher(){
        this.y = 650, this.x = cW*.5-25, this.w = 50, this.h = 50, this.dir, this.bg="red", this.missiles = [];//set location for the canon in the beginning 
        this.render = function(){
            if(this.dir == 'left'){//check for canon moving direction
                if(this.x > 0){
                     this.x-=5;
                }
            } else if(this.dir == 'right'){
                if(this.x < 750){
                    this.x+=5;
                }
            }
            
            ctx.fillStyle = this.bg;
            ctx.fillRect(this.x, this.y, this.w, this.h);//draw the cannon in the postion
            
            for(var i=0; i < this.missiles.length; i++){
                var m = this.missiles[i];
                ctx.fillStyle = m.bg;
                ctx.fillRect(m.x, m.y-=5, m.w, m.h);
                this.hitDetect(this.missiles[i],i);
                if(m.y <= 0){ // If a missile goes past the canvas boundaries, remove it
                    this.missiles.splice(i,1); // Splice that missile out of the missiles array
                }
            }
            if(enemies.length == 0){
                clearInterval(animateInterval); // Stop the game animation loop
                ctx.fillStyle = '#FC0';
                ctx.font = 'bold 36px Arial, sans-serif';
                ctx.fillText('YOU WIN!', cW*.5-130, 50, 300);
            }
        }
        
            //Adding into the list of entity
    Launcher.prototype = new Entity();
    Launcher.prototype.constructor = Launcher;
        //check for collision function 
        this.hitDetect = function(m,mi){
             var enemiesNum = 0;
            for(var i = 0; i < enemies.length; i++){
                var e = enemies[i];
                 enemiesNum++;
                if(m.x+m.w >= e.x && m.x <= e.x+e.w && m.y >= e.y && m.y <= e.y+e.h){//check for collision 
                    this.missiles.splice(this.missiles[mi],1); // Remove the missile
                    enemies.splice(i,1); // Remove the enemy that the missile hits
                }
                
            }
             document.getElementById('status').innerHTML = "You have "+ enemiesNum + " enimies";
        }
        
    }
    
    var launcher = new Launcher();
    function animate(){
        //ctx.save();
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();//keep in touch with the position of the canon
        renderEnemies();
         //ctx.restore();
    }
    
    /*********************************Control for all the button***************************************** */
    var animateInterval = setInterval(animate, 30);//Setting time and call back function 
    
    var left_btn = document.getElementById('left_btn');
    var right_btn = document.getElementById('right_btn');
    var fire_btn = document.getElementById('fire_btn');
    var save_btn = document.getElementById('save_btn');
    var load_btn = document.getElementById('load_btn');    
    
    //Control the canon
    left_btn.addEventListener('mousedown', function(event) {

        launcher.dir = 'left';
        console.log("LEFT");
    });
    left_btn.addEventListener('mouseup', function(event) {
        launcher.dir = '';
    });
    right_btn.addEventListener('mousedown', function(event) {
        console.log("RIGHT");
        launcher.dir = 'right';
    });
    right_btn.addEventListener('mouseup', function(event) {
        launcher.dir = '';
    });
    fire_btn.addEventListener('mousedown', function(event) {
          console.log("FIRE");
        launcher.missiles.push({"x":launcher.x+launcher.w*.5,"y":launcher.y,"w":3,"h":10,"bg":"red"});
    });
    /******************************************************************************************** */
    var Game_Data = { studentname: "Le Phu Bui", statename: "FirstState"};
    var saveGame = function() {
    console.log("SAVE");
    Game_Data.data = {};
    Game_Data.data.enemies = [];//save the enemies
    Game_Data.data.missiles = [];//save the missiles
    var b = 0;
    for(var i = 0, j = 0, len = enemies.length; i < len; i++){
        var ent = enemies[i];
            Game_Data.data.enemies[j++] = {id: ent.id, x: ent.x, y: ent.y, w: ent.w, h: ent.h};
        }
        console.log(missiles.length);
            Game_Data.data.missiles[b++] = {launcher};
   
    socket.emit("save", Game_Data);
   }
   
    //Save and load the game
    save_btn.addEventListener("click", function(event) {
        //console.log(ent);
       saveGame();
    });
    
     var loadGameState = function () {
        socket.emit("load", {studentname: "Le Phu Bui", statename: "FirstState"});
        console.log("LOAD");
    };    
        
    //Load button
    load_btn.addEventListener("click", function(event) {
       // console.log("LOAD");
       loadGameState();
    });

}

    window.addEventListener('load', function(event) {
        initCanvas();
    });
