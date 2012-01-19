/*
 * @todo
 * 
 * 	add mozRequestAnim functionality instead of setTimeout
 *  add enemys
 *  ...
 */


/*function get_random_color2() 
{
    var r = function () { return Math.floor(Math.random()*256) };
    return "rgb(" + r() + "," + r() + "," + r() + ")";
}*/


function Pacorrior( target, w, h )
{
	this.target = target;
	this.w = w;
	this.h = h;
	
	this.mapDimensions = { w:24, h:24};
	this.canvas = null;
	this.context = null;
	this.map = (
		"|||0||||||||||||||||||||"+
		"000X0000000000000000000|"+
		"|0||||||||000|||00000000"+
		"|0|0000000000|0|00000000"+
		"|0|00|||||000|||00000000"+
		"|00000000000000000000000"+
		"|0||||||0000000000000000"+
		"|0|000000000000000000000"+
		"|0|0||||0||||||000000000"+
		"|000|0000|00000000000000"+
		"|0||||00000|00|000000000"+
		"|000000000||000|00000000"+
		"|0|0||||||||||0|00000000"+
		"|0|000000000000|00000000"+
		"|0|||||||||||00000000000"+
		"|0|000000000000|00000000"+
		"|000||||||||||||00000000"+
		"|00000000000000000000000"+
		"|00000000000000000000000"+
		"|00000000000000000000000"+
		"|00000000000000000000000"+
		"|00000000000000000000000"+
		"|00000000000000000000000"+
		"||||||||||||||||||||||||"
		);

	this.init();
}

Pacorrior.prototype = {
	init : function()
	{
		this.canvas = document.createElement("canvas");
		this.canvas.width=this.w;
		this.canvas.height=this.h;

		this.target.appendChild(this.canvas);

		var context = this.canvas.getContext('2d');
		this.context = context;
		this.bricks = [];
		this.clear();
		
		context.textAlign = 'left';
		context.font = 'bold 18px Ubuntu';							
		context.fillStyle = '#fff';

		context.fillText( "Click to play The Pacorrior ...", 50, 50 );
		
		this.gameStopped = true;

		this.initializeMap(this.map);
		
		var that = this;		
		this.canvas.onclick = function () {
			that.start();
		}

		document.onkeypress = function(e) { that.onKeyPressed(e); };
		document.onkeyup = function(e) { that.onKeyUp(e); };
	},
	start : function()
	{
		this.gameStopped = false;
		this.mainLoop();
	},
	mainLoop : function()
	{
		if( this.gameStopped )
		{
			console.log("stopped");
			return null;
		}
		this.update();
		this.paint();
		var that = this;
		setTimeout( function() { that.mainLoop(); }, 40 );
	},
	update : function()
	{
		var hero = this.hero; 
		var speed = this.hero.speed;
		
		if(1==0 && !hero.direction.up &&
			!hero.direction.down &&
			!hero.direction.left &&
			!hero.direction.right )
		{
			hero.isMoving = false;
		}	
		else
		{
			var canvas = this.canvas;
			// position of hero in array
			var x = parseInt((hero.position.x+(hero.boundary.w/2))/(canvas.width/this.mapDimensions.w));
			var y = parseInt((hero.position.y+(hero.boundary.h/2))/(canvas.height/this.mapDimensions.h));
			
			var finalX = x;
			var finalY = y;
			var moveY, moveX;

			if( hero.direction.up )
			{
				y--;
				if( y < 0 )
				{
					y = this.mapDimensions.h-1;
					moveY = (canvas.height/this.mapDimensions.h)*y;
				}
				else
				moveY = -speed;
			}
			else if( hero.direction.down )
			{
				y++;
				if( y > this.mapDimensions.h-1 )
				{
					y = 0;
					moveY = -hero.position.y-speed;
				}
				else
					moveY = speed;
			}
			if( hero.direction.up || hero.direction.down )
			{
				if( !this.bricks[y][x] || this.bricks[y][x] == "0" )
					hero.position.y += moveY;
				else
					// move hero to a
					hero.position.y = (canvas.height/this.mapDimensions.h)*finalY;
				return;
			}
			if( hero.direction.left )
			{
				x--;
				if( x < 0 )
				{
					x = this.mapDimensions.w-1;
					moveX = (canvas.height/this.mapDimensions.w)*x;
				}
				else
					moveX = -speed;
			}
			else if( hero.direction.right )
			{
				x++;
				if( x > this.mapDimensions.w-1 )
				{
					x = 0;
					moveX = -hero.position.x-speed;
				}
				else
					moveX = speed;
			}
			if( hero.direction.left || hero.direction.right )
			{
				if( !this.bricks[y][x] || this.bricks[y][x] == "0" )
					hero.position.x += moveX;
				else
					hero.position.x = (canvas.width/this.mapDimensions.w)*finalX;
			}
			
		}
	},
	paint : function()
	{
		var canvas = this.canvas;
		var context = this.canvas.getContext('2d');

		if( !this.brickImageData )
		{
			// Draw bricks only once
			context.fillStyle = '#000';
			context.fillRect(0,0,this.w,this.h);

			for( var y=0; y<this.bricks.length; y++ )
			{
				for( var x=0; x<=this.bricks[y].length; x++ )
				{
					if( !this.bricks[y][x] )
						continue;
					var xPos = canvas.width/this.mapDimensions.w*x;
					var yPos = canvas.height/this.mapDimensions.h*y;
					this.bricks[y][x].paint( canvas, xPos, yPos );
				}
			}
			
			this.brickImageData = context.getImageData(0, 0, canvas.width, canvas.height);
//			this.brickImage = this.brickImageData;
		}
	
		context.putImageData(this.brickImageData,0,0);
		this.hero.paint(canvas);
	},
	onKeyPressed : function(evt)
	{
		switch(evt.keyCode)
		{
			case 38:
 				// arrow up
				this.hero.direction.up = true;
				this.hero.direction.down = false;
				break;
			case 40:
				 // arrow down
				this.hero.direction.up = false;
				this.hero.direction.down = true;
				break;
			case 37:
				 // arrow left
				this.hero.direction.left = true;
				this.hero.direction.right = false;
				break;
			case 39:
				  // arrow right
				this.hero.direction.right = true;
				this.hero.direction.left = false;
				break;
			default:
			  
		}
		
		// Don't scroll the page
		evt.preventDefault();
	},
	onKeyUp : function(evt)
	{
		
		switch(evt.keyCode)
		{
			case 38:
				 // arrow up
				this.hero.direction.up = false;
			  break;
			case 40:
				 // arrow down
				this.hero.direction.down = false;
			  break;
			case 37:
				 // arrow left
				this.hero.direction.left = false;
			  break;
			case 39:
				  // arrow right
				this.hero.direction.right = false;
				  break;
			default:
			  //this.gameStopped = true;
			  console.log("Key "+evt.keyCode+" not registered");
		}
			
	},
	initializeMap : function()
	{
		var canvas = this.canvas;
		
		if( this.bricks.length < 1 )
		{
			var chars = this.map.split("");
			var y = 0;
			while( chars.length > 0)
			{
				var boundary = {
						w:canvas.width/this.mapDimensions.w,
						h:canvas.height/this.mapDimensions.h
					};

				for( var x=0; x < this.mapDimensions.w; x++ )
				{
					var item = chars.shift();
					if( !this.bricks[y])
						this.bricks[y] = [];
					if( item == "|" )
					{
						this.bricks[y][x]=new brick(x,y,
								boundary );
					}
					else if( !this.hero && item == "X" )
					{
						// Startposition of our hero
						this.hero = new hero();
						this.hero.position = {
								x : boundary.w*x,
								y : boundary.h*y };
						this.hero.boundary = boundary;
					}
				}
				y++;
			}
		}
	},
	clear : function()
	{
		this.canvas.width = this.canvas.width; // clears the canvas
		this.context.fillStyle = '#000';
		this.context.fillRect(0,0,this.w,this.h);
	}
	/*,
	isCollide : function(a, b) {
	    return !(
	        ((a.position.y + a.boundary.h) < (b.position.y)) ||
	        (a.position.y > (b.position.y + b.boundary.h)) ||
	        ((a.position.x + a.boundary.w) < b.position.x) ||
	        (a.position.x > (b.position.x + b.boundary.w))
	    );
	}*/

};

