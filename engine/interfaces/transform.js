var Transform = function()
{
	this.Location = vec3.fromValues(0, 0, 0);
	this.Rotation = quat.create();
	this.Scale = [1, 1, 1];

	// This is an interface
	this.SetLocation = function(v)
	{
		this.Location = vec3.clone(v);
	};

	this.SetRotation = function(q)
	{
		this.Rotation = quat.clone(q);
	};

	this.GetForwardVector = function()
	{
		var vect = vec3.create();
		var rot = mat3.create();
		mat3.fromQuat(rot, this.Rotation);
		vec3.transformMat3(vect, [1, 0, 0], rot);
		return vect;
	};
	this.GetRightVector = function()
	{
		var vect = vec3.create();
		var rot = mat3.create();
		mat3.fromQuat(rot, this.Rotation);
		vec3.transformMat3(vect, [0, 0, 1], rot);
		return vect;
	};
	this.GetUpVector = function()
	{
		var vect = vec3.create();
		var rot = mat3.create();
		mat3.fromQuat(rot, this.Rotation);
		vec3.transformMat3(vect, [0, 1, 0], rot);
		return vect;
	};
};
