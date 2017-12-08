var ChargeEntity = function()
{
	Entity.call(this);
	this.Charge = 0;
};
ChargeEntity.prototype = Object.create(Entity.prototype);
ChargeEntity.prototype.constructor = ChargeEntity;

ChargeEntity.prototype.BeginPlay = function()
{
	this.Material = this.CreateObject(Material);
	this.Material.Shader = this.core.Resource.Get("ShaderEntity");
	this.Material.Ambient = 0.0;
	this.Material.Specular = 0.6;
	this.Material.Shininess = 4.0;
	this.Material.bUseTexture = false;

	this.Render = this.AddComponent(RenderComponent);
	this.Render.CurrentMaterial = this.Material;
	this.Render.bParentToOwner = true;
};

ChargeEntity.prototype.StartPhysics = function() {
	this.Physics = this.AddComponent(PhysicsComponent);
	this.Physics.bParentToOwner = false;
	this.Physics.Setup({
		mass: 1,
		shape: new CANNON.Sphere(1)
	});
};

ChargeEntity.prototype.Tick = function(dt)
{
	var EntityList = this.core.Scene.EntityList;
	EntityList.forEach(function(ent)
	{
		if(ent.isChildOfClass(ChargeEntity) && ent != this)
		{
			var AB = vec3.create(); vec3.sub(AB, ent.Location, this.Location);
			var Distance = vec3.length(AB);
			var Force = - this.Charge * ent.Charge / Math.pow(Distance, 2);
			vec3.normalize(AB, AB);
			vec3.scale(AB, AB, Force);
			this.Physics.Body.applyForce(new CANNON.Vec3(AB[0], AB[1], AB[2]), this.Physics.Body.position);
			vec3.scale(AB, AB, -1.0);
			ent.Physics.Body.applyForce(new CANNON.Vec3(AB[0], AB[1], AB[2]), ent.Physics.Body.position);
			console.log();
		}
	}.bind(this));

	if(this.Charge > 0)
	{
		this.Material.Color = [1, 0, 0, 1];
	}
	else if(this.Charge < 0)
	{
		this.Material.Color = [0, 0, 1, 1];
	}
	else
	{
		this.Material.Color = [1, 1, 0, 1];
	}
};
