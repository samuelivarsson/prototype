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
            requirementsArray: "",
            testArray: "",
            resultArray: [],
            isLoading: false,
            requirementObjects: [],
            testObjects: [],
        };
        this.setRequirementsArray = this.setRequirementsArray.bind(this);
        this.setTestArray = this.setTestArray.bind(this);
        this.setResultArray = this.setResultArray.bind(this);
        this.setLoadingFlag = this.setLoadingFlag.bind(this);
        this.setReqAndTestObjects = this.setReqAndTestObjects.bind(this);
    }

    componentDidMount() {
        this.setState((state, props) => {
            return { output: "Hejsan" };
        });
    }

    setRequirementsArray(requirementsArray) {
        this.setState({
            requirementsArray: requirementsArray,
        });
    }

    setTestArray(testArray) {
        this.setState({
            testArray: testArray,
        });
    }

    setResultArray(resultArray) {
        console.log(resultArray);
        this.setState({
            resultArray: resultArray,
        });
    }

    setLoadingFlag(bool) {
        console.log(bool);
        this.setState({
            isLoading: bool,
        });
    }

    setReqAndTestObjects(requirementObjects, testObjects) {
        console.log(requirementObjects);
        console.log(testObjects);
        this.setState({
            requirementObjects: requirementObjects,
            testObjects: testObjects,
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
                    {this.state.isLoading ? (
                        this.state.resultArray.length != 0 ? (
                            <Output
                                output={this.state.output}
                                resultArray={this.state.resultArray}
                                requirementObjects={
                                    this.state.requirementObjects
                                }
                                testObjects={this.state.testObjects}
                            />
                        ) : (
                            <div className="home-analyzing">
                                <div className="lds-ring">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <span className="home-text40">
                                    Analyzing...
                                </span>
                            </div>
                        )
                    ) : (
                        <div className="home-first-time-use-container">
                            <div className="home-user-guide-container">
                                <span className="home-text19">
                                    <span>User Guide</span>
                                    <br></br>
                                </span>
                                <span className="home-text22">
                                    <span>
                                        • Choose to import requirement file
                                        (.csv format) for the test suite.
                                    </span>
                                    <br></br>
                                    <span>
                                        • Choose to import test file (.csv
                                        format) containing test cases for
                                        analysis.
                                    </span>
                                    <br></br>
                                    <span>• Run analysis.</span>
                                    <br></br>
                                    <span>• Review results.</span>
                                    <br></br>
                                </span>
                            </div>
                            <div className="home-limitations-container">
                                <span className="home-text31">
                                    <span>Limitations</span>
                                    <br></br>
                                </span>
                                <span className="home-text34">
                                    <span>
                                        • May occasionally generate incorrect
                                        information
                                    </span>
                                    <br></br>
                                    <span>• Limited to .csv files</span>
                                    <br></br>
                                    <br></br>
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="home-bottom-buttons">
                        <Import
                            setTestArray={this.setTestArray}
                            setRequirementsArray={this.setRequirementsArray}
                        />

                        <Send
                            prompt={this.state.prompt}
                            requirementsArray={this.state.requirementsArray}
                            testArray={this.state.testArray}
                            setResultArray={this.setResultArray}
                            setLoadingFlag={this.setLoadingFlag}
                            setReqAndTestObjects={this.setReqAndTestObjects}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
