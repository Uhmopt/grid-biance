import React, { Component } from 'react';

import Config from '../utils/Config.json';

class Leaderboard extends Component {
    constructor() {
        super();

        this.state = {
            initialised: false,
            grid: {
                cells: 0
            },
            teams: []
        }

        for (var i = 0; i < 8; i++) {
            this.state.teams.push({
                name: "",
                colour: "",
                cellCount: 0,
                gridShare: 0,
                miningTotal: 0,
                className: ""
            });
        }
        console.log(this.state.teams);
    }

    componentDidMount = async() => {
        //make sure this only runs once
        if (!this.state.initialised) {
            await this.populateLeaderboard();
        }
    }

    async populateLeaderboard() {
        fetch(process.env.REACT_APP_BACKEND_URL + "/leaderboard/")
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            if (json.status !== "OK") {
                console.log(json.status + ': ', json.output);
                return;
            }

            if (json.output.total_cell === 0 || typeof json.output.team === "undefined") {
                throw "No leaderboard data to display";
            }

            let teamData = this.state.teams;

            for (let i = 0; i < json.output.team.length; i++) {
                var currentTeamData = {
                    name: Config.team[json.output.team[i].team].name,
                    colour: Config.team[json.output.team[i].team].colour,
                    cellCount: json.output.team[i].cell_count,
                    gridShare: json.output.team[i].grid_stake_share,
                    miningTotal: 1234,
                    className: "teamLeaderboard team" + (parseInt(json.output.team[i].team) + 1) + "Background"
                };

                teamData[i] = currentTeamData;
            }

            //update our auction interface
            console.log("TEAM DATA", json.output);
            this.setState({
                grid: {
                    cells: json.output.total_cells
                },
                teams: teamData
            });

            this.setState({
                initialised: true
            });
        })
        .catch((exception) => {
            console.log("ERROR:", exception);
        });
    }

    render() {
        if (!this.state.initialised) {
            return <div>Loading</div>;
        }

        return (
            <div className="bodyContent">
                <h2>Leaderboard</h2>
                <div>
                    <h3>Grid Info</h3>
                    <div>Total CELL count: {this.state.grid.cells}</div>
                    <div>Total GRID earned: 123456</div>
                </div>
                <div>
                    <div className={this.state.teams[0].className}></div>
                    <div>
                        <h3>#1 Team</h3>
                        <div>Name: {this.state.teams[0].name}</div>
                        <div>CELL count: {this.state.teams[0].cellCount}</div>
                        <div>Total stake: {this.state.teams[0].gridShare}%</div>
                        <div>GRID earned: {this.state.teams[0].miningTotal}</div>
                    </div>
                </div>
                <div>
                    <div className={this.state.teams[1].className}></div>
                    <div>
                        <h3>#2 Team</h3>
                        <div>Name: {this.state.teams[1].name}</div>
                        <div>CELL count: {this.state.teams[1].cellCount}</div>
                        <div>Total stake: {this.state.teams[1].gridShare}%</div>
                        <div>GRID earned: {this.state.teams[1].miningTotal}</div>
                    </div>
                </div>
                <div>
                    <div className={this.state.teams[2].className}></div>
                    <div>
                        <h3>#3 Team</h3>
                        <div>Name: {this.state.teams[2].name}</div>
                        <div>CELL count: {this.state.teams[2].cellCount}</div>
                        <div>Total stake: {this.state.teams[2].gridShare}%</div>
                        <div>GRID earned: {this.state.teams[2].miningTotal}</div>
                    </div>
                </div>
                <div>
                    <div className={this.state.teams[3].className}></div>
                    <div>
                        <h3>#4 Team</h3>
                        <div>Name: {this.state.teams[3].name}</div>
                        <div>CELL count: {this.state.teams[3].cellCount}</div>
                        <div>Total stake: {this.state.teams[3].gridShare}%</div>
                        <div>GRID earned: {this.state.teams[3].miningTotal}</div>
                    </div>
                </div>
                <div>
                    <div className={this.state.teams[4].className}></div>
                    <div>
                        <h3>#5 Team</h3>
                        <div>Name: {this.state.teams[4].name}</div>
                        <div>CELL count: {this.state.teams[4].cellCount}</div>
                        <div>Total stake: {this.state.teams[4].gridShare}%</div>
                        <div>GRID earned: {this.state.teams[4].miningTotal}</div>
                    </div>
                </div>
                <div>
                    <div className={this.state.teams[5].className}></div>
                    <div>
                        <h3>#6 Team</h3>
                        <div>Name: {this.state.teams[5].name}</div>
                        <div>CELL count: {this.state.teams[5].cellCount}</div>
                        <div>Total stake: {this.state.teams[5].gridShare}%</div>
                        <div>GRID earned: {this.state.teams[5].miningTotal}</div>
                    </div>
                </div>
                <div>
                    <div className={this.state.teams[6].className}></div>
                    <div>
                        <h3>#7 Team</h3>
                        <div>Name: {this.state.teams[6].name}</div>
                        <div>CELL count: {this.state.teams[6].cellCount}</div>
                        <div>Total stake: {this.state.teams[6].gridShare}%</div>
                        <div>GRID earned: {this.state.teams[6].miningTotal}</div>
                    </div>
                </div>
                <div>
                    <div className={this.state.teams[7].className}></div>
                    <div>
                        <h3>#8 Team</h3>
                        <div>Name: {this.state.teams[7].name}</div>
                        <div>CELL count: {this.state.teams[7].cellCount}</div>
                        <div>Total stake: {this.state.teams[7].gridShare}%</div>
                        <div>GRID earned: {this.state.teams[7].miningTotal}</div>
                    </div>
                </div>
                <br />
            </div>
        );
    }
}

export default Leaderboard;