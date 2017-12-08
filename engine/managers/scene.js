var Scene = function()
{
	Manager.call(this);
	this.EntityList = [];
};
Scene.prototype = Object.create(Manager.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.Update = function(dt)
{
	this.EntityList.forEach(function(ent)
	{
		ent.ComponentList.forEach(function(comp)
		{
			comp.Tick(dt);
		});
		ent.ComponentList.forEach(function(comp)
		{
			comp.Render();
		});

		ent.Tick(dt);
		//ent.Render(); TODO: Fix this

		ent.RefreshComponents();
	});
	this.RefreshEntities();
};

Scene.prototype.SpawnEntity = function(obj, owner)
{
	var ent = new obj();
	ent.core = this.core;
	ent.owner = (owner === undefined) ? this : owner;
	ent.BeginPlay();
	this.EntityList.push(ent);
	return ent;
};
Scene.prototype.Spawn = Scene.prototype.SpawnEntity;

Scene.prototype.RefreshEntities = function()
{
	this.EntityList.forEach(function(ent)
	{
		if(ent.bDestroyed)
		{
			this.EntityList.pop(ent);
			ent = null;
		}
	}, this);
};
