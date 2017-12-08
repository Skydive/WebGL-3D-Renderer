var Entity = function()
{
	Base.call(this);
	Transform.call(this);

	this.bDestroyed = false;
	this.ComponentList = [];
};
Entity.prototype = Object.create(Base.prototype);
//$.extend(Entity, Transform);
Entity.prototype.constructor = Entity;

Entity.prototype.BeginPlay = function(){};

Entity.prototype.Tick = function(dt){};

Entity.prototype.Render = function(){};

Entity.prototype.Destroy = function()
{
	this.bDestroyed = true;
};

Entity.prototype.AddComponent = function(obj, owner)
{
	var comp = new obj();
	comp.core = this.core;
	comp.owner = (owner === undefined) ? this : owner;
	comp.BeginPlay();
	this.ComponentList.push(comp);
	return comp;
};

Entity.prototype.GetComponent = function(obj)
{
	this.ComponentList.forEach(function(comp)
	{
		if(comp.isChildOfClass(obj))
		{
			return comp;
		}
	}, this);
	return null;
};

Entity.prototype.RefreshComponents = function()
{
	this.ComponentList.forEach(function(comp)
	{
		if(comp.bDestroyed)
		{
			this.ComponentList.pop(comp);
			comp = null;
		}
	}, this);
};
