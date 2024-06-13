import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { BasicShader } from './custom.js';

export default class PostProcessing {
    constructor(renderer, scene, camera, sizes, params) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.sizes = sizes;
        this.params = params; // Store params for later use

        this.composer = null;
        this.customPass = null; // Store reference to customPass

        this.init();
    }

    init() {
        // Create the composer
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        // Dot screen pass
        const dotScreenPass = new DotScreenPass();
        dotScreenPass.enabled = false;
        this.composer.addPass(dotScreenPass);

        // Glitch pass
        const glitchPass = new GlitchPass();
        glitchPass.goWild = false;
        glitchPass.enabled = false;
        this.composer.addPass(glitchPass);

        // RGB Shift pass
        const rgbShiftPass = new ShaderPass(RGBShiftShader);
        rgbShiftPass.enabled = false;
        this.composer.addPass(rgbShiftPass);

        // Gamma correction pass
        // const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
        // this.composer.addPass(gammaCorrectionPass);  // disabled for bloom

        // Custom pass
        this.customPass = new ShaderPass(BasicShader);
        this.customPass.enabled = this.params.enableBasicShader; // Set initial state
        this.composer.addPass(this.customPass);

        // Antialias pass
        if (this.renderer.getPixelRatio() === 1 && !this.renderer.capabilities.isWebGL2) {
            const smaaPass = new SMAAPass();
            this.composer.addPass(smaaPass);

            console.log('Using SMAA');
        }

        // Unreal Bloom pass
        const unrealBloomPass = new UnrealBloomPass();
        unrealBloomPass.enabled = true;
        this.composer.addPass(unrealBloomPass);

        unrealBloomPass.strength = 0.2;
        unrealBloomPass.radius = 0.0;
        unrealBloomPass.threshold = 0.7;
    }

    resize() {
        // Resize code if needed
        if (this.composer) {
            this.composer.setSize(this.sizes.width, this.sizes.height);
            this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    }

    update() {
        // Add any dynamic updates here
        if (this.composer) {
            this.composer.render();
        }
    }

    toggleBasicShader(enable) {
        if (this.customPass) {
            this.customPass.enabled = enable;
        }
    }
}
