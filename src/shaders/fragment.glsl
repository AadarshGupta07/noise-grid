varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vColor;

vec3 ambientLight(vec3 lightColor, float lightIntensity) {
    return lightColor * lightIntensity;
}
vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower) {
    vec3 lightDirection = normalize(lightPosition);
    vec3 lightReflection = reflect(-lightDirection, normal);

    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    float specular = -dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    return lightColor * lightIntensity * (shading + specular);
}
vec3 pointLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float lightDecay) {
    vec3 lightDelta = lightPosition - position;
    float lightDistance = length(lightDelta);
    vec3 lightDirection = normalize(lightDelta);
    vec3 lightReflection = reflect(-lightDirection, normal);

    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    float specular = -dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    float decay = 1.0 - lightDistance * lightDecay;
    decay = max(0.0, decay);

    return lightColor * lightIntensity * decay * (shading + specular);
}

void main() {
    vec3 albedo = vColor;
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    float meshHeight = 10.0;

    // Light
    vec3 light = vec3(0.0);

    // Ambient light
    light += ambientLight(
        vec3(0.2, 0.2, 0.2), // Ambient light color
        3.5                  // Ambient light intensity
    );

    // Directional light
    light += directionalLight(
        vec3(1.0),            // Light color
        1.0,                  // Light intensity,
        normal,               // Normal
        vec3(-1.0 + meshHeight, 0.5 + meshHeight, 0.0 + meshHeight), // Light position
        viewDir,              // View direction
        30.0                  // Specular power
    );

    // Point light
    light += pointLight(
        vec3(1.0),            // Light color
        10.0,                 // Light intensity,
        normal,               // Normal
        vec3(0.0 + meshHeight, 0.25 + meshHeight, 0.0 + meshHeight), // Light position
        viewDir,              // View direction
        30.0,                 // Specular power
        vViewPosition,        // Position
        0.195                  // Decay 0.95
    );

    albedo *= light;

    gl_FragColor = vec4(albedo, 1.0);
}