#define GLSLIFY 1
/*
 *   test.frag
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 5/13/22
 *   Last Modified by Fatih Balsoy on 5/13/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

varying vec3 vPosition;

uniform vec3 uSunPos;

void main() {
    color = 1.0 - exp(-1.0 * color);

    gl_FragColor = vec4(color, 1);
}