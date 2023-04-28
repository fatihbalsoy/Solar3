/*
 *   atmosphere2.v.frag
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/28/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

float4 frag(v2f i) {
    float4 originalCol = tex2D(_MainTex, i.uv);
    float sceneDepthNonLinear = SAMPLE_DEPTH_TEXTURE(_CameraDepthTexture, i.uv);
    float sceneDepth = LinearEyeDepth(sceneDepthNonLinear) * length(i.viewVector);
    float3 rayOrigin = _WorldSpaceCameraPos;
    float3 rayDir = normalize(i.viewVector);
    float dstToOcean = raySphere(planetCentre, oceanRadius, rayOrigin, rayDir);
    float dstToSurface = min(sceneDepth, dstToOcean);
    float2 hitInfo = raySphere(planetCentre, atmosphereRadius, rayorigin, rayDir);
    float dstToAtmosphere = hitInfo.x;
    float dstThroughAtmosphere = min(hitInfo.y, dstToSurface - dstToAtmosphere);
    if(dstThroughAtmosphere > 0) {
        float3 pointInAtmosphere = rayorigin + rayDir * dstToAtmosphere;
        float light = calculateLight(pointInAtmosphere, rayDir, dstThroughAtmosphere);
        return originalCol * (1 - light) + light;
    }
    return originalCol;
}

/**
    rayOrigin: camera position
    rayDir: camera vector
    rayLength: ray length
*/
float calculateLight(float3 rayOrigin, float3 rayDir, float rayLength) {
    float3 inScatterPoint = rayOrigin;
    float stepSize = rayLength / (numInScatteringPoints - 1);
    float inScatteredLight = 0;
    for(int i = 0; i < numInScatteringPoints; i++) {
        float sunRayLength = raySphere(planetCentre, atmosphereRadius, inScatterPoint, dirToSun).y;
        float sunRayOpticalDepth = opticalDepth(inScatterPoint, dirToSun, sunRayLength);
        float viewRayOpticalDepth = opticalDepth(inScatterPoint, -rayDir, stepSize * i);
        float transmittance = exp(-(sunRayOpticalDepth + viewRayOpticalDepth));
        float localDensity = densityAtPoint(inScatterPoint);
        inScatteredLight += localDensity * transmittance * stepSize;
        inScatterPoint += rayDir * stepSize;
    }
    return inScatteredLight;
}

float densityAtPoint(float3 densitySamplePoint) {
    float heightAboveSurface = length(densitySamplePoint - planetCentre) - planetRadius;
    float height01 = heightAboveSurface / (atmosphereRadius - planetRadius);
    float localDensity = exp(-height01 * densityFalloff) * (1 - height01);
    return localDensity;
}
float opticalDepth(float3 rayorigin, float3 rayDir, float rayLength) {
    float3 densitySamplePoint = rayOrigin;
    float stepSize = rayLength / (numOpticalDepthPoints - 1);
    float opticalDepth = 0;

    for(int i = 0; i < numOpticalDepthPoints; i++) {
        float localDensity = densityAtPoint(densitySamplePoint);
        opticalDepth += localDensity * stepSize;
        densitySamplePoint += rayDir * stepSize;
    }

    return opticalDepth;
}