function brick(xMap,yMap,boundary)
{
	this.xMap = xMap;
	this.yMap = yMap;
	this.boundary = boundary;
	this.img = new Image();
	this.img.src = "img/brick.png";
	this.position = { x:0, y:0 };
}

brick.prototype.paint = function(canvas,x,y)
{
	var context = canvas.getContext("2d");
	this.position = { x : x, y : y };
	context.drawImage(this.img, x, y, this.boundary.w*.9, this.boundary.h*.9);
	// Nine arguments: the element, source (x,y) coordinates, source width and 
	// height (for cropping), destination (x,y) coordinates, and destination width 
	// and height (resize).
//	context.drawImage(img_elem, sx, sy, sw, sh, dx, dy, dw, dh);
}


function hero()
{
	this.isMoving = false;
	this.speed = 4;
	this.position = { x: 0, y:0 };
	this.boundary = { w:16, h:16 };
	this.direction = {
			up : false,
			down : false,
			left : false,
			right : false };
	this.img = new Image();
	this.lastImage = null;
	this.images = {
		left : "img/hero_l.png",
		right: "img/hero_r.png",
		up : "img/hero_up.png",
		down : "img/hero_down.png",
		wait : "img/hero_down.png"
	}
}

hero.prototype.paint = function(canvas)
{
	var context = canvas.getContext("2d");
	var w = this.boundary.w;
	var h = this.boundary.h;

	if( this.direction.left )
		this.img.src=this.images.left;
	else if( this.direction.right )
		this.img.src=this.images.right;
	else if( this.direction.up )
		this.img.src=this.images.up;
	else if( this.direction.down )
		this.img.src=this.images.down;
	else
		this.img.src=this.images.wait;
	
	context.drawImage(this.img,
			  this.position.x, this.position.y,
			  w, h);
}


