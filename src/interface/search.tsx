/*
 *   search.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/2/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { mdiClose, mdiEarth, mdiMagnify, mdiRocketLaunch, mdiStarFourPoints, mdiStarFourPointsSmall, mdiTelescope, mdiWeb } from "@mdi/js";
import Icon from "@mdi/react";
import { Divider, IconButton, InputBase, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Tooltip } from "@mui/material";
import React from "react";
import { Component } from "react";
import Stars from "../objects/stars";
import { Settings } from "../settings";
import Planet from "../objects/planet";
import Planets from "../objects/planets";
import './search.css';
import { Star } from "../objects/star";
import AppScene from "../scene";
import * as wikiJson from '../data/wiki.json';

class SearchBar extends Component {
    state = {
        value: '',
        showingInfoCard: false,
        results: [] as number[],
    }

    constructor(props: {}) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClickTelescopeIcon = this.onClickTelescopeIcon.bind(this);
        this.onClickFlyIcon = this.onClickFlyIcon.bind(this);
        this.onClickSearchResult = this.onClickSearchResult.bind(this)
        this.onClickSearchBar = this.onClickSearchBar.bind(this)
    }

    searchAndLookAt(s: string) {
        s = s.toLowerCase()
        const star: Star = Stars.indexedDatabase[s]
        const solObject: Planet = Planets[s]
        if (solObject || star) {
            Settings.lookAt = solObject || star
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

    render() {
        const planet = (Settings.lookAt as Planet)
        return (
            <div>
                {
                    this.state.showingInfoCard && Settings.lookAt instanceof Planet ?
                        <div className="info-card-body">
                            <Paper className="info-card">
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
                                    <h4>Photo Details</h4>
                                    <p>License: {this.getPlanetWiki()["photo_credits"]["cc"]}</p>
                                    <p>Author: {this.getPlanetWiki()["photo_credits"]["by"]}</p>
                                </div>
                            </Paper>
                        </div>
                        : null
                }
                <div className="search">
                    <Paper
                        component="form"
                        onSubmit={(e) => e.preventDefault()}
                        className="search-bar"
                    >
                        {/* {this.iconButton("Menu", mdiMenu)} */}
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
                            <Paper className="search-bar search-results">
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