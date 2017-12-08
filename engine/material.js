var Material = function()
{
	this.Shader = null;

	this.bUseTexture = true;
	this.Texture = null;

	this.Specular = 0;
	this.Shininess = 0;
	this.Ambient = 0;

	this.Color = [1, 1, 1, 1];
};
Material.prototype = Object.create(Object.prototype);
Material.prototype.constructor = Material;
Material.prototype.Enable = function()
{
	this.Shader.Color = this.Color;
	this.Shader.bUseTexture = this.bUseTexture;
	this.Shader.Texture = this.Texture;
	this.Shader.Ambient = this.Ambient;
	this.Shader.Specular = this.Specular;
	this.Shader.Shininess = this.Shininess;
	this.Shader.Enable();
};

Material.prototype.Disable = function()
{
	this.Shader.Disable();
};
