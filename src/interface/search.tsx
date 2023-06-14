/*
 *   search.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/2/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { mdiClose, mdiEarth, mdiMagnify, mdiMenu, mdiRocketLaunch, mdiStarFourPoints, mdiStarFourPointsSmall, mdiTelescope, mdiWeb } from "@mdi/js";
import Icon from "@mdi/react";
import { Button, Divider, Drawer, IconButton, InputBase, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, SwipeableDrawer, Tooltip } from "@mui/material";
import React, { Component } from "react";
import Stars from "../objects/stars";
import { Settings } from "../settings";
import Planet from "../objects/planet";
import Planets from "../objects/planets";
import './search.scss';
import { Star } from "../objects/star";
import AppScene from "../scene";
import * as wikiJson from '../data/wiki.json';
import { EquatorialCoordinates, HorizontalCoordinates } from "astronomy-engine";
import { convertHourToHMS } from "../utils/utils";
import Crosshair from "./crosshair";
import DrawerContent from "./drawer";

class SearchBar extends Component {
    state = {
        value: '',
        showingInfoCard: false,
        results: [] as number[],
        locationPermission: 'prompt', // 'granted', or 'denied'
        location: null, // GeolocationPosition
        drawerOpen: false
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
        this.onClickAllowLocation = this.onClickAllowLocation.bind(this)
        this.onMenuOpen = this.onMenuOpen.bind(this)
        this.onMenuClose = this.onMenuClose.bind(this)

        this.updateLocationPermissionStatus = this.updateLocationPermissionStatus.bind(this)
        this.getLocation = this.getLocation.bind(this)

        this.updateLocationPermissionStatus()
        this.getLocation()
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
            console.log("No such object:", s)
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

    onClickAllowLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(() => { })
            this.updateLocationPermissionStatus()
        }
    }

    updateLocationPermissionStatus() {
        navigator.permissions.query({ name: 'geolocation' }).then((value) => {
            this.setState({
                locationPermission: value.state
            })
        })
    }

    getLocation() {
        if (navigator.geolocation && this.state.locationPermission == 'granted') {
            navigator.geolocation.getCurrentPosition((value) => {
                this.setState({
                    location: value
                })
            })
        }
    }

    planetPositionComponent() {
        // Location is NOT supported //
        const locationNotSupported = (
            <div></div>
        )
        let not_supported = ["earth", "io", "europa", "ganymede", "callisto"]
        if (!navigator.geolocation ||
            (Settings.lookAt as Planet && not_supported.includes((Settings.lookAt as Planet).id))) {
            return locationNotSupported
        }

        // Location IS supported //
        // - Needs Location Permissions - 
        // TODO: Refresh view after 'Allow Location' is clicked
        const needsPermission = (
            <div>
                <div style={{ height: "15px" }}></div>
                <Button onClick={this.onClickAllowLocation} variant="outlined">Allow Location</Button>
                <div style={{ height: "15px" }}></div>
                <p>
                    To provide accurate planet information based on your current position and deliver a
                    personalized experience, the app requires your location. This allows it to calculate
                    real-time celestial coordinates like RA, Dec, Azimuth, and Altitude for the planet
                    you are viewing.
                </p>
            </div>
        )

        // - Has Location Permissions -
        var equatorialCoords: EquatorialCoordinates = null
        var horizontalCoords: HorizontalCoordinates = null
        if (this.state.locationPermission == 'granted' && Settings.lookAt as Planet && this.state.location) {
            let planet = Settings.lookAt as Planet
            let date = new Date()
            equatorialCoords = planet.getEquatorialCoordinates(date, this.state.location)
            horizontalCoords = planet.getHorizontalCoordinates(date, this.state.location)
        }
        const hasPermission = (
            <div>
                <p>Right Ascension: {equatorialCoords ? convertHourToHMS(equatorialCoords.ra, 1) : "Loading"}</p>
                <p>Declination: {equatorialCoords ? equatorialCoords.dec.toFixed(4) : "Loading"}°</p>
                <div style={{ height: "10px" }}></div>
                <p>Azimuth: {horizontalCoords ? horizontalCoords.azimuth.toFixed(4) : "Loading"}°</p>
                <p>Altitude: {horizontalCoords ? horizontalCoords.altitude.toFixed(4) : "Loading"}°</p>
            </div>
        )

        const locationSupported = (
            <div>
                <h3>Position</h3>
                {
                    this.state.locationPermission == 'granted'
                        ? hasPermission
                        : needsPermission
                }
            </div>
        )

        return locationSupported
    }

    onClickTelescopeIcon() {
        this.searchAndLookAt(this.state.value.toLowerCase())
        SearchBar.hideSearchResults()
    }

    onClickFlyIcon() {
        let planet: Planet = Planets[this.state.value.toLowerCase()]
        if (planet) {
            Settings.lookAt = planet
            AppScene.camera.flyTo(planet, 2000)
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

    onClickSearchBar() {
        SearchBar.hideSearchResults(false)
    }

    onClickCloseInfoCard = () => {
        this.setState({
            showingInfoCard: false
        })
    }

    onMenuOpen = () => {
        this.setState({
            drawerOpen: true
        })
    }

    onMenuClose = () => {
        this.setState({
            drawerOpen: false
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
        const wiki = wikiJson[(Settings.lookAt as Planet).name]
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
        const planet = (Settings.lookAt as Planet)
        if (!this.state.location) {
            this.getLocation()
        }
        return (
            <div>
                <Crosshair />
                {
                    Settings.isDev
                        ? <SwipeableDrawer
                            variant="temporary"
                            open={this.state.drawerOpen}
                            onClose={this.onMenuClose}
                            onOpen={this.onMenuOpen}
                        >
                            <DrawerContent />
                        </SwipeableDrawer>
                        : null
                }
                {
                    this.state.showingInfoCard && Settings.lookAt instanceof Planet ?
                        <div className="info-card-body">
                            <Paper className="info-card search-bar-mobile-full-width">
                                <div>
                                    {/* TODO: Compress images, they are too big. */}
                                    <img src={'assets/images/info/' + planet.id + '.jpeg'} className="info-card-image"></img>
                                </div>
                                <div className="info-card-content">
                                    {this.iconButton("Close", mdiClose, "close", this.onClickCloseInfoCard, false, "info-card-close-button")}
                                    <h1>{planet.name}</h1>
                                    <h3>{planet.type}</h3>
                                    <br />
                                    <p>{this.getPlanetWiki()["extract"]} <a style={{ color: "lightblue" }} target="_blank" rel="noopener noreferrer" href={this.getPlanetWiki()["content_urls"]["desktop"]["page"]}><i><b>Wikipedia</b></i></a></p>
                                    {/* <p>TODO: Table including RA, Dec, Mag, and etc.</p> */}
                                    <br />
                                    {this.planetPositionComponent()}
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
                            </Paper>
                        </div>
                        : null
                }
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
                        {/* {this.iconButton("Target", mdiTelescope, "primary", this.onClickTelescopeIcon,
                        !(Planets[this.state.value.toLowerCase()] || Stars.indexedDatabase[this.state.value.toLowerCase()])
                    )} */}
                        {this.iconButton("Fly", mdiRocketLaunch, "primary", this.onClickFlyIcon, !Planets[this.state.value.toLowerCase()])}
                    </Paper>
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