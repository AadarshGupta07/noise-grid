attribute vec3 instanceColor;

varying vec3 vColor;
varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {
    vColor = instanceColor;

    vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * worldPosition;

    vViewPosition = -viewPosition.xyz;

    vNormal = normalize(normalMatrix * mat3(instanceMatrix) * normal);

    gl_Position = projectionMatrix * viewPosition;
}
