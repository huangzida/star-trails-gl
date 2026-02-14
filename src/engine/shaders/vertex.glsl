attribute vec2 aInfo;
attribute vec3 position;
attribute vec3 aColor;
attribute float aSide;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uSpeed;
uniform float uLength;
uniform vec2 uCenter;
uniform float uAspect;
uniform bool uIsRadial;
uniform float uThickness;
uniform float uTaper;
uniform float uTilt;
uniform float uScale;

varying vec3 vColor;
varying float vAlpha;
varying float vSide;

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  return mat4(
    oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
    0.0,                                0.0,                                0.0,                                1.0
  );
}

void main() {
  vColor = aColor;
  vSide = aSide;

  float segmentIndex = aInfo.y;
  float radius = position.x * uScale;
  float baseAngle = position.y;
  float speedMult = position.z;

  float trailOffset = segmentIndex * 0.001 * uLength;
  float angle = baseAngle + uTime * uSpeed * speedMult - trailOffset;

  float taperFactor = 1.0 - (segmentIndex / 50.0) * uTaper;

  vec3 pos;
  if (uIsRadial) {
    float r = mod(radius + uTime * uSpeed * 50.0 * speedMult - trailOffset * 500.0, 1000.0 * uScale);
    pos = vec3(
      uCenter.x + cos(baseAngle) * r,
      uCenter.y + sin(baseAngle) * r,
      0.0
    );
    
    vec2 dir = vec2(cos(baseAngle), sin(baseAngle));
    vec2 normal = vec2(-dir.y, dir.x);
    pos.xy += normal * aSide * uThickness * 0.5 * taperFactor;
    
    vAlpha = (1.0 - segmentIndex / 50.0) * (1.0 - r / (1000.0 * uScale));
  } else {
    pos = vec3(
      uCenter.x + cos(angle) * radius,
      uCenter.y + sin(angle) * radius * uAspect,
      0.0
    );
    
    vec2 normal = normalize(pos.xy - uCenter);
    pos.xy += normal * aSide * uThickness * 0.5 * taperFactor;
    
    vAlpha = 1.0 - segmentIndex / 50.0;
  }

  vec3 relativePos = pos - vec3(uCenter, 0.0);
  mat4 tiltRotation = rotationMatrix(vec3(1.0, 0.0, 0.0), uTilt);
  vec4 tiltedPos = tiltRotation * vec4(relativePos, 1.0);
  pos = tiltedPos.xyz + vec3(uCenter, 0.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
