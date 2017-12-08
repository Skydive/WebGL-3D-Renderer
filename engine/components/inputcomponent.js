var InputComponent = function()
{
	Component.call(this);
	this.downFunc = [];
	this.pressFunc = [];
	this.upFunc = [];
};

InputComponent.prototype = Object.create(Component.prototype);
InputComponent.prototype.constructor = InputComponent;

InputComponent.prototype.Tick = function(dt)
{
	Component.prototype.Tick.call(this);
	this.pressFunc.forEach(function(obj)
	{
		if(this.core.Input.KeyDown(obj.keycode) && !obj.halt)
		{
			obj.func();
			obj.halt = true;
		}
		if(this.core.Input.KeyUp(obj.keycode))
		{
			obj.halt = false;
		}
	}, this);
	this.downFunc.forEach(function(obj)
	{
		if(this.core.Input.KeyDown(obj.keycode))
		{
			obj.func();

		}
	}, this);
	this.upFunc.forEach(function(obj)
	{
		if(this.core.Input.KeyUp(obj.keycode))
		{
			obj.func();
		}
	}, this);
};

InputComponent.prototype.BindKeyDown = function(key, func)
{
	if(this.downFunc.map(function(x){return x.keycode;}).indexOf(CtoK(key)) == -1)
	{
		this.downFunc.push({keycode: CtoK(key), func: func});
	}
};
InputComponent.prototype.BindKeyPress = function(key, func)
{
	if(this.pressFunc.map(function(x){return x.keycode;}).indexOf(CtoK(key)) == -1)
	{
		this.pressFunc.push({keycode: CtoK(key), func: func, halt: false});
	}
};
InputComponent.prototype.BindKeyUp = function(key, func)
{
	if(this.upFunc.map(function(x){return x.keycode;}).indexOf(CtoK(key)) == -1)
	{
		this.upFunc.push({keycode: CtoK(key), func: func});
	}
};
InputComponent.prototype.UnBindKeyDown = function(key)
{
	if(this.downFunc.map(function(x){return x.keycode;}).indexOf(CtoK(key)) == -1)
	{
		this.downFunc.filter(function(x) {return x.keycode!=CtoK(key);});
	}
};
InputComponent.prototype.UnBindKeyPress = function(key, func)
{
	if(this.pressFunc.map(function(x){return x.keycode;}).indexOf(CtoK(key)) == -1)
	{
		this.pressFunc.filter(function(x) {return x.keycode!=CtoK(key);});
	}
};
InputComponent.prototype.UnBindKeyUp = function(key)
{
	if(this.upFunc.map(function(x){return x.keycode;}).indexOf(CtoK(key)) == -1)
	{
		this.upFunc.filter(function(x) {return x.keycode!=CtoK(key);});
	}
};
