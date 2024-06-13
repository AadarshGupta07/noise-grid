import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { createNoise3D } from 'simplex-noise';
import { gsap } from "gsap";

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

/**
 * Base
 */
// GLTF loader
const gltfLoader = new GLTFLoader()

// Debug
const pane = new Pane();
pane.registerPlugin(EssentialsPlugin);

const fpsGraph = pane.addBlade({
    view: 'fpsgraph',
    label: 'fpsgraph',
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}



/***
 *  Lights
 */
// Ambient Light
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 0
camera.position.y = 100
camera.position.z = 150
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxDistance = 300



const noise3D = createNoise3D();

// Define color maps as arrays of colors
const colorMaps = {
    viridis: [
        [68, 1, 84], [68, 2, 85], [69, 4, 87], [69, 5, 88], [70, 7, 89], [70, 8, 90],
        [70, 10, 92], [71, 11, 93], [71, 13, 94], [71, 14, 95], [71, 16, 96], [72, 17, 98],
        [72, 19, 99], [72, 20, 100], [72, 22, 101], [72, 23, 102], [72, 24, 104],
        [72, 26, 105], [72, 27, 106], [72, 29, 107], [72, 30, 108], [72, 31, 109],
        [72, 33, 110], [72, 34, 111], [72, 36, 112], [72, 37, 113], [71, 38, 114],
        [71, 40, 115], [71, 41, 116], [71, 43, 117], [70, 44, 118], [70, 45, 119],
        [70, 47, 120], [69, 48, 121], [69, 50, 122], [68, 51, 123], [68, 52, 124],
        [68, 54, 124], [67, 55, 125], [67, 56, 126], [66, 58, 127], [66, 59, 128],
        [65, 60, 129], [65, 61, 129], [64, 63, 130], [64, 64, 131], [63, 65, 132],
        [63, 66, 132], [62, 68, 133], [62, 69, 134], [61, 70, 134], [61, 71, 135],
        [60, 73, 136], [60, 74, 136], [59, 75, 137], [59, 76, 137], [58, 78, 138],
        [57, 79, 138], [57, 80, 139], [56, 81, 139], [56, 82, 140], [55, 84, 140],
        [54, 85, 141], [54, 86, 141], [53, 87, 141], [52, 88, 142], [52, 90, 142],
        [51, 91, 142], [50, 92, 143], [50, 93, 143], [49, 94, 143], [48, 95, 143],
        [48, 97, 144], [47, 98, 144], [46, 99, 144], [45, 100, 144], [45, 101, 145],
        [44, 102, 145], [43, 103, 145], [42, 105, 145], [42, 106, 145], [41, 107, 145],
        [40, 108, 145], [39, 109, 146], [38, 110, 146], [38, 111, 146], [37, 113, 146],
        [36, 114, 146], [35, 115, 146], [34, 116, 146], [33, 117, 146], [33, 118, 146],
        [32, 119, 146], [31, 120, 146], [30, 121, 146], [29, 122, 146], [28, 123, 146],
        [27, 124, 146], [26, 125, 146], [26, 126, 146], [25, 127, 146], [24, 128, 146],
        [23, 129, 146], [22, 130, 146], [21, 131, 146], [20, 132, 146], [19, 133, 146],
        [18, 134, 146], [17, 135, 146], [16, 136, 145], [15, 137, 145], [14, 138, 145],
        [13, 139, 145], [12, 140, 145], [11, 141, 145], [10, 142, 144], [9, 143, 144],
        [8, 144, 144], [7, 145, 144], [6, 146, 143], [5, 147, 143], [4, 148, 143],
        [3, 149, 142], [2, 150, 142], [1, 151, 142], [0, 152, 141]
    ],
    magma: [
        [0, 0, 4], [1, 0, 5], [1, 1, 6], [1, 1, 7], [2, 2, 8], [2, 2, 9],
        [3, 3, 10], [4, 4, 12], [5, 5, 13], [6, 6, 15], [7, 7, 16], [8, 8, 18],
        [9, 9, 20], [10, 10, 21], [11, 11, 23], [12, 12, 24], [13, 13, 26],
        [14, 14, 28], [15, 15, 30], [16, 16, 32], [17, 17, 33], [18, 18, 35],
        [19, 19, 37], [20, 20, 39], [21, 21, 41], [22, 22, 43], [23, 23, 45],
        [24, 24, 47], [25, 25, 49], [26, 26, 51], [27, 27, 53], [28, 28, 55],
        [29, 29, 57], [30, 30, 59], [31, 31, 61], [32, 32, 63], [33, 33, 65],
        [34, 34, 67], [35, 35, 69], [36, 36, 71], [37, 37, 73], [38, 38, 75],
        [39, 39, 77], [40, 40, 79], [41, 41, 81], [42, 42, 83], [43, 43, 85],
        [44, 44, 87], [45, 45, 89], [46, 46, 91], [47, 47, 93], [48, 48, 95],
        [49, 49, 97], [50, 50, 99], [51, 51, 101], [52, 52, 103], [53, 53, 105],
        [54, 54, 107], [55, 55, 109], [56, 56, 111], [57, 57, 113], [58, 58, 115],
        [59, 59, 117], [60, 60, 119], [61, 61, 121], [62, 62, 123], [63, 63, 125],
        [64, 64, 127], [65, 65, 129], [66, 66, 131], [67, 67, 133], [68, 68, 135],
        [69, 69, 137], [70, 70, 139], [71, 71, 141], [72, 72, 143], [73, 73, 145],
        [74, 74, 147], [75, 75, 149], [76, 76, 151], [77, 77, 153], [78, 78, 155],
        [79, 79, 157], [80, 80, 159], [81, 81, 161], [82, 82, 163], [83, 83, 165],
        [84, 84, 167], [85, 85, 169], [86, 86, 171], [87, 87, 173], [88, 88, 175],
        [89, 89, 177], [90, 90, 179], [91, 91, 181], [92, 92, 183], [93, 93, 185],
        [94, 94, 187], [95, 95, 189], [96, 96, 191], [97, 97, 193], [98, 98, 195],
        [99, 99, 197], [100, 100, 199], [101, 101, 201], [102, 102, 203], [103, 103, 205],
        [104, 104, 207], [105, 105, 209], [106, 106, 211], [107, 107, 213], [108, 108, 215],
        [109, 109, 217], [110, 110, 219], [111, 111, 221], [112, 112, 223], [113, 113, 225],
        [114, 114, 227], [115, 115, 229], [116, 116, 231], [117, 117, 233], [118, 118, 235],
        [119, 119, 237], [120, 120, 239], [121, 121, 241], [122, 122, 243], [123, 123, 245],
        [124, 124, 247], [125, 125, 249], [126, 126, 251], [127, 127, 253]
    ],
    plasma: [
        [13, 8, 135], [17, 8, 135], [21, 8, 135], [25, 8, 135], [29, 8, 135], [33, 8, 135],
        [37, 8, 135], [41, 8, 135], [45, 8, 135], [49, 8, 135], [53, 8, 135], [57, 8, 135],
        [61, 8, 135], [65, 8, 135], [69, 8, 135], [73, 8, 135], [77, 8, 135], [81, 8, 135],
        [85, 8, 135], [89, 8, 135], [93, 8, 135], [97, 8, 135], [101, 8, 135], [105, 8, 135],
        [109, 8, 135], [113, 8, 135], [117, 8, 135], [121, 8, 135], [125, 8, 135], [129, 8, 135],
        [133, 8, 135], [137, 8, 135], [141, 8, 135], [145, 8, 135], [149, 8, 135], [153, 8, 135],
        [157, 8, 135], [161, 8, 135], [165, 8, 135], [169, 8, 135], [173, 8, 135], [177, 8, 135],
        [181, 8, 135], [185, 8, 135], [189, 8, 135], [193, 8, 135], [197, 8, 135], [201, 8, 135],
        [205, 8, 135], [209, 8, 135], [213, 8, 135], [217, 8, 135], [221, 8, 135], [225, 8, 135],
        [229, 8, 135], [233, 8, 135], [237, 8, 135], [241, 8, 135], [245, 8, 135], [249, 8, 135],
        [253, 8, 135], [255, 11, 136], [255, 15, 137], [255, 19, 138], [255, 23, 139], [255, 27, 140],
        [255, 31, 141], [255, 35, 142], [255, 39, 143], [255, 43, 144], [255, 47, 145], [255, 51, 146],
        [255, 55, 147], [255, 59, 148], [255, 63, 149], [255, 67, 150], [255, 71, 151], [255, 75, 152],
        [255, 79, 153], [255, 83, 154], [255, 87, 155], [255, 91, 156], [255, 95, 157], [255, 99, 158],
        [255, 103, 159], [255, 107, 160], [255, 111, 161], [255, 115, 162], [255, 119, 163], [255, 123, 164],
        [255, 127, 165], [255, 131, 166], [255, 135, 167], [255, 139, 168], [255, 143, 169], [255, 147, 170],
        [255, 151, 171], [255, 155, 172], [255, 159, 173], [255, 163, 174], [255, 167, 175], [255, 171, 176],
        [255, 175, 177], [255, 179, 178], [255, 183, 179], [255, 187, 180], [255, 191, 181], [255, 195, 182],
        [255, 199, 183], [255, 203, 184], [255, 207, 185], [255, 211, 186], [255, 215, 187], [255, 219, 188],
        [255, 223, 189], [255, 227, 190], [255, 231, 191], [255, 235, 192], [255, 239, 193], [255, 243, 194],
        [255, 247, 195], [255, 251, 196], [255, 255, 197]
    ],
    inferno: [
        [0, 0, 4], [1, 0, 5], [2, 0, 6], [3, 0, 7], [4, 0, 8], [5, 0, 9],
        [6, 0, 10], [7, 0, 11], [8, 0, 12], [9, 0, 13], [10, 0, 14], [11, 0, 15],
        [12, 0, 16], [13, 0, 17], [14, 0, 18], [15, 0, 19], [16, 0, 20], [17, 0, 21],
        [18, 0, 22], [19, 0, 23], [20, 0, 24], [21, 0, 25], [22, 0, 26], [23, 0, 27],
        [24, 0, 28], [25, 0, 29], [26, 0, 30], [27, 0, 31], [28, 0, 32], [29, 0, 33],
        [30, 0, 34], [31, 0, 35], [32, 0, 36], [33, 0, 37], [34, 0, 38], [35, 0, 39],
        [36, 0, 40], [37, 0, 41], [38, 0, 42], [39, 0, 43], [40, 0, 44], [41, 0, 45],
        [42, 0, 46], [43, 0, 47], [44, 0, 48], [45, 0, 49], [46, 0, 50], [47, 0, 51],
        [48, 0, 52], [49, 0, 53], [50, 0, 54], [51, 0, 55], [52, 0, 56], [53, 0, 57],
        [54, 0, 58], [55, 0, 59], [56, 0, 60], [57, 0, 61], [58, 0, 62], [59, 0, 63],
        [60, 0, 64], [61, 0, 65], [62, 0, 66], [63, 0, 67], [64, 0, 68], [65, 0, 69],
        [66, 0, 70], [67, 0, 71], [68, 0, 72], [69, 0, 73], [70, 0, 74], [71, 0, 75],
        [72, 0, 76], [73, 0, 77], [74, 0, 78], [75, 0, 79], [76, 0, 80], [77, 0, 81],
        [78, 0, 82], [79, 0, 83], [80, 0, 84], [81, 0, 85], [82, 0, 86], [83, 0, 87],
        [84, 0, 88], [85, 0, 89], [86, 0, 90], [87, 0, 91], [88, 0, 92], [89, 0, 93],
        [90, 0, 94], [91, 0, 95], [92, 0, 96], [93, 0, 97], [94, 0, 98], [95, 0, 99],
        [96, 0, 100], [97, 0, 101], [98, 0, 102], [99, 0, 103], [100, 0, 104], [101, 0, 105],
        [102, 0, 106], [103, 0, 107], [104, 0, 108], [105, 0, 109], [106, 0, 110], [107, 0, 111],
        [108, 0, 112], [109, 0, 113], [110, 0, 114], [111, 0, 115], [112, 0, 116], [113, 0, 117],
        [114, 0, 118], [115, 0, 119], [116, 0, 120], [117, 0, 121], [118, 0, 122], [119, 0, 123],
        [120, 0, 124], [121, 0, 125], [122, 0, 126], [123, 0, 127], [124, 0, 128], [125, 0, 129],
        [126, 0, 130], [127, 0, 131], [128, 0, 132], [129, 0, 133], [130, 0, 134], [131, 0, 135],
        [132, 0, 136], [133, 0, 137], [134, 0, 138], [135, 0, 139], [136, 0, 140], [137, 0, 141],
        [138, 0, 142], [139, 0, 143], [140, 0, 144], [141, 0, 145], [142, 0, 146], [143, 0, 147],
        [144, 0, 148], [145, 0, 149], [146, 0, 150], [147, 0, 151], [148, 0, 152], [149, 0, 153],
        [150, 0, 154], [151, 0, 155], [152, 0, 156], [153, 0, 157], [154, 0, 158], [155, 0, 159],
        [156, 0, 160], [157, 0, 161], [158, 0, 162], [159, 0, 163], [160, 0, 164], [161, 0, 165],
        [162, 0, 166], [163, 0, 167], [164, 0, 168], [165, 0, 169], [166, 0, 170], [167, 0, 171],
        [168, 0, 172], [169, 0, 173], [170, 0, 174], [171, 0, 175], [172, 0, 176], [173, 0, 177],
        [174, 0, 178], [175, 0, 179], [176, 0, 180], [177, 0, 181], [178, 0, 182], [179, 0, 183],
        [180, 0, 184], [181, 0, 185], [182, 0, 186], [183, 0, 187], [184, 0, 188], [185, 0, 189],
        [186, 0, 190], [187, 0, 191], [188, 0, 192], [189, 0, 193], [190, 0, 194], [191, 0, 195],
        [192, 0, 196], [193, 0, 197], [194, 0, 198], [195, 0, 199], [196, 0, 200], [197, 0, 201],
        [198, 0, 202], [199, 0, 203], [200, 0, 204], [201, 0, 205], [202, 0, 206], [203, 0, 207],
        [204, 0, 208], [205, 0, 209], [206, 0, 210], [207, 0, 211], [208, 0, 212], [209, 0, 213],
        [210, 0, 214], [211, 0, 215], [212, 0, 216], [213, 0, 217], [214, 0, 218], [215, 0, 219],
        [216, 0, 220], [217, 0, 221], [218, 0, 222], [219, 0, 223], [220, 0, 224], [221, 0, 225],
        [222, 0, 226], [223, 0, 227], [224, 0, 228], [225, 0, 229], [226, 0, 230], [227, 0, 231],
        [228, 0, 232], [229, 0, 233], [230, 0, 234], [231, 0, 235], [232, 0, 236], [233, 0, 237],
        [234, 0, 238], [235, 0, 239], [236, 0, 240], [237, 0, 241], [238, 0, 242], [239, 0, 243],
        [240, 0, 244], [241, 0, 245], [242, 0, 246], [243, 0, 247], [244, 0, 248], [245, 0, 249],
        [246, 0, 250], [247, 0, 251], [248, 0, 252], [249, 0, 253], [250, 0, 254], [251, 0, 255]
    ],
    cividis: [
        [0, 32, 76], [0, 33, 77], [0, 34, 79], [0, 36, 80], [0, 37, 82], [0, 39, 83],
        [0, 40, 85], [0, 42, 86], [0, 44, 88], [0, 45, 89], [0, 47, 91], [0, 48, 92],
        [0, 50, 93], [0, 51, 95], [0, 53, 96], [0, 55, 98], [0, 56, 99], [0, 58, 100],
        [0, 59, 102], [0, 61, 103], [0, 63, 104], [0, 64, 106], [0, 66, 107], [0, 68, 108],
        [0, 69, 110], [0, 71, 111], [0, 73, 113], [0, 74, 114], [0, 76, 115], [0, 78, 116],
        [0, 79, 118], [0, 81, 119], [0, 83, 121], [0, 84, 122], [0, 86, 123], [0, 88, 124],
        [0, 89, 126], [0, 91, 127], [0, 93, 128], [0, 94, 130], [0, 96, 131], [0, 98, 132],
        [0, 99, 134], [0, 101, 135], [0, 103, 136], [0, 104, 137], [0, 106, 139], [0, 108, 140],
        [0, 109, 141], [0, 111, 143], [0, 113, 144], [0, 114, 145], [0, 116, 147], [0, 118, 148],
        [0, 119, 149], [0, 121, 150], [0, 123, 152], [0, 124, 153], [0, 126, 154], [0, 128, 156],
        [0, 129, 157], [0, 131, 158], [0, 133, 160], [0, 134, 161], [0, 136, 162], [0, 138, 164],
        [0, 139, 165], [0, 141, 166], [0, 143, 167], [0, 144, 169], [0, 146, 170], [0, 148, 171],
        [0, 149, 173], [0, 151, 174], [0, 153, 175], [0, 154, 176], [0, 156, 178], [0, 158, 179],
        [0, 159, 180], [0, 161, 182], [0, 163, 183], [0, 164, 184], [0, 166, 185], [0, 168, 187],
        [0, 169, 188], [0, 171, 189], [0, 173, 191], [0, 174, 192], [0, 176, 193], [0, 178, 194],
        [0, 179, 196], [0, 181, 197], [0, 183, 198], [0, 184, 200], [0, 186, 201], [0, 188, 202],
        [0, 189, 203], [0, 191, 205], [0, 193, 206], [0, 194, 207], [0, 196, 208], [0, 198, 210],
        [0, 199, 211], [0, 201, 212], [0, 203, 213], [0, 204, 215], [0, 206, 216], [0, 208, 217],
        [0, 209, 218], [0, 211, 219], [0, 213, 221], [0, 214, 222], [0, 216, 223], [0, 218, 225],
        [0, 219, 226], [0, 221, 227], [0, 223, 228], [0, 224, 229], [0, 226, 231], [0, 228, 232],
        [0, 229, 233], [0, 231, 234], [0, 233, 236], [0, 234, 237], [0, 236, 238], [0, 238, 239],
        [0, 239, 241], [0, 241, 242], [0, 243, 243], [0, 244, 244], [0, 246, 246], [0, 248, 247],
        [0, 249, 248], [0, 251, 249], [0, 253, 251], [0, 254, 252], [0, 255, 253], [0, 255, 255]
    ],
    mako: [
        [0, 36, 77], [0, 37, 79], [0, 38, 81], [0, 40, 82], [0, 41, 84], [0, 42, 86],
        [0, 44, 87], [0, 45, 89], [0, 47, 91], [0, 48, 92], [0, 50, 94], [0, 51, 96],
        [0, 52, 97], [0, 54, 99], [0, 55, 101], [0, 57, 102], [0, 58, 104], [0, 60, 106],
        [0, 61, 107], [0, 63, 109], [0, 64, 111], [0, 66, 112], [0, 67, 114], [0, 69, 116],
        [0, 70, 117], [0, 72, 119], [0, 73, 121], [0, 75, 122], [0, 76, 124], [0, 78, 126],
        [0, 79, 127], [0, 81, 129], [0, 82, 131], [0, 84, 132], [0, 85, 134], [0, 87, 136],
        [0, 88, 137], [0, 90, 139], [0, 91, 141], [0, 93, 142], [0, 94, 144], [0, 96, 146],
        [0, 97, 147], [0, 99, 149], [0, 100, 151], [0, 102, 152], [0, 103, 154], [0, 105, 156],
        [0, 106, 157], [0, 108, 159], [0, 109, 161], [0, 111, 162], [0, 112, 164], [0, 114, 166],
        [0, 115, 167], [0, 117, 169], [0, 118, 171], [0, 120, 172], [0, 121, 174], [0, 123, 176],
        [0, 124, 177], [0, 126, 179], [0, 127, 181], [0, 129, 182], [0, 130, 184], [0, 132, 186],
        [0, 133, 187], [0, 135, 189], [0, 136, 191], [0, 138, 192], [0, 139, 194], [0, 141, 196],
        [0, 142, 197], [0, 144, 199], [0, 145, 201], [0, 147, 202], [0, 148, 204], [0, 150, 206],
        [0, 151, 207], [0, 153, 209], [0, 154, 211], [0, 156, 212], [0, 157, 214], [0, 159, 216],
        [0, 160, 217], [0, 162, 219], [0, 163, 221], [0, 165, 222], [0, 166, 224], [0, 168, 226],
        [0, 169, 227], [0, 171, 229], [0, 172, 231], [0, 174, 232], [0, 175, 234], [0, 177, 236],
        [0, 178, 237], [0, 180, 239], [0, 181, 241], [0, 183, 242], [0, 184, 244], [0, 186, 246],
        [0, 187, 247], [0, 189, 249], [0, 190, 251], [0, 192, 252], [0, 193, 254], [0, 195, 255]
    ],
    rocket: [
        [5, 10, 15], [7, 11, 16], [8, 13, 18], [10, 15, 20], [11, 17, 22], [13, 19, 24],
        [14, 20, 26], [16, 22, 28], [18, 24, 30], [19, 26, 32], [21, 28, 34], [22, 30, 36],
        [24, 31, 38], [25, 33, 40], [27, 35, 42], [28, 37, 44], [30, 39, 46], [31, 40, 48],
        [33, 42, 50], [34, 44, 52], [36, 46, 54], [37, 48, 56], [39, 49, 58], [41, 51, 60],
        [42, 53, 62], [44, 55, 64], [45, 57, 66], [47, 58, 68], [48, 60, 70], [50, 62, 72],
        [51, 64, 74], [53, 66, 76], [54, 67, 78], [56, 69, 80], [57, 71, 82], [59, 73, 84],
        [60, 75, 86], [62, 76, 88], [63, 78, 90], [65, 80, 92], [66, 82, 94], [68, 84, 96],
        [69, 85, 98], [71, 87, 100], [72, 89, 102], [74, 91, 104], [75, 93, 106], [77, 94, 108],
        [78, 96, 110], [80, 98, 112], [81, 100, 114], [83, 101, 116], [85, 103, 118], [86, 105, 120],
        [88, 107, 122], [89, 109, 124], [91, 110, 126], [92, 112, 128], [94, 114, 130], [95, 116, 132],
        [97, 118, 134], [98, 119, 136], [100, 121, 138], [101, 123, 140], [103, 125, 142], [104, 126, 144],
        [106, 128, 146], [107, 130, 148], [109, 132, 150], [110, 134, 152], [112, 135, 154], [113, 137, 156],
        [115, 139, 158], [116, 141, 160], [118, 142, 162], [119, 144, 164], [121, 146, 166], [122, 148, 168],
        [124, 150, 170], [125, 151, 172], [127, 153, 174], [128, 155, 176], [130, 157, 178], [131, 159, 180],
        [133, 160, 182], [134, 162, 184], [136, 164, 186], [137, 166, 188], [139, 167, 190], [141, 169, 192],
        [142, 171, 194], [144, 173, 196], [145, 175, 198], [147, 176, 200], [148, 178, 202], [150, 180, 204],
        [151, 182, 206], [153, 184, 208], [154, 185, 210], [156, 187, 212], [157, 189, 214], [159, 191, 216],
        [161, 192, 218], [162, 194, 220], [164, 196, 222], [165, 198, 224], [167, 200, 226], [168, 201, 228],
        [170, 203, 230], [171, 205, 232], [173, 207, 234], [174, 209, 236], [176, 210, 238], [177, 212, 240],
        [179, 214, 242], [180, 216, 244], [182, 218, 246], [183, 219, 248], [185, 221, 250], [186, 223, 252],
        [188, 225, 254], [190, 227, 255]
    ],
    turbo: [
        [34, 0, 204], [38, 0, 217], [42, 0, 229], [45, 0, 242], [49, 0, 255], [53, 0, 255],
        [57, 0, 255], [61, 0, 255], [65, 0, 255], [69, 0, 255], [72, 0, 255], [76, 0, 255],
        [80, 0, 255], [84, 0, 255], [88, 0, 255], [92, 0, 255], [96, 0, 255], [99, 0, 255],
        [103, 0, 255], [107, 0, 255], [111, 0, 255], [115, 0, 255], [119, 0, 255], [122, 0, 255],
        [126, 0, 255], [130, 0, 255], [134, 0, 255], [138, 0, 255], [142, 0, 255], [145, 0, 255],
        [149, 0, 255], [153, 0, 255], [157, 0, 255], [161, 0, 255], [165, 0, 255], [169, 0, 255],
        [172, 0, 255], [176, 0, 255], [180, 0, 255], [184, 0, 255], [188, 0, 255], [192, 0, 255],
        [195, 0, 255], [199, 0, 255], [203, 0, 255], [207, 0, 255], [211, 0, 255], [215, 0, 255],
        [218, 0, 255], [222, 0, 255], [226, 0, 255], [230, 0, 255], [234, 0, 255], [238, 0, 255],
        [241, 0, 255], [245, 0, 255], [249, 0, 255], [253, 0, 255], [255, 4, 252], [255, 8, 248],
        [255, 12, 244], [255, 16, 241], [255, 20, 237], [255, 24, 234], [255, 27, 230], [255, 31, 227],
        [255, 35, 223], [255, 39, 220], [255, 43, 216], [255, 47, 213], [255, 50, 209], [255, 54, 206],
        [255, 58, 202], [255, 62, 199], [255, 66, 195], [255, 70, 192], [255, 74, 188], [255, 77, 185],
        [255, 81, 181], [255, 85, 178], [255, 89, 174], [255, 93, 171], [255, 97, 167], [255, 100, 164],
        [255, 104, 160], [255, 108, 157], [255, 112, 153], [255, 116, 150], [255, 120, 146], [255, 123, 143],
        [255, 127, 139], [255, 131, 136], [255, 135, 132], [255, 139, 129], [255, 143, 125], [255, 146, 122],
        [255, 150, 118], [255, 154, 115], [255, 158, 111], [255, 162, 108], [255, 166, 104], [255, 169, 101],
        [255, 173, 97], [255, 177, 94], [255, 181, 90], [255, 185, 87], [255, 189, 83], [255, 192, 80],
        [255, 196, 76], [255, 200, 73], [255, 204, 69], [255, 208, 66], [255, 212, 62], [255, 216, 59],
        [255, 219, 55], [255, 223, 52], [255, 227, 48], [255, 231, 45], [255, 235, 41], [255, 239, 38],
        [255, 243, 34], [255, 246, 31], [255, 250, 27], [255, 254, 24], [253, 255, 22], [249, 255, 22],
        [246, 255, 22], [243, 255, 22], [240, 255, 22], [236, 255, 22], [233, 255, 22], [230, 255, 22],
        [227, 255, 22], [223, 255, 22], [220, 255, 22], [217, 255, 22], [214, 255, 22], [210, 255, 22],
        [207, 255, 22], [204, 255, 22], [200, 255, 22], [197, 255, 22], [194, 255, 22], [191, 255, 22],
        [187, 255, 22], [184, 255, 22], [181, 255, 22], [178, 255, 22], [174, 255, 22], [171, 255, 22],
        [168, 255, 22], [165, 255, 22], [161, 255, 22], [158, 255, 22], [155, 255, 22], [152, 255, 22],
        [148, 255, 22], [145, 255, 22], [142, 255, 22], [139, 255, 22], [135, 255, 22], [132, 255, 22],
        [129, 255, 22], [126, 255, 22], [122, 255, 22], [119, 255, 22], [116, 255, 22], [113, 255, 22],
        [109, 255, 22], [106, 255, 22], [103, 255, 22], [100, 255, 22], [96, 255, 22], [93, 255, 22],
        [90, 255, 22], [87, 255, 22], [83, 255, 22], [80, 255, 22], [77, 255, 22], [73, 255, 22],
        [70, 255, 22], [67, 255, 22], [64, 255, 22], [60, 255, 22], [57, 255, 22], [54, 255, 22],
        [50, 255, 22], [47, 255, 22], [44, 255, 22], [41, 255, 22], [37, 255, 22], [34, 255, 22],
        [31, 255, 22], [28, 255, 22], [24, 255, 22], [21, 255, 24], [20, 255, 27], [20, 255, 31],
        [20, 255, 34], [20, 255, 37], [20, 255, 40], [20, 255, 44], [20, 255, 47], [20, 255, 50],
        [20, 255, 54], [20, 255, 57], [20, 255, 60], [20, 255, 64], [20, 255, 67], [20, 255, 70],
        [20, 255, 73], [20, 255, 77], [20, 255, 80], [20, 255, 83], [20, 255, 87], [20, 255, 90],
        [20, 255, 93], [20, 255, 96], [20, 255, 100], [20, 255, 103], [20, 255, 106], [20, 255, 109],
        [20, 255, 113], [20, 255, 116], [20, 255, 119], [20, 255, 122], [20, 255, 126], [20, 255, 129],
        [20, 255, 132], [20, 255, 135], [20, 255, 139], [20, 255, 142], [20, 255, 145], [20, 255, 148],
        [20, 255, 152], [20, 255, 155], [20, 255, 158], [20, 255, 161], [20, 255, 165], [20, 255, 168],
        [20, 255, 171], [20, 255, 174], [20, 255, 178], [20, 255, 181], [20, 255, 184], [20, 255, 187],
        [20, 255, 191], [20, 255, 194], [20, 255, 197], [20, 255, 200], [20, 255, 204], [20, 255, 207],
        [20, 255, 210], [20, 255, 214], [20, 255, 217], [20, 255, 220], [20, 255, 223], [20, 255, 227],
        [20, 255, 230], [20, 255, 233], [20, 255, 236], [20, 255, 240], [20, 255, 243], [20, 255, 246],
        [20, 255, 250], [20, 255, 253], [18, 255, 255]
    ],
}

// Helper function to interpolate between colors
function interpolateColors(color1, color2, factor) {
    const result = new THREE.Color();
    result.r = color1.r + factor * (color2.r - color1.r);
    result.g = color1.g + factor * (color2.g - color1.g);
    result.b = color1.b + factor * (color2.b - color1.b);
    return result;
}

// Convert color map arrays to THREE.Color arrays
function getColorMap(colorMapArray) {
    return colorMapArray.map(rgb => new THREE.Color(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`));
}

let selectedColorMap = getColorMap(colorMaps.plasma); // Default to plasma

// Parameters for GUI
const params = {
    color: '#ffffff',
    colorMap: 'plasma',
    applyRotation: true,
    enablePostProcessing: false,
    enableBasicShader: true,
    rotationSpeed: 1.0,
    noiseScale: 0.03,
    noiseSpeed: 0.1,
    yScaleAmplitude: 100.5,
    squareCubeScale: 1.35
};

const gridSize = 25;
const rectHeight = 0.6;

const spacing = 3.5;
const numInstances = (gridSize * 2 + 1) * (gridSize * 2 + 1);


function createInstancedMesh() {

    // Adjust geometry dimensions based on applyRotation
    const rectWidth = params.applyRotation ? 1 : params.squareCubeScale;
    const rectDepth = params.applyRotation ? 3 : params.squareCubeScale;

    const geometry = new THREE.BoxGeometry(rectWidth, rectHeight, rectDepth);
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {},
        vertexColors: true,
        // transparent: true,
        // blending: THREE.AdditiveBlending
    });
    const instancedMesh = new THREE.InstancedMesh(geometry, material, numInstances);

    const dummy = new THREE.Object3D();
    const instanceColors = new Float32Array(numInstances * 3);

    let index = 0;
    for (let x = -gridSize; x <= gridSize; x++) {
        for (let z = -gridSize; z <= gridSize; z++) {
            dummy.position.set(x * spacing, 0, z * spacing);
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(index, dummy.matrix);

            // Initialize instance colors (we'll update these in applyNoise)
            instanceColors[index * 3] = 1.0;
            instanceColors[index * 3 + 1] = 1.0;
            instanceColors[index * 3 + 2] = 1.0;

            index++;
        }
    }
    instancedMesh.geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(instanceColors, 3));

    return instancedMesh;
}

let instancedMesh = createInstancedMesh();
scene.add(instancedMesh);


// Animate Noise

function applyNoise(time) {
    const dummy = new THREE.Object3D();
    const instanceColors = instancedMesh.geometry.attributes.instanceColor.array;

    let index = 0;
    for (let x = -gridSize; x <= gridSize; x++) {
        for (let z = -gridSize; z <= gridSize; z++) {
            const noiseValue = noise3D(x * params.noiseScale, time * params.noiseSpeed, z * params.noiseScale);
            const scaleY = Math.max(rectHeight, 10 + noiseValue * params.yScaleAmplitude); // Ensure scaleY is positive

            dummy.position.set(x * spacing, (scaleY - 1) * rectHeight / 2, z * spacing);

            if (params.applyRotation) {
                dummy.rotation.y = noiseValue * Math.PI * 2 * params.rotationSpeed;
                const scaleX = 1 + noiseValue * 0.5;
                const scaleZ = 1 + noiseValue * 0.5;
                dummy.scale.set(scaleX, scaleY, scaleZ);
            } else {
                dummy.rotation.y = 0;
                dummy.scale.set(params.squareCubeScale, scaleY, params.squareCubeScale);
            }

            dummy.updateMatrix();
            instancedMesh.setMatrixAt(index, dummy.matrix);

            // Update instance color based on noiseValue
            const colorIndex = Math.floor((noiseValue + 1) / 2 * (selectedColorMap.length - 1));
            const nextColorIndex = (colorIndex + 1) % selectedColorMap.length;
            const factor = (noiseValue + 1) / 2 * (selectedColorMap.length - 1) - colorIndex;
            const color = interpolateColors(selectedColorMap[colorIndex], selectedColorMap[nextColorIndex], factor);

            instanceColors[index * 3] = color.r;
            instanceColors[index * 3 + 1] = color.g;
            instanceColors[index * 3 + 2] = color.b;

            index++;
        }
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.geometry.attributes.instanceColor.needsUpdate = true;
}


// Base

const geometry = new THREE.PlaneGeometry(2000, 2000);
geometry.rotateX(Math.PI * 0.5)

const material = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec2 vUv;
        varying float vFogDepth;

        void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vFogDepth = -mvPosition.z;
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        varying float vFogDepth;

        uniform float barSizeX;
        uniform float barSizeY;
        uniform float gapX;
        uniform float gapY;
        uniform float fogDensity;
        uniform vec3 fogColor;
        uniform vec2 holeCenter; // Center of the hole
        uniform vec2 holeSize;   // Size of the hole

        void main() {
            vec2 scaledUv = vUv * 14.0;

            // Check if the current fragment is within the hole region
            vec2 holeMin = holeCenter - holeSize * 0.5;
            vec2 holeMax = holeCenter + holeSize * 0.5;

            if (vUv.x > holeMin.x && vUv.x < holeMax.x && vUv.y > holeMin.y && vUv.y < holeMax.y) {
                discard; // Make the fragment transparent
            }

            // Calculate bar positions using uniform variables
            float barX = step(barSizeX, mod(scaledUv.x * 10.0, 1.0));
            barX *= step(gapX, mod(scaledUv.y * 10.0 + 0.2, 1.0));

            float barY = step(gapY, mod(scaledUv.x * 10.0 + 0.2, 1.0));
            barY *= step(barSizeY, mod(scaledUv.y * 10.0, 1.0));
            
            float strength = max(barX, barY);
            vec3 color = vec3(strength);

            // Fog calculation
            float fogFactor = exp2(-fogDensity * fogDensity * vFogDepth * vFogDepth * 1.442695);
            fogFactor = clamp(fogFactor, 0.0, 1.0);

            // Blend the object color with the fog color
            vec3 finalColor = mix(fogColor, color, fogFactor);

            // Set the final color with proper alpha to avoid additive blending issues
            gl_FragColor = vec4(finalColor, fogFactor * strength);
        }
    `,
    uniforms: {
        barSizeX: { value: 1 }, // Start value for the X bar size
        barSizeY: { value: 1.5 }, // Start value for the Y bar size
        gapX: { value: 0.9 }, // Initial value for the gap in X direction
        gapY: { value: 0.9 },  // Initial value for the gap in Y direction
        fogDensity: { value: 0.005 }, // Fog density
        fogColor: { value: new THREE.Color(0x18142c) }, // Fog color
        holeCenter: { value: new THREE.Vector2(0.5, 0.5) }, // Center of the hole (normalized coordinates)
        holeSize: { value: new THREE.Vector2(0.089, 0.089) } // Size of the hole (normalized coordinates)
    },
    side: THREE.DoubleSide,
    transparent: true
});
// Animate barSizeX and barSizeY from 0 to their target values
gsap.to(material.uniforms.barSizeX, {
    value: 0.5, // Target value for barSizeX
    duration: 2, // Duration of the animation in seconds
    ease: "power2.inOut"
});

gsap.to(material.uniforms.barSizeY, {
    value: 0.5, // Target value for barSizeY
    duration: 2, // Duration of the animation in seconds
    ease: "power2.inOut"
});

// Create the mesh and add it to the scene
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x18142c, 1);


/**
 * GUI 
 */

// Add a folder for tweaking colors
const colorFolder = pane.addFolder({ title: 'Tweak Colors', expanded: false });

colorFolder.addInput(params, 'color', { label: 'Background Color' }).on('change', () => {
    const color = new THREE.Color(params.color);
    scene.background = color;
});

// Handle color map change
colorFolder.addInput(params, 'colorMap', {
    label: 'Color Map',
    options: {
        Viridis: 'viridis',
        Magma: 'magma',
        Plasma: 'plasma',
        Inferno: 'inferno',
        Cividis: 'cividis',
        Mako: 'mako',
        Rocket: 'rocket',
        Turbo: 'turbo'
    }
}).on('change', (obj) => {
    const colorMapArray = colorMaps[obj.value];
    if (colorMapArray) {
        selectedColorMap = getColorMap(colorMapArray);
    } else {
        console.error(`Color map "${obj.value}" not found.`);
    }
});

// Add a folder for noise configuration
const noiseFolder = pane.addFolder({ title: 'Noise Settings', expanded: false });
noiseFolder.addInput(params, 'noiseScale', { min: 0.01, max: 0.1, step: 0.01, label: 'Noise Scale' }).on('change', () => {
    applyNoise(lastElapsedTime); // Update noise application immediately when changing noise scale
});
noiseFolder.addInput(params, 'noiseSpeed', { min: 0.01, max: 1.0, step: 0.01, label: 'Noise Speed' }).on('change', () => {
    applyNoise(lastElapsedTime); // Update noise application immediately when changing noise speed
});

// Add a folder for scale configuration
const scaleFolder = pane.addFolder({ title: 'Amplitude Settings', expanded: false });
scaleFolder.addInput(params, 'yScaleAmplitude', { min: 1, max: 200, step: 1, label: 'Amplitude' }).on('change', () => {
    applyNoise(lastElapsedTime); // Update noise application immediately when changing y-scale amplitude
});

// Add a folder for rotation settings
const rotationFolder = pane.addFolder({ title: 'Rotation Settings', expanded: false });
rotationFolder.addInput(params, 'applyRotation', { label: 'Apply Rotation' }).on('change', (value) => {
    // When toggling rotation, adjust cube dimensions and apply noise
    instancedMesh.geometry.dispose(); // Dispose of the old geometry
    scene.remove(instancedMesh); // Remove the old instanced mesh
    instancedMesh = createInstancedMesh(); // Create a new instanced mesh with updated geometry
    scene.add(instancedMesh); // Add the new instanced mesh to the scene
    applyNoise(lastElapsedTime);
});
rotationFolder.addInput(params, 'rotationSpeed', { min: 0, max: 10, step: 0.1, label: 'Rotation Speed' }).on('change', () => {
    applyNoise(lastElapsedTime); // Update noise application immediately when changing rotation speed
});




import PostProcessing from './PostProcessing/PostProcess.js';
let postProcessing = new PostProcessing(renderer, scene, camera, sizes, params);

if (params.enablePostProcessing) {
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
}
const postProcessingFolder = pane.addFolder({ title: 'Post Processing', expanded: false });
postProcessingFolder.addInput(params, 'enablePostProcessing', { label: 'Enable Post Processing' }).on('change', (value) => {
    params.enablePostProcessing = value.value;
    if (params.enablePostProcessing) {
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    } else {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
});

// a folder for toggling BasicShader
postProcessingFolder.addInput(params, 'enableBasicShader', { label: 'Enable Outline' }).on('change', (value) => {
    params.enableBasicShader = value.value;
    postProcessing.toggleBasicShader(params.enableBasicShader);
});



window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


    if (params.enablePostProcessing) {
        postProcessing.resize()
    }
})


// Title Intro Animation

const tl = gsap.timeline();
tl.from(".title", {
  y: 110,
  ease: "power4.out",
  duration: 1.8,
  delay: 1,
  skewY: 7,
  stagger: {
    amount: 0.3
  }
})


/**
 * Animate
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
    fpsGraph.begin();

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - lastElapsedTime;
    lastElapsedTime = elapsedTime;

    applyNoise(elapsedTime * 2);

    // Update controls
    controls.update();

    // Render based on post-processing toggle state
    if (params.enablePostProcessing) {
        postProcessing.update();
    } else {
        renderer.render(scene, camera);
    }

    fpsGraph.end();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
