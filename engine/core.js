// Fixes:
include('./deploy/HackTimer.js');

// Dependency:
include('./inc/gl-matrix.js');
include('./inc/cannon.js');

// Base Object:
include('./base.js');

// Objects:
include('./material.js');
include('./shader.js');
include('./pipeline.js');

// Managers:
include('./managers/manager.js');
include('./managers/render.js');
include('./managers/input.js');
include('./managers/scene.js');
include('./managers/physics.js');
include('./managers/resource.js');

// Interfaces:
include('./interfaces/transform.js');

// Entities:
include('./entity.js');

// Components:
include('./components/component.js');
include('./components/inputcomponent.js');
include('./components/rendercomponent.js');
include('./components/physicscomponent.js');

var Core = function()
{
	this.core = this;
	this.dt = 0;
	console.log("Core created!");
};
Core.prototype = Object.create(Base.prototype);
Core.prototype.constructor = Core;

Core.prototype.GetTime = function() { return Date.now()/1000; };
Core.prototype.GetElapsedTime = function() { return this.GetTime()-this.startTime; };

Core.prototype.Start = function(args)
{
	this.startTime = this.GetTime();
	this.lastUpdate = this.GetTime();

	this.Render = this.CreateObject(Render);
	this.Render.canvasid = args.canvasid;
	this.Render.Start();

	this.Input = this.CreateObject(Input);
	this.Input.Start();

	this.Scene = this.CreateObject(Scene);
	this.Scene.Start();

	this.Physics = this.CreateObject(Physics);
	this.Physics.Start();

	this.Resource = this.CreateObject(Resource);
	this.Resource.Start();

	this.BeginPlay();
	this.MainLoop();
};

Core.prototype.MainLoop = function()
{
	this.dt = this.GetTime()-this.lastUpdate;
	this.lastUpdate = this.GetTime();
	var dt = this.dt;

	this.Render.RenderClear();

	this.Scene.Update(dt);
	this.Tick(dt);

	this.Physics.Update(dt);

	this.Input.Update(dt);

	this.Render.RenderPresent();
	//console.log("FPS: "+Math.round(1/dt, 2));
	window.requestAnimationFrame(this.MainLoop.bind(this));
};

Core.prototype.BeginPlay = function(){};
Core.prototype.Tick = function(){};
