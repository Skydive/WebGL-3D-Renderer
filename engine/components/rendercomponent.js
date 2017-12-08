var RenderComponent = function()
{
	Component.call(this);
	this.CurrentMaterial = null;
	this.Mesh = null;


};
RenderComponent.prototype = Object.create(Component.prototype);
RenderComponent.prototype.constructor = RenderComponent;

RenderComponent.prototype.Tick = function(dt)
{
	Component.prototype.Tick.call(this);
};

RenderComponent.prototype.Render = function()
{
	if(!this.CurrentMaterial || !this.CurrentMaterial.Shader || !this.Mesh) return;

	var shader = this.CurrentMaterial.Shader;
	var gl = this.core.Render.gl;
	var mesh = this.Mesh;
	var pipeline = this.core.Render.pipeline;
	
	var M = pipeline.GetModelMatrix(this.Location, this.Rotation, this.Scale);
	var V = pipeline.GetViewMatrix();
	var P = pipeline.GetProjectionMatrix(this.core.Render.displayWidth, this.core.Render.displayHeight);

	var N = mat4.clone(M);
	mat4.invert(N, N);
	mat4.transpose(N, N);

	this.CurrentMaterial.Enable();

	gl.uniformMatrix4fv(shader.uM, false, M);
	gl.uniformMatrix4fv(shader.uV, false, V);
	gl.uniformMatrix4fv(shader.uP, false, P);
	gl.uniformMatrix4fv(shader.uN, false, N);

	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
	gl.vertexAttribPointer(shader.aVertex, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
    gl.vertexAttribPointer(shader.aNormal, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureBuffer);
	gl.vertexAttribPointer(shader.aUV, mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
	gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	this.CurrentMaterial.Disable();

};
