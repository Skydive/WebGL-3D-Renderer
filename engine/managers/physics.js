
var Physics = function()
{
	Manager.call(this);
};
Physics.prototype = Object.create(Manager.prototype);
Physics.prototype.constructor = Physics;

Physics.prototype.Start = function()
{
	this.world = new CANNON.World();
	this.world.broadphase = new CANNON.NaiveBroadphase();

	this.world.gravity.set(0, -9.81, 0);

	var groundShape = new CANNON.Plane();
	this.groundBody = new CANNON.Body({
		mass: 0
	});
	this.groundBody.addShape(groundShape);
	this.groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2);
	this.world.add(this.groundBody);
};

Physics.prototype.Update = function(dt)
{
	this.world.step(dt);
};
