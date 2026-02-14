precision highp float;
uniform float uBrightness;
uniform float uTime;
uniform float uTwinkle;
uniform float uThickness;
varying vec3 vColor;
varying float vAlpha;
varying float vSide;

void main() {
  float aaRange = 2.0 / max(uThickness, 1.0);
  float edgeAlpha = smoothstep(1.0, 1.0 - aaRange, abs(vSide));

  float twinkle = 1.0;
  if (uTwinkle > 0.0) {
    twinkle = 1.0 - uTwinkle * (0.5 + 0.5 * sin(uTime * 10.0 + vAlpha * 20.0));
  }

  float finalAlpha = pow(vAlpha, 0.7) * edgeAlpha;
  vec3 color = vColor * uBrightness * twinkle;
  gl_FragColor = vec4(color, finalAlpha);
}
