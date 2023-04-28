import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ProgressBar from "react-bootstrap/ProgressBar";
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
            errorLabel: "",
            analysisProgress: 0,
        };
        this.setErrorLabel = this.setErrorLabel.bind(this);
        this.resetAnalysisProgress = this.resetAnalysisProgress.bind(this);
        this.increaseAnalysisProgress =
            this.increaseAnalysisProgress.bind(this);
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

    resetAnalysisProgress() {
        this.setState({
            analysisProgress: 0,
        });
    }

    increaseAnalysisProgress(number) {
        this.setState((prevState) => ({
            analysisProgress: prevState.analysisProgress + number,
        }));
    }

    setErrorLabel(label) {
        this.setState({
            errorLabel: label,
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
                {this.state.errorLabel.length > 0 && (
                    <div className="home-top-container">
                        <div className="home-error-container">
                            <span className="home-error-label">
                                <span>{this.state.errorLabel}</span>
                                <br></br>
                            </span>
                            <button
                                className="home-close-error button"
                                onClick={() => this.setErrorLabel("")}
                            >
                                X
                            </button>
                        </div>
                    </div>
                )}
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
                                setErrorLabel={this.setErrorLabel}
                            />
                        ) : (
                            <div className="home-analyzing">
                                <span className="home-text40">Analyzing</span>
                                <ProgressBar
                                    className="home-progress-bar"
                                    animated
                                    variant="custom"
                                    now={this.state.analysisProgress}
                                />
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
                            setErrorLabel={this.setErrorLabel}
                        />

                        <Send
                            prompt={this.state.prompt}
                            requirementsArray={this.state.requirementsArray}
                            testArray={this.state.testArray}
                            setResultArray={this.setResultArray}
                            setLoadingFlag={this.setLoadingFlag}
                            setReqAndTestObjects={this.setReqAndTestObjects}
                            setErrorLabel={this.setErrorLabel}
                            resetAnalysisProgress={this.resetAnalysisProgress}
                            increaseAnalysisProgress={
                                this.increaseAnalysisProgress
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
