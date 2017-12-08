var PhysicsComponent = function()
{
	Component.call(this);
	this.Body = null;
};
PhysicsComponent.prototype = Object.create(Component.prototype);
PhysicsComponent.prototype.constructor = PhysicsComponent;

PhysicsComponent.prototype.BeginPlay = function(){};

PhysicsComponent.prototype.Setup = function(arr)
{
	this.Body = new CANNON.Body(arr);

	this.Body.position.x = this.owner.Location[0];
	this.Body.position.y = this.owner.Location[1];
	this.Body.position.z = this.owner.Location[2];

	this.Body.quaternion.w = this.owner.Rotation[0];
	this.Body.quaternion.x = this.owner.Rotation[1];
	this.Body.quaternion.y = this.owner.Rotation[2];
	this.Body.quaternion.z = this.owner.Rotation[3];

	this.Body.force = new CANNON.Vec3(0.0, 0.0, 0.0);

	this.core.Physics.world.addBody(this.Body);
};

PhysicsComponent.prototype.Tick = function(dt)
{
	if(this.Body !== null)
	{
		this.owner.Location = [this.Body.position.x, this.Body.position.y, this.Body.position.z];
		this.owner.Rotation = [this.Body.quaternion.w, this.Body.quaternion.x, this.Body.quaternion.y, this.Body.quaternion.z];
	}
};

PhysicsComponent.prototype.SetLocation = function(v)
{
	this.Body.position.x = v[0];
	this.Body.position.y = v[1];
	this.Body.position.z = v[2];
};
PhysicsComponent.prototype.GetLocation = function()
{
	return [this.Body.position.x, this.Body.position.y, this.Body.position.z];
};

PhysicsComponent.prototype.SetRotation = function(q)
{
	this.Body.quaternion.w = q[0];
	this.Body.quaternion.x = q[1];
	this.Body.quaternion.y = q[2];
	this.Body.quaternion.z = q[3];
};
PhysicsComponent.prototype.GetRotation = function()
{
	return [this.Body.quaternion.w, this.Body.quaternion.x, this.Body.quaternion.y, this.Body.quaternion.z];
};

PhysicsComponent.prototype.SetVelocity = function(v)
{
	this.Body.velocity.x = v[0];
	this.Body.velocity.y = v[1];
	this.Body.velocity.z = v[2];
};
PhysicsComponent.prototype.GetVelocity = function()
{
	return [this.Body.velocity.x, this.Body.velocity.y, this.Body.velocity.z];
};
