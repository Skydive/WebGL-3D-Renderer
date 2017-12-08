var CameraEntity = function()
{
	Entity.call(this);
	this.Lights = [];
	this.LastLight = null;
	this.Speed = 10;
};
CameraEntity.prototype = Object.create(Entity.prototype);
CameraEntity.prototype.constructor = CameraEntity;

CameraEntity.prototype.BeginPlay = function()
{
	var L = this.core.Render.AddPointLight();
	L.Location = vec3.clone(this.Location);
	L.Color = [1, 1, 1];
	this.LastLight = L;
	this.Lights.push(L);

	this.Target = null;

	this.Input = this.AddComponent(InputComponent);
	var dtfunc = function() {return this.core.dt;}.bind(this);
	this.Input.BindKeyDown("W", this.MoveDirection.bind(this, dtfunc, this.GetForwardVector.bind(this), 1));
	this.Input.BindKeyDown("S", this.MoveDirection.bind(this, dtfunc, this.GetForwardVector.bind(this), -1));
	this.Input.BindKeyDown("A", this.MoveDirection.bind(this, dtfunc, this.GetRightVector.bind(this), -1));
	this.Input.BindKeyDown("D", this.MoveDirection.bind(this, dtfunc, this.GetRightVector.bind(this), 1));
	this.Input.BindKeyDown(" ", this.MoveDirection.bind(this, dtfunc, function() {return [0, 1, 0];}, 1));
	this.Input.BindKeyDown("C", this.MoveDirection.bind(this, dtfunc, function() {return [0, 1, 0];}, -1));
	this.Input.BindKeyPress("Q", this.RemoveLight.bind(this));
	this.Input.BindKeyDown("E", this.MoveLight.bind(this));
	this.Input.BindKeyPress("R", this.CreateLight.bind(this));
	this.Input.BindKeyPress("SHIFT", function() {this.Speed*=2;}.bind(this));
	this.Input.BindKeyUp("SHIFT", function() {this.Speed/=2;}.bind(this));
	this.core.Input.SetMouseLock(true);
};

CameraEntity.prototype.CreateLight = function()
{
	var L = this.core.Render.AddPointLight();
	if(L)
	{
		L.Location = vec3.clone(this.Location);
		//L.Color = [Math.random(), Math.random(), Math.random()];
		L.Color = [1, 1, 1];
		L.Attenuation = 0.1;
		this.LastLight = L;
		this.Lights.push(L);
	}
};
CameraEntity.prototype.MoveLight = function()
{
	console.log("E");
	if(this.LastLight)
		this.LastLight.Location = vec3.clone(this.Location);
};
CameraEntity.prototype.RemoveLight = function()
{
	if(this.Lights.length > 0)
	{
		var RemoveL = this.Lights.splice(-1, 1)[0];
		this.core.Render.RemovePointLight(RemoveL);
		this.LastLight = this.Lights[this.Lights.length-1];
	}
};

CameraEntity.prototype.Tick = function(dt)
{
	if(this.core.Input.MouseDown(0))
	{
		var t = vec3.create();
		vec3.scale(t, this.GetForwardVector(), 1.0);
		vec3.add(t, this.Location, t);

		var E = this.core.Scene.Spawn(TestEntity, this);
		E.Location = t;
		E.Render.Mesh = this.core.Resource.Get("ModelStalin");
		E.Scale = [0.005, 0.005, 0.005];
		E.Material.Texture = this.core.Resource.Get("TexStalin");
		E.Physics = E.AddComponent(PhysicsComponent);
		E.Physics.bParentToOwner = false;
		E.Physics.Setup({
			mass: 5, // kg
			shape: new CANNON.Sphere(1)
		});
	}
	if(this.core.Input.MouseUp(1))
	{
		//this.CreateLight();
	}
	if(this.core.Input.MouseUp(2))
	{
		//this.RemoveLight();
	}

	if(this.core.Input.GetMouseLock())
	{
		var v = this.core.Input.GetMouseVelocity();

		var qx = quat.create(); quat.setAxisAngle(qx, [0, 1, 0], -v[0] / 80000);
		quat.multiply(this.Rotation, qx, this.Rotation);

		var qy = quat.create(); quat.setAxisAngle(qy, this.GetRightVector(), -v[1] / 80000);
		quat.multiply(this.Rotation, qy, this.Rotation);
	}

	this.core.Render.pipeline.CameraLocation = vec3.clone(this.Location);
	this.core.Render.pipeline.CameraRotation = quat.clone(this.Rotation);
};

CameraEntity.prototype.MoveDirection = function(dtfunc, dirfunc, axis)
{
	var dt = dtfunc();
	var LocTrans = vec3.create(); vec3.scale(LocTrans, dirfunc(), this.Speed * axis * dt);
	vec3.add(this.Location, this.Location, LocTrans);
};
