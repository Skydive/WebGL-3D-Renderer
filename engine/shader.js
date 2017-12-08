var Shader = function()
{
	Base.call(this);
	this.Program = null;
};
Shader.prototype = Object.create(Base.prototype);
Shader.prototype.constructor = Shader;

Shader.prototype.Start = function()
{
	this.Program = this.core.Render.gl.createProgram();
};
Shader.prototype.Link = function()
{
	this.core.Render.gl.linkProgram(this.Program);
};

Shader.prototype.Enable = function()
{
	this.core.Render.gl.useProgram(this.Program);
};
Shader.prototype.Disable = function(){};


var BasicShader = function()
{
	Shader.call(this);
};
BasicShader.prototype = Object.create(Shader.prototype);
BasicShader.prototype.constructor = BasicShader;
BasicShader.prototype.Link = function()
{
	Shader.prototype.Link.call(this);
	var gl = this.core.Render.gl;

	this.uM = gl.getUniformLocation(this.Program, "M");
	this.uV = gl.getUniformLocation(this.Program, "V");
	this.uP = gl.getUniformLocation(this.Program, "P");
	this.uN = gl.getUniformLocation(this.Program, "N");

	this.uColor = gl.getUniformLocation(this.Program, "Color");
	this.uScreen = gl.getUniformLocation(this.Program, "Screen");
	this.uEye = gl.getUniformLocation(this.Program, "Eye");

	this.aVertex = gl.getAttribLocation(this.Program, "Vertex");
	gl.enableVertexAttribArray(this.aVertex);

	this.aNormal = gl.getAttribLocation(this.Program, "Normal");
	gl.enableVertexAttribArray(this.aNormal);

};

BasicShader.prototype.Enable = function()
{
	Shader.prototype.Enable.call(this);
	var gl = this.core.Render.gl;
	gl.uniform4fv(this.uColor, new Float32Array(this.Color));
	gl.uniform2fv(this.uScreen, new Float32Array([this.core.Render.displayWidth, this.core.Render.displayHeight]));
	gl.uniform3fv(this.uEye, new Float32Array(this.core.Render.pipeline.CameraLocation));
};


var EntityShader = function()
{
	BasicShader.call(this);
	this.uaPointLights = [];
	this.uaDirectionalLights = [];
	this.uaSpotLights = [];
};
EntityShader.prototype = Object.create(BasicShader.prototype);
EntityShader.prototype.constructor = EntityShader;
EntityShader.prototype.Link = function()
{
	BasicShader.prototype.Link.call(this);
	var gl = this.core.Render.gl;

	this.ubTexture = gl.getUniformLocation(this.Program, "bUseTexture");
	this.uTexture = gl.getUniformLocation(this.Program, "Texture");
	this.uTime = gl.getUniformLocation(this.Program, "Time");

	this.uPointLightCount = gl.getUniformLocation(this.Program, "PointLightCount");
	this.uDirectionalLightCount = gl.getUniformLocation(this.Program, "DirectionalLightCount");
	this.uSpotLightCount = gl.getUniformLocation(this.Program, "SpotLightCount");
	for(var i=0; i<32; i++)
	{
		this.uaPointLights.push({
			uLocation: gl.getUniformLocation(this.Program, "PointLights["+i+"].Location"),
			uColor: gl.getUniformLocation(this.Program, "PointLights["+i+"].Color"),
			uAttenuation: gl.getUniformLocation(this.Program, "PointLights["+i+"].Attenuation")
		});
		this.uaDirectionalLights.push({
			uDirection: gl.getUniformLocation(this.Program, "DirectionalLights["+i+"].Direction"),
			uColor: gl.getUniformLocation(this.Program, "DirectionalLights["+i+"].Color"),
			uStrength: gl.getUniformLocation(this.Program, "DirectionalLights["+i+"].Strength")
		});
		this.uaSpotLights.push({
			uLocation: gl.getUniformLocation(this.Program, "SpotLights["+i+"].Location"),
			uDirection: gl.getUniformLocation(this.Program, "SpotLights["+i+"].Direction"),
			uColor: gl.getUniformLocation(this.Program, "SpotLights["+i+"].Color"),
			uInnerAngle: gl.getUniformLocation(this.Program, "SpotLights["+i+"].InnerAngle"),
			uOuterAngle: gl.getUniformLocation(this.Program, "SpotLights["+i+"].OuterAngle"),
			uStrength: gl.getUniformLocation(this.Program, "SpotLights["+i+"].Strength"),
			uAttenuation: gl.getUniformLocation(this.Program, "SpotLights["+i+"].Attenuation")
		});
	}

	this.uMatAmbient = gl.getUniformLocation(this.Program, "Mat.Ambient");
	this.uMatSpecular = gl.getUniformLocation(this.Program, "Mat.Specular");
	this.uMatShininess = gl.getUniformLocation(this.Program, "Mat.Shininess");

	this.aUV = gl.getAttribLocation(this.Program, "UV");
	gl.enableVertexAttribArray(this.aUV);
};

