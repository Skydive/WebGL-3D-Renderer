precision mediump float;

varying vec3 fVertex;
varying vec3 fNormal;
varying vec2 fUV;

uniform vec3 Eye;
uniform vec2 Screen;

uniform mat4 M;

uniform vec4 Color;
uniform float Time;

uniform bool bUseTexture;
uniform sampler2D Texture;

struct PointLight
{
	vec3 Location;
	vec3 Color;
	float Attenuation;
};
#define MAX_POINT_LIGHTS 32
uniform int PointLightCount;
uniform PointLight PointLights[MAX_POINT_LIGHTS];

struct DirectionalLight
{
	vec3 Direction;
	vec3 Color;
	float Strength;
};
#define MAX_DIRECTIONAL_LIGHTS 32
uniform int DirectionalLightCount;
uniform DirectionalLight DirectionalLights[MAX_DIRECTIONAL_LIGHTS];

struct SpotLight
{
	vec3 Location;
	vec3 Direction;
	vec3 Color;
	float InnerAngle;
	float OuterAngle;
	float Strength;
	float Attenuation;
};
#define MAX_SPOT_LIGHTS 32
uniform int SpotLightCount;
uniform SpotLight SpotLights[MAX_SPOT_LIGHTS];

struct Material
{
	float Ambient;
	float Specular;
	float Shininess;
};
uniform Material Mat;

void main(void)
{
	vec3 diffuseval = vec3(0.0);
	vec3 specularval = vec3(0.0);
	vec3 ambientval = vec3(0.0);
	for(int i=0; i<MAX_POINT_LIGHTS; i++)
	{
		if(i < PointLightCount)
		{
			PointLight P = PointLights[i];

			vec3 surfaceToLight = P.Location - fVertex;

			float attenuation = 1.0 / (1.0 + P.Attenuation * pow(length(surfaceToLight), 2.0));
			float diffuse = max(dot(fNormal, normalize(surfaceToLight)), 0.0);

			vec3 reflectdir = reflect(normalize(-surfaceToLight), fNormal);
			vec3 viewdir = normalize(Eye - fVertex);

			float spec = pow(max(dot(viewdir, reflectdir), 0.0), Mat.Shininess);

			diffuseval += attenuation * diffuse * P.Color;
			specularval += attenuation * spec * Mat.Specular * P.Color;
		}
	}
	for(int i=0; i<MAX_DIRECTIONAL_LIGHTS; i++)
	{
		if(i < DirectionalLightCount)
		{
			DirectionalLight D = DirectionalLights[i];

			float diffuse = max(dot(fNormal, normalize(D.Direction)*-1.0), 0.0);

			vec3 reflectdir = reflect(normalize(D.Direction), fNormal);
			vec3 viewdir = normalize(Eye - fVertex);

			float spec = pow(max(dot(viewdir, reflectdir), 0.0), Mat.Shininess);

			diffuseval += D.Strength * diffuse * D.Color;
			specularval += D.Strength * spec * Mat.Specular * D.Color;
		}
	}
	for(int i=0; i<MAX_SPOT_LIGHTS; i++)
	{
		if(i < SpotLightCount)
		{
			SpotLight S = SpotLights[i];

			vec3 LightToSurface = fVertex - S.Location;
			float CosTheta = dot(normalize(LightToSurface), normalize(S.Direction));

			if(CosTheta > cos(S.OuterAngle))
			{
				float intensity = 1.0;
				if(S.InnerAngle < S.OuterAngle)
				{
					float epsilon = cos(S.InnerAngle) - cos(S.OuterAngle);
					intensity = clamp((CosTheta - cos(S.OuterAngle)) / epsilon, 0.0, 1.0);
				}

				float attenuation = 1.0 / (1.0 + S.Attenuation * pow(length(LightToSurface), 2.0));
				float diffuse = max(dot(fNormal, normalize(-LightToSurface)), 0.0);

				vec3 reflectdir = reflect(normalize(LightToSurface), fNormal);
				vec3 viewdir = normalize(Eye - fVertex);

				float spec = pow(max(dot(viewdir, reflectdir), 0.0), Mat.Shininess);

				diffuseval += intensity * attenuation * S.Strength * diffuse * S.Color;
				specularval += intensity * attenuation * S.Strength * spec * Mat.Specular * S.Color;
			}
		}
	}

	if(bUseTexture)
	{
		gl_FragColor = vec4(specularval + (Mat.Ambient + diffuseval) * texture2D(Texture, fUV).rgb * Color.rgb, Color.a);
	}
	else
	{
		gl_FragColor = vec4(specularval + (Mat.Ambient + diffuseval) * vec3(Color.x, Color.y, Color.z), 1.0);
	}

	// DEBUG:
	/*if(gl_FragCoord.x > (8.0-1.0)*Screen.x/8.0)
	{
		vec3 fColor = vec3(abs(fNormal.x), abs(fNormal.y), abs(fNormal.z));
		gl_FragColor = vec4(fColor, Color.a);
	}
	else if(gl_FragCoord.x < 1.0*Screen.x/8.0)
	{
		gl_FragColor = vec4(texture2D(Texture, fUV).rgb * Color.rgb, Color.a);
	}
	else
	{
		gl_FragColor = vec4(specularval + diffuseval * texture2D(Texture, fUV).rgb * Color.rgb, Color.a);
		//gl_FragColor = vec4(specular * Color.rgb, Color.a);
	}*/
}
