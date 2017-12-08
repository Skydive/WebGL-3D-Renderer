precision mediump float;

uniform vec4 Color;
uniform vec3 Eye;
uniform vec2 Screen;

void main(void)
{
	gl_FragColor = vec4(Color.rgb, 1.0);
}
