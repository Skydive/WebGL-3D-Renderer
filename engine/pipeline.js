var Pipeline = function()
{
	Base.call(this);
	this.CameraLocation = vec3.create();
	this.CameraRotation = quat.create();
	this.fovy = 45;
};
Pipeline.prototype = Object.create(Base.prototype);
Pipeline.prototype.constructor = Pipeline;

Pipeline.prototype.GetProjectionMatrix = function(w, h)
{
	var P = mat4.create();
	var aspect = w / h;
	mat4.perspective(P, 45, aspect , 0.1, 100.0);
	//mat4.perspective(P, this.fovy, aspect, 0.1, 100);

	return P;
};

Pipeline.prototype.GetViewMatrix = function()
{
	var V = mat4.create();

	mat4.lookAt(V, [0, 0, 0],
				   [1, 0, 0],
				   [0, 1, 0]);


	var invrotq = quat.create(); quat.conjugate(invrotq, this.CameraRotation);
	var invrot = mat4.create(); mat4.fromQuat(invrot, invrotq);
	mat4.multiply(V, V, invrot);

	var invpos = vec3.create(); vec3.negate(invpos, this.CameraLocation);
	var invtrans = mat4.create(); mat4.translate(invtrans, invtrans, invpos);
	mat4.multiply(V, V, invtrans);

	return V;
};

Pipeline.prototype.GetModelMatrix = function(l, r, s)
{
	var M = mat4.create();
	mat4.translate(M, M, l);
	var rot = mat4.create(); mat4.fromQuat(rot, r);
	mat4.multiply(M, M, rot);
	mat4.scale(M, M, s);
	return M;
};
