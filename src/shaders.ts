export const vs = `
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform vec3 meshColor;

attribute vec3 position;
attribute vec3 normal;
attribute vec3 translation;
attribute vec4 rotation;
attribute vec3 scale;

varying vec3 vertPos;
varying vec3 normalInterp;
varying vec4 color;

vec3 transform( inout vec3 position, vec3 T, vec4 R, vec3 S ) {
  position *= S;
  position += 2.0 * cross( R.xyz, cross( R.xyz, position ) + R.w * position );
  position += T;
  return position;
}

void main() {

  vec3 pos = position;
  transform( pos, translation, rotation, scale );
  vec4 vertPos4 = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
  gl_Position = vertPos4;

  vertPos = vec3(vertPos4) / vertPos4.w;

  vec3 lightPos = vec3(1.0, 0.0, 1.0);
  normalInterp = vec3(normalMatrix * vec4(normal, 0.0));
  vec3 N = normalize(normalInterp);
  vec3 L = normalize(lightPos - vertPos);

  float lambertian = max(dot(N, L), 0.0);
  float specular = 0.0;

  if (lambertian > 0.0) {
    vec3 R = reflect(-L, N);
    vec3 V = normalize(-vertPos);

    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, 80.0);
  }
  color = vec4(1.0 * vec3(0.15, 0.15, 0.15) +
               1.0 * lambertian * meshColor +
               1.0 * specular * vec3(1.0, 1.0, 1.0),
               1.0);
}
`;

export const fs = `
precision mediump float;

varying vec4 color;
void main() {
  gl_FragColor = color;
}
`;
