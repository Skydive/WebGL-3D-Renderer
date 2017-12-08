var KEYCODE_MAX = 223;

function CtoK(str)
{
	switch(str.toUpperCase())
	{
		case "SHIFT": 	return 16;
		case "CTRL": 	return 17;
		case "ALT": 	return 18;
		case "LALT": 	return 18;
		case "RALT" : 	return 225;
		case "SPACE": 	return 32;
		case "BKSP": 	return 8;
		case "TAB": 	return 9;
		case "ENTER": 	return 13;
		case "LEFT": 	return 37;
		case "UP":		return 38;
		case "RIGHT":	return 39;
		case "DOWN":	return 40;
	}
	return str.toUpperCase().charCodeAt(0);
}

var Input = function(parent)
{
	Manager.call(this);
};
Input.prototype = Object.create(Manager.prototype);
Input.prototype.constructor = Input;

Input.prototype.Start = function()
{
	this.keys = [];
	this.mouse = [];

	this.bDoLock = false;
	this.bMouseLocked = false;

	this.mousevelxlist = [];
	this.mousevelylist = [];

	this.mouseVelocity = [0, 0];
	this.mousePosition = [0, 0];

	this.orientation = [0, 0, 0];

	$(document).keyup(function(event)
	{
		this.OnKeyUp(event.which);
	}.bind(this));

	$(document).keydown(function(event)
	{
		if(event.which == 121)
		{
			return false;
		}
		this.OnKeyDown(event.which);
	}.bind(this));

	$(document).mousedown(function(event)
	{
		this.OnMouseDown(event.button);
	}.bind(this));

	$(document).mouseup(function(event)
	{
		this.OnMouseUp(event.button);
	}.bind(this));

	$(document).on("contextmenu",function()
	{
		return false;
    });

	$(document).on("pointerlockchange", function()
	{
		this.bMouseLocked = document.pointerLockElement == this.core.Render.canvas;
	}.bind(this));

	$(document).click(function()
	{
		if(this.bDoLock && !this.bMouseLocked)
		{
			this.core.Render.canvas.requestPointerLock();
		}
	}.bind(this));

	$(document).mousemove(function(e)
	{
		this.mousePosition = [e.pageX, e.pageY];
		this.mousevelxlist.push(isFinite(e.originalEvent.movementX) ? e.originalEvent.movementX : 0);
		this.mousevelylist.push(isFinite(e.originalEvent.movementY) ? e.originalEvent.movementY : 0);
	}.bind(this));

	$(window).on("deviceorientation", function()
	{
		if(event.alpha && event.beta && event.gamma)
		{
			this.orientation = [event.alpha, event.beta, event.gamma];
			this.bHasOrientation = true;
		}
		else
		{
			this.bHasOrientation = false;
		}
	}.bind(this));
};

Input.prototype.Update = function(dt)
{
	this.keys = this.keys.filter(function(x) {return x.down;});
	this.mouse = this.mouse.filter(function(x) {return x.down;});

	// Smooth mouse movement
	if(this.mousevelxlist.length > 0 || this.mousevelylist.length > 0)
	{
		this.mouseVelocity = [this.mousevelxlist.reduce(function(a, b) { return a + b; }, 0)/this.core.dt,
							  this.mousevelylist.reduce(function(a, b) { return a + b; }, 0)/this.core.dt];
	}
	else
	{
		this.mouseVelocity = [0, 0];
	}
	this.mousevelxlist = [];
	this.mousevelylist = [];

	if(!this.bDoLock)
	{
		document.exitPointerLock();
	}
};

Input.prototype.OnKeyUp = function(keycode)
{
	if(keycode >= 0 && keycode < KEYCODE_MAX)
	{
		for(var i=0; i<this.keys.length; i++)
		{
			if(this.keys[i].code == keycode)
			{
				this.keys[i].down = false;
			}
		}
	}
};
Input.prototype.OnKeyDown = function(keycode)
{
	if(keycode >= 0 && keycode < KEYCODE_MAX)
	{
		if(this.keys.map(function(x){return x.code;}).indexOf(keycode) == -1)
		{
			this.keys.push({code: keycode, down: true});
		}
		else
		{
			for(var i=0; i<this.keys.length; i++)
			{
				if(this.keys[i].code == keycode)
				{
					this.keys[i].down = true;
				}
			}
		}
	 }
};

Input.prototype.KeyUp = function(keycode)
{
	return this.keys.filter(function(x) { return x.code==keycode && !x.down; }).length > 0;
};
Input.prototype.KeyDown = function(keycode)
{
	return this.keys.filter(function(x) { return x.code==keycode && x.down; }).length > 0;
};


Input.prototype.OnMouseUp = function(n)
{
	for(var i=0; i<this.mouse.length; i++)
	{
		if(this.mouse[i].code == n)
		{
			this.mouse[i].down = false;
		}
	}
};
Input.prototype.OnMouseDown = function(n)
{
	if(this.mouse.map(function(x){return x.code;}).indexOf(n) == -1)
	{
		this.mouse.push({code: n, down: true});
	}
	else
	{
		for(var i=0; i<this.mouse.length; i++)
		{
			if(this.mouse[i].code == n)
			{
				this.mouse[i].down = true;
			}
		}
	}
};

Input.prototype.MouseUp = function(n)
{
	return this.mouse.filter(function(x) { return x.code==n && !x.down; }).length > 0;
};
Input.prototype.MouseDown = function(n)
{
	return this.mouse.filter(function(x) { return x.code==n && x.down; }).length > 0 && this.GetMouseLock();
};

Input.prototype.SetMouseLock = function(state)
{
	this.bDoLock = state;
};
Input.prototype.GetMouseLock = function() {return this.bMouseLocked;};
Input.prototype.GetMousePosition = function() {return this.mousePosition;};
Input.prototype.GetMouseVelocity = function() {return this.mouseVelocity;};

Input.prototype.GetOrientation = function() {return this.orientation;};
Input.prototype.GetHasOrientation = function() {return this.bHasOrientation;};
