var CameraEntity = function()
{
	Entity.call(this);
	this.Speed = 10;
	this.Track = null;
};
CameraEntity.prototype = Object.create(Entity.prototype);
CameraEntity.prototype.constructor = CameraEntity;

CameraEntity.prototype.BeginPlay = function()
{
	this.Light = this.core.Render.AddSpotLight();
	this.Light.Location = vec3.clone(this.Location);
	this.Light.Direction = vec3.clone(this.GetForwardVector());
	this.Light.Color = [1, 1, 1];
	this.Light.Attenuation = 0.075;
	this.Light.InnerAngle = 25;
	this.Light.OuterAngle = 30;

	this.Input = this.AddComponent(InputComponent);
	var dtfunc = function() {return this.core.dt;}.bind(this);
	this.Input.BindKeyDown("W", this.MoveDirection.bind(this, dtfunc, this.GetForwardVector.bind(this), 1));
	this.Input.BindKeyDown("S", this.MoveDirection.bind(this, dtfunc, this.GetForwardVector.bind(this), -1));
	this.Input.BindKeyDown("A", this.MoveDirection.bind(this, dtfunc, this.GetRightVector.bind(this), -1));
	this.Input.BindKeyDown("D", this.MoveDirection.bind(this, dtfunc, this.GetRightVector.bind(this), 1));
	this.Input.BindKeyDown(" ", this.MoveDirection.bind(this, dtfunc, function() {return [0, 1, 0];}, 1));
	this.Input.BindKeyDown("C", this.MoveDirection.bind(this, dtfunc, function() {return [0, 1, 0];}, -1));
	this.Input.BindKeyPress("SHIFT", function() {this.Speed*=2;}.bind(this));
	this.Input.BindKeyUp("SHIFT", function() {this.Speed/=2;}.bind(this));
	this.core.Input.SetMouseLock(true);
};

CameraEntity.prototype.Tick = function(dt)
{
	if(this.core.Input.GetMouseLock())
	{
		var v = this.core.Input.GetMouseVelocity();

		var qx = quat.create(); quat.setAxisAngle(qx, [0, 1, 0], -v[0] / 80000);
		quat.multiply(this.Rotation, qx, this.Rotation);

		var qy = quat.create(); quat.setAxisAngle(qy, this.GetRightVector(), -v[1] / 80000);
		quat.multiply(this.Rotation, qy, this.Rotation);
	}
	else if(this.Track !== null)
	{
		if(this.Track.isChildOfClass(Entity))
		{
			let F = [1, 0, 0];
			let CO = vec3.create(); vec3.sub(CO, this.Track.Location, this.Location); vec3.normalize(CO, CO);
			let q = quat.create(); quat.rotationTo(q, F, CO);
			quat.copy(this.Rotation, q);

			let R = this.GetRightVector();
			let CR = vec3.create();
			vec3.cross(CR, this.GetForwardVector(), [0, 1, 0]);
			vec3.normalize(CR, CR);
			quat.rotationTo(q, R, CR);
			quat.multiply(this.Rotation, q, this.Rotation);
		}
	}

	this.Light.Location = vec3.clone(this.Location);
	this.Light.Direction = vec3.clone(this.GetForwardVector());

	this.core.Render.pipeline.CameraLocation = vec3.clone(this.Location);
	this.core.Render.pipeline.CameraRotation = quat.clone(this.Rotation);
};

CameraEntity.prototype.MoveDirection = function(dtfunc, dirfunc, axis)
{
	var dt = dtfunc();
	var LocTrans = vec3.create(); vec3.scale(LocTrans, dirfunc(), this.Speed * axis * dt);
	vec3.add(this.Location, this.Location, LocTrans);
};
