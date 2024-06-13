import * as THREE from 'three'

const BasicShader = {

    uniforms: {
        tDiffuse: { value: null },
        threshold: { value: 1.0 },
        range: { value: 1.0 },
        color: { value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
        preview: { value: 0.0 }, // if 1 color: black
        background: { value: new THREE.Vector3(1.0, 1.0, 1.0) }
    },

    vertexShader: /* glsl */`

        varying vec2 vUv;

        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            vUv = uv;
        }`,

    fragmentShader: /* glsl */`

        uniform sampler2D tDiffuse;
        uniform float threshold;
        uniform float range;
        uniform vec4 color;
        uniform float preview;
        uniform vec3 background;

        varying vec2 vUv;

        vec4 run(vec2 pos) {
            vec4 center = texture2D(tDiffuse, pos);
            vec3 p00 = texture2D(tDiffuse, pos + vec2(-1.0, -1.0) / vec2(textureSize(tDiffuse, 0))).rgb;
            vec3 p10 = texture2D(tDiffuse, pos + vec2( 0.0, -1.0) / vec2(textureSize(tDiffuse, 0))).rgb;
            vec3 p20 = texture2D(tDiffuse, pos + vec2( 1.0, -1.0) / vec2(textureSize(tDiffuse, 0))).rgb;
            vec3 p01 = texture2D(tDiffuse, pos + vec2(-1.0,  0.0) / vec2(textureSize(tDiffuse, 0))).rgb;
            vec3 p21 = texture2D(tDiffuse, pos + vec2( 1.0,  0.0) / vec2(textureSize(tDiffuse, 0))).rgb;
            vec3 p02 = texture2D(tDiffuse, pos + vec2(-1.0,  1.0) / vec2(textureSize(tDiffuse, 0))).rgb;
            vec3 p12 = texture2D(tDiffuse, pos + vec2( 0.0,  1.0) / vec2(textureSize(tDiffuse, 0))).rgb;
            vec3 p22 = texture2D(tDiffuse, pos + vec2( 1.0,  1.0) / vec2(textureSize(tDiffuse, 0))).rgb;
            vec3 Gv = p00 - p02 + 2.0 * (p10 - p12) + p20 - p22;
            vec3 Gh = p00 - p20 + 2.0 * (p01 - p21) + p02 - p22;
            vec3 G = sqrt(Gv*Gv + Gh*Gh);
            return vec4(mix((preview > 0.5) ? background : center.rgb, color.rgb, color.a *
                min(1.0, max(0.0, max(G.r, max(G.g, G.b)) - threshold) / range)
            ), center.a);
        }

        void main() {
            gl_FragColor = run(vUv);
        }`

};

export { BasicShader };
