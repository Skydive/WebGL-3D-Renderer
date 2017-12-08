var Component = function()
{
	Base.call(this);
	Transform.call(this);

	this.bDestroyed = false;
	this.bParentToOwner = false;
	this.OffsetLocation = vec3.create();
	this.OffsetRotation = quat.create();
};
Component.prototype = Object.create(Base.prototype);
$.extend(Component, Transform);
Component.prototype.constructor = Base;

Component.prototype.BeginPlay = function(){};
Component.prototype.Tick = function(dt)
{
	if(this.owner.isChildOfClass(Entity) && this.bParentToOwner)
	{
		var temploc = vec3.clone(this.Location);
		vec3.add(temploc, this.owner.Location, this.OffsetLocation);
		this.SetLocation(temploc);

		var temprot = quat.clone(this.Rotation);
		quat.multiply(temprot, this.owner.Rotation, this.OffsetRotation);
		this.SetRotation(temprot);

		this.Scale = vec3.clone(this.owner.Scale);
	}
};
Component.prototype.Render = function(){};
Component.prototype.Destroy = function()
{
	this.bDestroyed = true;
};
