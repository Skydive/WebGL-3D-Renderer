var MassEntity = function()
{
	Entity.call(this);
	this.Mass = 0.0;
	this.Axis = [0, 1, 0];
	this.Period = 0.0;
};
MassEntity.prototype = Object.create(Entity.prototype);
MassEntity.prototype.constructor = MassEntity;

MassEntity.prototype.BeginPlay = function()
{
	this.Material = this.CreateObject(Material);
	this.Material.Shader = this.core.Resource.Get("ShaderEntity");
	this.Material.Ambient = 0.0;
	this.Material.Specular = 0.6;
	this.Material.Shininess = 4.0;

	this.Render = this.AddComponent(RenderComponent);
	this.Render.CurrentMaterial = this.Material;
	this.Render.bParentToOwner = true;
};

MassEntity.prototype.StartPhysics = function() {
	/*this.Physics = this.AddComponent(PhysicsComponent);
	this.Physics.bParentToOwner = false;
	this.Physics.Setup({
		mass: this.Mass,
		shape: new CANNON.Sphere(this.Scale[0])
	});*/
};

MassEntity.prototype.Tick = function(dt)
{
	/*var EntityList = this.core.Scene.EntityList;
	EntityList.forEach(function(ent)
	{
		if(ent.isChildOfClass(MassEntity) && ent != this)
		{
			var AB = vec3.create(); vec3.sub(AB, ent.Location, this.Location);
			var Distance = vec3.length(AB);
			var Force = this.Mass * ent.Mass / Math.pow(Distance, 2);
			vec3.normalize(AB, AB);
			vec3.scale(AB, AB, Force);
			this.Physics.Body.applyForce(new CANNON.Vec3(AB[0], AB[1], AB[2]), this.Physics.Body.position);
			vec3.scale(AB, AB, -1.0);
			ent.Physics.Body.applyForce(new CANNON.Vec3(AB[0], AB[1], AB[2]), ent.Physics.Body.position);
		}
	}.bind(this));

	if(this.Period !== 0.0)
	{
		var q = quat.create(); quat.setAxisAngle(q, this.Axis, 2*Math.PI * dt / this.Period);
		quat.multiply(this.Rotation, q, this.Rotation);
		this.Physics.Body.quaternion.w = this.Rotation[0];
		this.Physics.Body.quaternion.x = this.Rotation[1];
		this.Physics.Body.quaternion.y = this.Rotation[2];
		this.Physics.Body.quaternion.z = this.Rotation[3];
	}*/
};
