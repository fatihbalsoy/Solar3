#define GLSLIFY 1
/*
 *   vertex.glsl
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/1/22
 *   Last Modified by Fatih Balsoy on 4/1/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

attribute vec3 aPosition;

varying vec3 vPosition;

void main() {
    gl_Position = vec4(aPosition, 1.0);
    vPosition = aPosition;
}