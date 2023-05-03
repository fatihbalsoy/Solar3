![Alt text](.readme/solarsystem_3js.png?raw=true  "SolarSystem.js")

[![Build Status](https://img.shields.io/github/actions/workflow/status/fatihbalsoy/SolarSystem.3js/webpack.yml)](https://github.com/fatihbalsoy/SolarSystem.3js/actions/workflows/webpack.yml)
[![Orbit Calculation Status](https://img.shields.io/github/actions/workflow/status/fatihbalsoy/SolarSystem.3js/calculate-orbits.yml?color=blue&label=orbits)](https://github.com/fatihbalsoy/SolarSystem.3js/actions/workflows/calculate-orbits.yml)
[![License](https://img.shields.io/github/license/fatihbalsoy/SolarSystem.3js)](https://github.com/fatihbalsoy/SolarSystem.3js/blob/main/LICENSE)
![Web](https://img.shields.io/badge/Web-three.js%20%7C%20WebGL%20%7C%20ReactJS-lightgreen)

SolarSystem.3js is a stunningly realistic representation of the Solar System, complete with nearby stars, and brought to life through the power of [three.js](https://github.com/mrdoob/three.js/), [WebGL](https://github.com/KhronosGroup/WebGL), and [ReactJS](https://github.com/facebook/react).

## [Launch →](https://fatih.balsoy.com/app/solar-system-3js)

## Gameplay

To adjust the camera's distance, simply scroll up or down. If you want to orbit around a particular celestial object, click and drag your mouse. Additionally, you can center an object on your screen by using the search bar located at the top. For instance, you can search for celestial bodies such as the following:

<details>
<summary>Planets</summary>

* Sun
* Mercury
* Venus
* Earth
* Mars
* Jupiter
* Saturn
* Uranus
* Neptune
* Pluto

</details>

<details>
<summary>Dwarf Planets</summary>

* Pluto
* ~~Ceres~~ (Temporarily Removed)

</details>

<details>
<summary>Moons</summary>

Earth

* Moon

Jupiter

* Europa
* Ganymede
* Io
* Callisto

</details>

<details>
<summary>Stars</summary>

* Antares
* Polaris
* Proxima Centauri
* Rigil Kentaurus
* and lots more!

</details>

## Known Issues

Here are some known issues that will be worked on in the near future:

* The positioning of each celestial object is not entirely precise or accurate.
* The camera is not oriented along the ecliptic plane.
* The camera may not always accurately focus on a star.

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

## Special Thanks and Licenses

This project would not have been possible without these helpful resources:

* [Astronomy Engine by Don Cross - MIT](https://github.com/cosinekitty/astronomy)
* [HYG Star Database by David Nash - CC BY-SA 2.5](https://github.com/astronexus/HYG-Database)
* [Textures by Solar System Scope - CC BY 4.0](https://www.solarsystemscope.com/textures/)
* [Galilean Moon Textures by Stellarium - GPL v2.0](https://github.com/Stellarium/stellarium)
* [Computing Planetary Positions by Paul Schlyter](https://www.stjarnhimlen.se/comp/tutorial.html)
* [Solar System Data by Christophe](https://api.le-systeme-solaire.net/en/)
* [Ephemeris Data by NASA's Horizons System](https://ssd.jpl.nasa.gov/horizons/app.html#/)
* [Monthly Earth Images by NASA](https://visibleearth.nasa.gov/collection/1484/blue-marble)
* [High-res image of Io by USGS](https://pubs.usgs.gov/sim/3168/)

## Contribution

Feel free to submit a pull request for one of the following:

* New features
* Performance enhancements
* Fixing bugs
* Patching security vulnurabilities

## License

SolarSystem.3js is available under the AGPL v3.0 license. See the LICENSE file for more info.
