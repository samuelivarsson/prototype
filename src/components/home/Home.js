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
        this.setRequirementsArray = this.setRequirementsArray.bind(this);
        this.setTestArray = this.setTestArray.bind(this);
    }

    componentDidMount() {
        this.setState((state, props) => {
            return { output: "Hejsan" };
        });
    }

    setRequirementsArray(requirementsArray) {
        console.log(requirementsArray);
        this.setState({
            requirementsArray: requirementsArray,
        });
    }

    setTestArray(testArray) {
        console.log(testArray);
        this.setState({
            testArray: testArray,
        });
    }

    promptBuilder() {}

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
                            setTestArray={this.setTestArray}
                            setRequirementsArray={this.setRequirementsArray}
                        />

                        <Send prompt={this.state.prompt} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
