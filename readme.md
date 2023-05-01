![Alt text](.readme/solarsystem_3js.png?raw=true  "SolarSystem.js")

[![Build Status](https://img.shields.io/github/actions/workflow/status/fatihbalsoy/SolarSystem.3js/node.js.yml)](https://github.com/fatihbalsoy/SolarSystem.3js/actions/workflows/node.js.yml)
[![License](https://img.shields.io/github/license/fatihbalsoy/SolarSystem.3js)](https://github.com/fatihbalsoy/SolarSystem.3js/blob/main/LICENSE)
[![Web](https://img.shields.io/badge/Web-three.js-lightgreen)](https://github.com/mrdoob/three.js/)

SolarSystem.3js is a real-time 1:1 scale of the Solar System, including nearby stars, built with the [three.js](https://github.com/mrdoob/three.js/) library. 

## [Launch →](https://fatih.balsoy.com/app/solar-system-3js)

## Gameplay

Scroll to move the camera closer or farther away.

Click and drag to orbit around the selected celestial object.

Center an object on the screen by pressing the following keys: 

* 0 - Sun
* 1 - Mercury
* 2 - Venus
* 3 - Earth
* 4 - Mars
* 5 - Jupiter
* 6 - Saturn
* 7 - Uranus
* 8 - Neptune
* 9 - Pluto

<details>
<summary>Dwarf Planets</summary>

* 9 - Pluto
* ~~c - Ceres (Dwarf Planet)~~ (Temporarily Removed)
</details>

<details>
<summary>Moons</summary>

Earth
* m - Moon

Jupiter
* e - Europa
* g - Ganymede
* i - Io
* v - Callisto
</details>

<details>
<summary>Stars</summary>

* a - Antares (Star)
* c - Ceres (Dwarf Planet)
* o - Polaris (Star)
* p - Proxima Centauri (Star)
* r - Rigil Kentaurus (Star)
</details>

## Known Issues

Here are some known issues that will be worked on in the near future:

* Although the distance between stars is 1:1, the star sizes are extremely large for a visual aesthetic. A custom shader will be written to simulate accurate star sizes and brightness depending on their magnitude.
* The orientation of each celestial object is not yet accurate.
* The camera is not oriented along the ecliptic plane. 

## Setup & Build
Download [Node.js](https://nodejs.org/en/download/).
Run the following commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run serve

# Build for production in the dist/ directory
npm run build:prod

# Calculate orbits and create cache file
npm run calculate-orbits
```

## Special Thanks

This project would not have been possible without these helpful resources:

* [Astronomy Engine by Don Cross](https://github.com/cosinekitty/astronomy)
* [HYG Star Database by David Nash](https://github.com/astronexus/HYG-Database)
* [Computing Planetary Positions by Paul Schlyter](https://www.stjarnhimlen.se/comp/tutorial.html)
* [Ephemeris Data by NASA's Horizons System](https://ssd.jpl.nasa.gov/horizons/app.html#/)
* [Monthly Earth Images by NASA](https://visibleearth.nasa.gov/collection/1484/blue-marble)
* [Textures by Solar System Scope](https://www.solarsystemscope.com/textures/)
* [Milky Way Texture by gammaburst](https://sourceforge.net/p/stellarium/discussion/278769/thread/00fea5e1/#0f6d/ffb1/d1f9/b21b/8d00)
* [More Textures by Stellarium](https://github.com/Stellarium/stellarium)

## License

SolarSystem.3js is available under the AGPL license. See the LICENSE file for more info.
