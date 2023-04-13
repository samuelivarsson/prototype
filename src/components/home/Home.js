import React, { Component } from "react";
import Import from "./Import";
import Send from "./Send";
import Output from "./Output";
import "./Home.css";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prompt: "",
            output: "error",
            requirementsText: "",
            testText: "",
        };
        this.setRequirementsText = this.setRequirementsText.bind(this);
        this.setTestText = this.setTestText.bind(this);
    }

    componentDidMount() {
        this.setState((state, props) => {
            return { output: "Hejsan" };
        });
    }

    setRequirementsText(requirementsText) {
        console.log("Setting prompt in home callback to: " + requirementsText);
        this.setState((state, props) => {
            return { requirementsText: requirementsText };
        });
    }

    setTestText(testText) {
        console.log("Setting prompt in home callback to: " + testText);
        this.setState((state, props) => {
            return { testText: testText };
        });
    }

    render() {
        return (
            <div className="home-container">
                <div className="home-side-bar">
                    <button className="home-button button">
                        <span className="home-text">
                            <span>+ New Analysis</span>
                            <br></br>
                        </span>
                    </button>
                </div>
                <div className="home-container1">
                    <div className="home-output-container">
                        <Output output={this.state.output} />
                    </div>
                    <div className="home-bottom-buttons">
                        <Import
                            setTestText={this.setTestText}
                            setRequirementsText={this.setRequirementsText}
                        />

                        <Send prompt={this.state.prompt} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