EntityShader.prototype.Enable = function()
{
	BasicShader.prototype.Enable.call(this);
	var gl = this.core.Render.gl;

	gl.uniform1f(this.uTime, this.core.GetElapsedTime());

	if(this.bUseTexture) // TODO: Fix this
	{
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.Texture.texture);
		gl.uniform1i(this.uTexture, 0);
		gl.uniform1i(this.ubTexture, 1); // TODO: Fix UVs
	}
	else
	{
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.uniform1i(this.uTexture, 0);
		gl.uniform1i(this.ubTexture, 0);
	}

	var PointLights = this.core.Render.PointLights;
	gl.uniform1i(this.uPointLightCount, PointLights.length);
	for(let i=0; i<PointLights.length; i++)
	{
		gl.uniform3fv(this.uaPointLights[i].uLocation, new Float32Array(PointLights[i].Location));
		gl.uniform3fv(this.uaPointLights[i].uColor, new Float32Array(PointLights[i].Color));
		gl.uniform1f(this.uaPointLights[i].uAttenuation, PointLights[i].Attenuation);
	}
	var DirectionalLights = this.core.Render.DirectionalLights;
	gl.uniform1i(this.uDirectionalLightCount, DirectionalLights.length);
	for(let i=0; i<DirectionalLights.length; i++)
	{
		gl.uniform3fv(this.uaDirectionalLights[i].uDirection, new Float32Array(DirectionalLights[i].Direction));
		gl.uniform3fv(this.uaDirectionalLights[i].uColor, new Float32Array(DirectionalLights[i].Color));
		gl.uniform1f(this.uaDirectionalLights[i].uStrength, DirectionalLights[i].Strength);
	}
	var SpotLights = this.core.Render.SpotLights;
	gl.uniform1i(this.uSpotLightCount, SpotLights.length);
	for(let i=0; i<SpotLights.length; i++)
	{
		gl.uniform3fv(this.uaSpotLights[i].uLocation, new Float32Array(SpotLights[i].Location));
		gl.uniform3fv(this.uaSpotLights[i].uDirection, new Float32Array(SpotLights[i].Direction));
		gl.uniform3fv(this.uaSpotLights[i].uColor, new Float32Array(SpotLights[i].Color));
		gl.uniform1f(this.uaSpotLights[i].uInnerAngle, SpotLights[i].InnerAngle * (Math.PI / 180));
		gl.uniform1f(this.uaSpotLights[i].uOuterAngle, SpotLights[i].OuterAngle * (Math.PI / 180));
		gl.uniform1f(this.uaSpotLights[i].uStrength, SpotLights[i].Strength);
		gl.uniform1f(this.uaSpotLights[i].uAttenuation, SpotLights[i].Attenuation);
	}

	gl.uniform1f(this.uMatAmbient, this.Ambient);
	gl.uniform1f(this.uMatSpecular, this.Specular);
	gl.uniform1f(this.uMatShininess, this.Shininess);
};

EntityShader.prototype.Disable = function()
{
	BasicShader.prototype.Disable.call(this);
	var gl = this.core.Render.gl;

	gl.bindTexture(gl.TEXTURE_2D, null);
};
