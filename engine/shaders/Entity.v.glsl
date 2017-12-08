precision mediump float;

attribute vec3 Vertex;
attribute vec3 Normal;
attribute vec2 UV;

uniform mat4 M, V, P, N;

varying vec3 fVertex;
varying vec3 fNormal;
varying vec2 fUV;

void main(void)
{
	fUV = UV;
	fVertex = vec3(M * vec4(Vertex, 1));;
	fNormal = normalize(vec3(N * vec4(Normal, 0)));
	gl_Position = P * V * M * vec4(Vertex, 1);
}
