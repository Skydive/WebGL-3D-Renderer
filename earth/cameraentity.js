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
	this.Light.Strength = 0.1;
	this.Light.Attenuation = 0.025;
	this.Light.InnerAngle = 20;
	this.Light.OuterAngle = 25;

	this.core.Input.SetMouseLock(false);
};

CameraEntity.prototype.Tick = function(dt)
{
	if(this.Track !== null)
	{
		if(this.Track.isChildOfClass(Entity))
		{
			var F = [1, 0, 0];
			var CO = vec3.create(); vec3.sub(CO, this.Track.Location, this.Location); vec3.normalize(CO, CO);
			var q = quat.create(); quat.rotationTo(q, F, CO);
			quat.copy(this.Rotation, q);

			var R = this.GetRightVector();
			var CR = vec3.create();
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
