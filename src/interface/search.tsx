/*
 *   search.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/2/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { mdiClose, mdiEarth, mdiMagnify, mdiMenu, mdiRocketLaunch, mdiStarFourPoints, mdiStarFourPointsSmall, mdiTelescope, mdiWeb } from "@mdi/js";
import Icon from "@mdi/react";
import { Box, Button, Divider, Drawer, IconButton, InputBase, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Skeleton, SwipeableDrawer, Tooltip } from "@mui/material";
import React, { Component } from "react";
import Stars from "../objects/stars";
import { Settings } from "../settings";
import Planet from "../objects/planet";
import Planets from "../objects/planets";
import './stylesheets/search.scss';
import { Star } from "../objects/star";
import AppScene from "../scene";
import * as wikiJson from '../data/wiki.json';
import * as objectsJson from '../data/objects.json';
import { ConstellationInfo, EquatorialCoordinates, HorizontalCoordinates } from "astronomy-engine";
import { convertHourToHMS } from "../utils/utils";
import Crosshair from "./crosshair";
import DrawerContent from "./drawer";
import LocationDialog from "./dialog_location";
import AppLocation from "../models/location";
import SheetHandle from "./sheet_handle";
import { Global } from "@emotion/react";

class SearchBar extends Component {
    state = {
        value: '',
        showingInfoCard: false,
        results: [] as number[],
        drawerOpen: false,
        mobileInfoCardOpen: false,
        locationDialogOpen: false,
        locationUpdater: 0
    }
    interval: NodeJS.Timer

    constructor(props: {}) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.onClickTelescopeIcon = this.onClickTelescopeIcon.bind(this);
        this.onClickFlyIcon = this.onClickFlyIcon.bind(this);
        this.onClickSearchResult = this.onClickSearchResult.bind(this)
        this.onClickSearchBar = this.onClickSearchBar.bind(this)

        this.onMenuOpen = this.onMenuOpen.bind(this)
        this.onMenuClose = this.onMenuClose.bind(this)
        this.onMobileInfoCardOpen = this.onMobileInfoCardOpen.bind(this)
        this.onMobileInfoCardClose = this.onMobileInfoCardClose.bind(this)

        this.onLocationDialogOpen = this.onLocationDialogOpen.bind(this)
        this.onLocationDialogClose = this.onLocationDialogClose.bind(this)
        this.onLocationSave = this.onLocationSave.bind(this)
    }

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 333);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    searchAndLookAt(s: string) {
        s = s.toLowerCase()
        const star: Star = Stars.indexedDatabase[s]
        const solObject: Planet = Planets[s]
        if (solObject || star) {
            AppScene.camera.animateLookAt(solObject || star, 2000)
        } else {
            // TODO: UI
            // console.log("No such object:", s)
        }
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const search = e.target.value.toLowerCase()

        const result = Stars.indexedTree.binarySearchPrefix(search)
        const slice = Stars.indexedTree.slice(result, result + 5)

        const planets = Planets.array(true)
        const pResult = planets.map((p) => p.id).binarySearchPrefix(search)
        var results = []
        if (planets[pResult]) {
            results.push(planets[pResult].id)
        }
        results = results.concat(slice).filter((value, index, arr) => value.startsWith(search))

        this.setState({
            value: e.target.value,
            results: results,
        });
    }

    onKeyDown(e) {
        if (e.key == "Enter") {
            this.searchAndLookAt(this.state.value)
        }
    }

    padding(p: number = 10) {
        return <div style={{ height: p.toString() + "px" }}></div>
    }

    infoCardTarget(): Planet {
        return Settings.lookAt as Planet
    }

    infoCardImage(className: string = "") {
        return (
            <div>
                {/* TODO: Compress images, they are too big. */}
                <img src={'assets/images/info/' + this.infoCardTarget().id + '.jpeg'} className={`info-card-image ${className}`}></img>
            </div>
        )
    }

    infoCard(includeHeader: boolean) {
        return (
            <div>
                {this.infoCardImage()}
                <div className="info-card-content">
                    {this.iconButton("Close", mdiClose, "close", this.onClickCloseInfoCard, false, "info-card-close-button")}
                    {includeHeader ? <div>
                        <h1>{this.infoCardTarget().name}</h1>
                        <h3>{this.infoCardTarget().type}</h3>
                    </div> : null}
                    <br />
                    <p>{this.getPlanetWiki()["extract"]} <a style={{ color: "lightblue" }} target="_blank" rel="noopener noreferrer" href={this.getPlanetWiki()["content_urls"]["desktop"]["page"]}><i><b>Wikipedia</b></i></a></p>
                    {/* <p>TODO: Table including RA, Dec, Mag, and etc.</p> */}
                    <br />
                    {this.infoCardImage("info-card-image-mobile")}
                    {this.planetPositionComponent()}
                    <br />
                    {this.characteristics()}
                    <br />
                    <h4>Photo Details</h4>
                    <p>License: {this.getPlanetWiki()["photo_credits"]["wiki"]["cc"]}</p>
                    <p>Author: {this.getPlanetWiki()["photo_credits"]["wiki"]["by"]}</p>
                    <br />
                    <h4>Texture Details</h4>
                    <p>License: {this.getPlanetWiki()["photo_credits"]["texture"]["cc"]}</p>
                    <p>Author: {this.getPlanetWiki()["photo_credits"]["texture"]["by"]}</p>
                    <br />
                    <p className="info-card-update-text">
                        Updated on {this.getPlanetWikiDate()} | <a target="_blank" rel="noopener noreferrer" className="info-card-update-text" href={this.getPlanetWiki()["content_urls"]["desktop"]["revisions"]}>Revisions</a> | <a target="_blank" rel="noopener noreferrer" className="info-card-update-text" href={this.getPlanetWiki()["content_urls"]["desktop"]["edit"]}>Edit</a>
                    </p>
                </div>
            </div>
        )
    }

    planetPositionComponent() {
        const setLocationButton =
            <Button onClick={this.onLocationDialogOpen} variant="outlined">Set Location</Button>

        // Planet is NOT supported //
        let not_supported = ["earth", "io", "europa", "ganymede", "callisto"]
        if (!navigator.geolocation ||
            (Settings.lookAt as Planet && not_supported.includes((Settings.lookAt as Planet).id))) {
            return <div></div>
        }

        // Planet IS supported //
        // - Needs Location Setup - //
        const locationNeedsSetup = (
            <div>
                {this.padding(15)}
                {setLocationButton}
                {this.padding(15)}
                <p>
                    To provide accurate planet information based on your chosen location and
                    deliver a personalized experience, the app requires your location. This
                    allows it to calculate real-time celestial coordinates like RA, Dec, Azimuth,
                    and Altitude for the planet you are viewing. You can choose your location
                    by pressing a location on the map, manually inputting coordinates, or
                    automatically fetching it.
                </p>
            </div>
        )

        // - Has Location Permissions -
        var equatorialCoords: EquatorialCoordinates = null
        var horizontalCoords: HorizontalCoordinates = null
        var constellationInfo: ConstellationInfo = null
        if (Settings.geolocation && Settings.lookAt as Planet) {
            let planet = Settings.lookAt as Planet
            let date = new Date()
            let pos = Settings.geolocation.toGeolocationPosition()
            equatorialCoords = planet.getEquatorialCoordinates(date, pos)
            horizontalCoords = planet.getHorizontalCoordinates(date, pos)
            constellationInfo = planet.getConstellation(date, pos)
        }
        const locationIsSet = (
            <div>
                <p>Right Ascension: {equatorialCoords ? convertHourToHMS(equatorialCoords.ra, 1) : "Loading"}</p>
                <p>Declination: {equatorialCoords ? equatorialCoords.dec.toFixed(4) : "Loading"}°</p>
                {this.padding()}
                <p>Azimuth: {horizontalCoords ? horizontalCoords.azimuth.toFixed(4) + "°" : "Loading"}</p>
                <p>Altitude: {horizontalCoords ? horizontalCoords.altitude.toFixed(4) + "°" : "Loading"}</p>
                {this.padding()}
                <p>Constellation: {constellationInfo ? constellationInfo.name : "Loading"}</p>
                {this.padding()}
                {setLocationButton}
            </div>
        )

        const locationSupported = (
            <div>
                <h3>Position</h3>
                {
                    Settings.geolocation
                        ? locationIsSet
                        : locationNeedsSetup
                }
            </div>
        )

        return locationSupported
    }

    characteristics() {
        const solApiData = objectsJson[this.infoCardTarget().id]

        const circumference = (2 * Math.PI * parseFloat(solApiData["meanRadius"])).toFixed(4)
        const circumferenceEquatorial = parseFloat((2 * Math.PI * parseFloat(solApiData["equaRadius"])).toFixed(4))
        const surfaceArea = (4 * Math.PI * Math.pow(parseFloat(solApiData["equaRadius"]), 2)).toFixed(4)
        const siderealRotationSpeed = solApiData["sideralRotation"]
        const equatorialRotationSpeed = ((circumferenceEquatorial / siderealRotationSpeed) / 60 / 60).toFixed(4)
        const temperatureCelsius = (parseFloat(solApiData["avgTemp"]) - 273.15).toFixed(2)
        return (
            <div>
                <h3>Orbital Characteristics</h3>
                <p>Aphelion: {solApiData["aphelion"]} km</p>
                <p>Perihelion: {solApiData["perihelion"]} km</p>
                <p>Semi-major axis: {solApiData["semimajorAxis"]} km</p>
                <p>Eccentricity: {solApiData["eccentricity"]}</p>
                <p>Orbital period: {solApiData["sideralOrbit"]} days</p>
                {/* <p>Orbital speed: {solApiData["meanRadius"]} km/s</p> */}
                <p>Mean anomaly: {solApiData["mainAnomaly"]}&deg;</p>
                <p>Inclination (Ecl): {solApiData["inclination"]}&deg;</p>
                <p>Longitude of ascending node: {solApiData["longAscNode"]}&deg;</p>
                {/* {this.padding()}
                <h4>Satellites</h4>
                 */}
                <br />
                <h3>Physical Characteristics</h3>
                <p>Mean radius: {solApiData["meanRadius"]} km</p>
                <p>Equatorial radius: {solApiData["equaRadius"]} km</p>
                <p>Polar radius: {solApiData["polarRadius"]} km</p>
                <p>Flattening: {solApiData["flattening"]}</p>
                <p>Circumference: {circumference} km</p>
                <p>Surface area: {surfaceArea} km<sup>2</sup></p>
                {
                    solApiData["vol"]
                        ? <p>Volume: {solApiData["vol"]["volValue"]} × 10<sup>{solApiData["vol"]["volExponent"]}</sup> km<sup>3</sup></p>
                        : <p>Volume: N/A</p>
                }
                <p>Mass: {solApiData["mass"]["massValue"]} × 10<sup>{solApiData["mass"]["massExponent"]}</sup> kg</p>
                <p>Mean density: {solApiData["density"]} g/cm<sup>3</sup></p>
                <p>Surface gravity: {solApiData["gravity"]} m/s<sup>2</sup></p>
                {/* <p>Moment of inertia factor: {solApiData["equaRadius"]}</p> */}
                <p>Escape velocity: {solApiData["escape"]} km/s</p>
                {/* <p>Synodic rotation period: {solApiData["equaRadius"]}</p> */}
                <p>Sidereal rotation period: {siderealRotationSpeed} hours</p>
                <p>Equatorial rotation velocity: {equatorialRotationSpeed} km/s</p>
                <p>Axial tilt: {solApiData["axialTilt"]}&deg;</p>
                {/* <p>Albedo: {solApiData["equaRadius"]}</p> */}
                <p>Temperature: {solApiData["avgTemp"]}K ({temperatureCelsius}&deg;C)</p>
                {/* <p>Surface temperature: {solApiData["equaRadius"]}</p> */}
                {/* <p>Absolute magnitude: {solApiData["equaRadius"]}</p> */}
            </div>
        )
    }

    onClickTelescopeIcon() {
        this.searchAndLookAt(this.state.value.toLowerCase())
        SearchBar.hideSearchResults()
    }

    onClickFlyIcon() {
        let planet: Planet = Planets[this.state.value.toLowerCase()]
        if (planet) {
            Settings.lookAt = planet
            AppScene.camera.animateFlyTo(planet, 2000)
        }
        SearchBar.hideSearchResults()
    }

    onClickSearchResult(name: string) {
        this.searchAndLookAt(name)
        SearchBar.hideSearchResults()
        this.setState({
            value: name,
            showingInfoCard: true
        })
    }

    onClickSearchBar() { SearchBar.hideSearchResults(false) }
    onClickCloseInfoCard = () => { this.setState({ showingInfoCard: false }) }
    onMenuOpen() { this.setState({ drawerOpen: true }) }
    onMenuClose() { this.setState({ drawerOpen: false }) }
    onMobileInfoCardOpen() { this.setState({ mobileInfoCardOpen: true }) }
    onMobileInfoCardClose() { this.setState({ mobileInfoCardOpen: false }) }
    onLocationDialogOpen() { this.setState({ locationDialogOpen: true }) }
    onLocationDialogClose() { this.setState({ locationDialogOpen: false }) }

    onLocationSave(position: AppLocation) {
        this.setState({
            locationUpdater: (this.state.locationUpdater + 1) % 2
        })
    }

    static hideSearchResults(state: boolean = true) {
        const searchResults = document.getElementsByClassName('search-results')[0] as HTMLDivElement
        if (searchResults) {
            searchResults.style.display = state ? 'none' : 'initial'
        }
    }

    iconButton(name: string, icon: string, color: any = "default", f: () => any = () => { }, disabled: boolean = false, className: string = "") {
        return (<Tooltip title={name} className={className}>
            <span>
                <IconButton type="button" onClick={f} color={color} disabled={disabled} className="search-bar-icon-button" aria-label={name.toLowerCase()}>
                    <Icon
                        size={1} path={icon}></Icon>
                </IconButton>
            </span>
        </Tooltip >)
    }

    getPlanetWiki() {
        const wiki = wikiJson[this.infoCardTarget().name]
        return wiki
    }

    getPlanetWikiDate(): string {
        const dateString = this.getPlanetWiki()["timestamp"]
        const date = new Date(dateString)
        const formattedDate = date.toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        return formattedDate
    }

    render() {
        const mobileInfoCardBleed = 180
        return (
            <div>
                {/* Crosshair (Enabled when a star is selected) */}
                <Crosshair />
                {/* Navigation Drawer */}
                <SwipeableDrawer
                    variant="temporary"
                    open={this.state.drawerOpen}
                    onClose={this.onMenuClose}
                    onOpen={this.onMenuOpen}
                    style={{ zIndex: 1001 }}
                >
                    <DrawerContent />
                </SwipeableDrawer>
                {/* Location Dialog */}
                <LocationDialog
                    key={this.state.locationDialogOpen ? 1 : 0}
                    open={this.state.locationDialogOpen}
                    onClose={this.onLocationDialogClose}
                    onSave={this.onLocationSave}
                />
                {/* Info Card */}
                {
                    this.state.showingInfoCard && Settings.lookAt instanceof Planet ?
                        <div className="info-card-body">
                            <Paper className="info-card modern-scrollbar search-bar-mobile-full-width">
                                {this.infoCard(true)}
                            </Paper>
                        </div>
                        : null
                }
                {/* Mobile Info Card */}
                <Global
                    styles={
                        {
                            ".MuiDrawer-root.info-card-mobile > .MuiPaper-root": {
                                height: `calc(80vh - ${mobileInfoCardBleed}px)`,
                                overflow: "visible"
                            }
                        }
                    }
                />
                {
                    this.state.showingInfoCard && Settings.lookAt instanceof Planet ?
                        <SwipeableDrawer
                            className="info-card-mobile"
                            anchor="bottom"
                            open={this.state.mobileInfoCardOpen}
                            onClose={this.onMobileInfoCardClose}
                            onOpen={this.onMobileInfoCardOpen}
                            swipeAreaWidth={mobileInfoCardBleed}
                            disableSwipeToOpen={false}
                            style={{ zIndex: 1000 }}
                            ModalProps={{
                                keepMounted: true
                            }}
                        >
                            <Paper
                                sx={{
                                    position: "absolute",
                                    top: -mobileInfoCardBleed,
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8,
                                    visibility: "visible",
                                    right: 0,
                                    left: 0,
                                }}
                            >
                                <SheetHandle />
                                <div className="info-card-content">
                                    <h1>{this.infoCardTarget().name}</h1>
                                    <h3>{this.infoCardTarget().type}</h3>
                                </div>
                            </Paper>
                            <Paper
                                sx={{
                                    marginTop: `calc(-${mobileInfoCardBleed}px / 2)`,
                                    overflow: "auto",
                                    visibility: 'visible',
                                }}
                            >
                                {this.infoCard(false)}
                            </Paper>
                        </SwipeableDrawer> : null
                }
                {/* Search Bar */}
                <div className="search">
                    <Paper
                        component="form"
                        onSubmit={(e) => e.preventDefault()}
                        className="search-bar search-bar-self search-bar-mobile-full-width"
                    >
                        {this.iconButton("Menu", mdiMenu, "white", this.onMenuOpen)}
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search"
                            onKeyDown={this.onKeyDown}
                            onClick={this.onClickSearchBar}
                            onChange={this.handleChange}
                            value={this.state.value}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                        {this.iconButton("Search", mdiMagnify)}
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        {this.iconButton("Fly", mdiRocketLaunch, "primary", this.onClickFlyIcon, !Planets[this.state.value.toLowerCase()])}
                    </Paper>
                    {/* Search Results */}
                    {
                        this.state.value == '' || this.state.results.length == 0 ? null :
                            <Paper className="search-bar search-results search-bar-mobile-full-width">
                                <List sx={{ width: '100%' }}>
                                    {
                                        this.state.results.map((item, index, array) => {
                                            let obj: Planet | Star = Planets[item] || Stars.indexedDatabase[item]

                                            var icon = mdiEarth
                                            if (obj instanceof Star) {
                                                icon = obj.data.Mag <= 3 ? mdiStarFourPoints : mdiStarFourPointsSmall
                                            }
                                            var name = obj instanceof (Star)
                                                ? obj.data.ProperName
                                                : obj.name


                                            return <ListItem disablePadding key={name}>
                                                <ListItemButton onClick={() => this.onClickSearchResult(name)}>
                                                    <ListItemIcon>
                                                        <Icon size={1} path={icon}></Icon>
                                                    </ListItemIcon>
                                                    <ListItemText primary={name} />
                                                </ListItemButton>
                                            </ListItem>
                                        })
                                    }
                                </List>
                            </Paper>
                    }
                </div>
            </div>
        )
    }
}
export default SearchBar