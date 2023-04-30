/*
 *   test.vert
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 5/13/22
 *   Last Modified by Fatih Balsoy on 5/13/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */
#version 300 es

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}