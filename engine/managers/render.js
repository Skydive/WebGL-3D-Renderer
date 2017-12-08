var Render = function()
{
	Manager.call(this);
	this.canvasid = null;
	this.canvas = null;
	this.gl = null;
	this.pipeline = null;

	this.PointLights = [];
	this.DirectionalLights = [];
	this.SpotLights = [];
};

Render.prototype = Object.create(Manager.prototype);
Render.prototype.constructor = Render;

Render.prototype.Start = function()
{
	this.pipeline = new Pipeline();
	this.canvas = $('#'+this.canvasid)[0];
	if(!this.canvas)
	{
		throw "[managers/render.js]: Canvas id not be found!";
	}

	try
	{
		this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
	}
	catch(e){}

	if(!this.gl)
	{
		throw "[managers/render.js]: Failed to initialise WebGL. Perhaps it's not supported by your browser.";
	}

	var gl = this.gl;

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);

	this.resize();
	$(window).resize(this.resize.bind(this));
};

Render.prototype.resize = function()
{
	this.displayWidth = this.canvas.clientWidth;
	this.displayHeight = this.canvas.clientHeight;
	if(this.canvas.width != this.displayWidth || this.canvas.height != this.displayHeight)
	{
		this.canvas.width = this.displayWidth;
		this.canvas.height = this.displayHeight;
	}
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
};

Render.prototype.RenderClear = function()
{
	var gl = this.gl;
	gl.clearColor(0.05, 0.05, 0.05, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

Render.prototype.RenderPresent = function() {};

var PointLight = function()
{
	this.Location = [0, 0, 0];
	this.Color = [0, 0, 0];
	this.Attenuation = 0.2;
};
PointLight.prototype = Object.create(Base.prototype);
PointLight.prototype.constructor = PointLight;
Render.prototype.AddPointLight = function()
{
	if(this.PointLights.length >= 32) return null;
	var L = new PointLight();
	this.PointLights.push(L);
	return L;
};
Render.prototype.RemovePointLight = function(L)
{
	this.PointLights = this.PointLights.filter(function(x){return x != L;});
};

var DirectionalLight = function()
{
	this.Direction = [0, 0, -1];
	this.Color = [1, 1, 1];
	this.Strength = 0.9;
};
DirectionalLight.prototype = Object.create(Base.prototype);
DirectionalLight.prototype.constructor = DirectionalLight;
Render.prototype.AddDirectionalLight = function()
{
	if(this.DirectionalLights.length >= 32) return null;
	var L = new DirectionalLight();
	this.DirectionalLights.push(L);
	return L;
};
Render.prototype.RemoveDirectionalLight = function(L)
{
	this.DirectionalLights = this.DirectionalLights.filter(function(x){return x != L;});
};

var SpotLight = function()
{
	this.Location = [0, 0, 0];
	this.Direction = [0, 0, -1];
	this.Color = [1, 1, 1];
	this.Strength = 0.9;
	this.InnerAngle = 28;
	this.OuterAngle = 30;
};
SpotLight.prototype = Object.create(Base.prototype);
SpotLight.prototype.constructor = SpotLight;
Render.prototype.AddSpotLight = function()
{
	if(this.SpotLights.length >= 32) return null;
	var L = new SpotLight();
	this.SpotLights.push(L);
	return L;
};
Render.prototype.RemoveSpotLight = function(L)
{
	this.SpotLights = this.SpotLights.filter(function(x){return x != L;});
};
