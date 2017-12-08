var TestEntity = function()
{
	Entity.call(this);
};
TestEntity.prototype = Object.create(Entity.prototype);
TestEntity.prototype.constructor = TestEntity;

TestEntity.prototype.BeginPlay = function()
{
	this.Material = this.CreateObject(Material);
	this.Material.Shader = this.core.Resource.Get("ShaderEntity");
	this.Material.Ambient = 0.075;
	this.Material.Specular = 0.5;
	this.Material.Shininess = 32.0;

	this.Render = this.AddComponent(RenderComponent);
	this.Render.CurrentMaterial = this.Material;
	this.Render.bParentToOwner = true;
};
