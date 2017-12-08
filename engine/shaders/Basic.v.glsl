precision mediump float;

attribute vec3 Vertex;
attribute vec3 Normal;

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;
uniform mat4 N;

void main(void)
{
	gl_Position = P * V * M * vec4(Vertex, 1);
}
