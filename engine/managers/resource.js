include('../inc/webgl-obj-loader.js');

var Resource = function()
{
	Manager.call(this);
	this.ResourceMap = {};
};
Resource.prototype = Object.create(Manager.prototype);
Resource.prototype.constructor = Resource;

Resource.prototype.Start = function()
{
	Manager.prototype.Start.call(this);
	this.LoadShader("ShaderBasic", {
		vertpath: "./engine/shaders/Basic.v.glsl",
		fragpath: "./engine/shaders/Basic.f.glsl",
		shaderclass: BasicShader
	});

	this.LoadShader("ShaderEntity", {
		vertpath: "./engine/shaders/Entity.v.glsl",
		fragpath: "./engine/shaders/Entity.f.glsl",
		shaderclass: EntityShader
	});
};

Resource.prototype.LoadShader = function(name, shaderstruct)
{
	if(Object.keys(this.ResourceMap).indexOf(name) > -1)
		throw "[managers/resource.js]: Resource identifier: "+name+" for "+basepath+" already taken!";

	var Load = function(path)
	{
		var ShaderData = null;
		$.ajax({async: false, success: function(s){ShaderData=s;}, url: path});
		return (ShaderData !== null) ? ShaderData : null;
	};
	if(shaderstruct.shaderclass !== undefined)
	{
		var gl = this.core.Render.gl;
		var vertsrc = null, geomsrc = null, fragsrc = null;
		vertsrc = (shaderstruct.vertpath !== undefined) ? Load(shaderstruct.vertpath) : null;
		//gromsrc = (shaderstruct.geompath !== undefined) ? Load(shaderstruct.geompath) : null;
		fragsrc = (shaderstruct.fragpath !== undefined) ? Load(shaderstruct.fragpath) : null;
		if(vertsrc !== null && fragsrc !== null && gl)
		{
			var Compile = function(s)
			{
				gl.compileShader(s);
				var success = gl.getShaderParameter(s, gl.COMPILE_STATUS);
				if(!success)
				{
					throw "[managers/resource.js]: Could not compile shader:" + gl.getShaderInfoLog(s);
			    }
			};

			var shader = new shaderstruct.shaderclass();
			shader.core = this.core;
			shader.Start();

			var vert = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vert, vertsrc);

			var frag = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(frag, fragsrc);

			Compile(vert);
			Compile(frag);

			gl.attachShader(shader.Program, vert);
			gl.attachShader(shader.Program, frag);

			shader.Link();

			this.ResourceMap[name] = shader;
		}
	}
};

function sleep(milliseconds){var start=new Date().getTime();for(var i=0;i<1e7; i++){if((new Date().getTime()-start)>milliseconds){break;}}}
Resource.prototype.LoadTexture = function(name, basepath)
{
	if(Object.keys(this.ResourceMap).indexOf(name) > -1)
		throw "[managers/resource.js]: Resource identifier: "+name+" for "+basepath+" already taken!";

	var img = new Image();
	img.src = basepath;
	var bCompleted = false;
	img.onload = function()
	{
		var gl = this.core.Render.gl;
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		bCompleted = true;
		this.ResourceMap[name].texture = texture;
		this.ResourceMap[name].image = img;
	}.bind(this);
	this.ResourceMap[name] = {
		texture: null,
		image: null,
		path: basepath
	};
};

Resource.prototype.LoadModel = function(name, basepath)
{
	if(Object.keys(this.ResourceMap).indexOf(name) > -1)
		throw "[managers/resource.js]: Resource identifier: "+name+" for "+basepath+" already taken!";

	var gl = this.core.Render.gl;

	var Mesh = null;
	var BuildBuffer = function(type, data, itemSize)
	{
		var buffer = gl.createBuffer();
		var arrayView = type === gl.ARRAY_BUFFER ? Float32Array : Uint16Array;
		gl.bindBuffer(type, buffer);
		gl.bufferData(type, new arrayView(data), gl.STATIC_DRAW);
		buffer.itemSize = itemSize;
		buffer.numItems = data.length / itemSize;
		return buffer;
	};

	if(basepath.indexOf(".json") == basepath.length-5)
	{
		throw "[managers/resource.js]: Resource (JSON): Not yet implemented!";

		/*var Mesh = {};



		Mesh.JSON = null;
		$.ajax({async: false, success: function(s){Mesh.JSON=s;}, url: basepath, dataType: 'json'});

		if(Mesh.JSON !== null)
		{
			Mesh.normalBuffer = BuildBuffer(gl.ARRAY_BUFFER, Mesh.JSON.normals, 3);
		    //Mesh.textureBuffer = BuildBuffer(gl.ARRAY_BUFFER, mesh.textures, 2);
		    Mesh.vertexBuffer = BuildBuffer(gl.ARRAY_BUFFER, Mesh.JSON.vertices, 3);
		    Mesh.indexBuffer = BuildBuffer(gl.ELEMENT_ARRAY_BUFFER, Mesh.JSON.faces, 1);
			this.ResourceMap[name] = Mesh;
		}
		else
		{
			throw "[managers/resource.js]: Resource (JSON): "+basepath+" could not be found!";
		}*/
	}
	else if(basepath.indexOf(".obj") == basepath.length-4)
	{
		var ModelData = null;
		$.ajax({async: false, success: function(s){ModelData=s;}, url: basepath});
		if(ModelData !== null)
		{

			var mesh = new OBJ.Mesh(ModelData);
			OBJ.initMeshBuffers(gl, mesh);
			this.ResourceMap[name] = mesh;
		}
		else
		{
			throw "[managers/resource.js]: Resource (OBJ): "+basepath+" could not be found!";
		}
	}
	else
	{
		throw "[managers/resource.js]: Resource (???): "+basepath+" not supported!";
	}
};


Resource.prototype.Get = function(name)
{
	return this.ResourceMap[name];
};
