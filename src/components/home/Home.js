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
            chosenRequirementFile: null,
            chosenTestFile: null,
            requirementsArray: "",
            testArray: "",
            mergedRequirementsWithTests: [],
            isFinished: false,
            isLoading: false,
            errorLabel: "",
            analysisProgress: 0,
        };
        this.requirementObjects = [];
        this.testObjects = [];
        this.requirementsWithTests = [];
        this.setChosenRequirementFile = this.setChosenRequirementFile.bind(this);
        this.setChosenTestFile = this.setChosenTestFile.bind(this);
        this.setErrorLabel = this.setErrorLabel.bind(this);
        this.resetAnalysisProgress = this.resetAnalysisProgress.bind(this);
        this.increaseAnalysisProgress = this.increaseAnalysisProgress.bind(this);
        this.setRequirementsArray = this.setRequirementsArray.bind(this);
        this.setTestArray = this.setTestArray.bind(this);
        this.addRequirementWithTests = this.addRequirementWithTests.bind(this);
        this.setRequirementsWithTests = this.setRequirementsWithTests.bind(this);
        this.setMergedRequirementsWithTests = this.setMergedRequirementsWithTests.bind(this);
        this.setIsFinished = this.setIsFinished.bind(this);
        this.setLoadingFlag = this.setLoadingFlag.bind(this);
        this.addRequirementObject = this.addRequirementObject.bind(this);
        this.setRequirementObjects = this.setRequirementObjects.bind(this);
        this.addTestObject = this.addTestObject.bind(this);
        this.setTestObjects = this.setTestObjects.bind(this);
        this.handleNewAnalysis = this.handleNewAnalysis.bind(this);
    }

    setChosenRequirementFile(file) {
        this.setState({
            chosenRequirementFile: file,
        });
    }

    setChosenTestFile(file) {
        this.setState({
            chosenTestFile: file,
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

    addRequirementWithTests(obj) {
        this.requirementsWithTests.push(obj);
    }

    setRequirementsWithTests(arr) {
        this.requirementsWithTests = arr;
    }

    setMergedRequirementsWithTests(arr) {
        this.setState({
            mergedRequirementsWithTests: [...arr],
        });
    }

    setIsFinished(val) {
        this.setState({
            isFinished: val,
        });
    }

    setLoadingFlag(bool) {
        this.setState({
            isLoading: bool,
        });
        if (bool) {
            document.getElementById("home-bottom-buttonsId").style.display = "none";
        } else {
            document.getElementById("home-bottom-buttonsId").style.display = "flex";
        }
    }

    addRequirementObject(obj) {
        this.requirementObjects.push(obj);
    }

    setRequirementObjects(objs) {
        this.requirementObjects = objs;
    }

    addTestObject(obj) {
        this.testObjects.push(obj);
    }

    setTestObjects(objs) {
        this.testObjects = objs;
    }

    handleNewAnalysis() {
        this.setChosenRequirementFile(null);
        this.setChosenTestFile(null);
        this.setRequirementsArray("");
        this.setTestArray("");
        this.setIsFinished(false);
        this.setLoadingFlag(false);
        this.setRequirementObjects([]);
        this.setTestObjects([]);
        this.setRequirementsWithTests([]);
        this.resetAnalysisProgress();
        this.setMergedRequirementsWithTests([]);
    }

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
                    <button
                        className="home-button button"
                        onClick={this.handleNewAnalysis}
                        disabled={
                            this.state.isLoading &&
                            this.requirementsWithTests.length == 0 &&
                            !this.state.isFinished
                        }
                    >
                        <span className="home-text">
                            <span>+ New Analysis</span>
                            <br></br>
                        </span>
                    </button>
                </div>
                <div className="home-container1">
                    {this.state.isLoading ? (
                        this.requirementsWithTests.length != 0 && this.state.isFinished ? (
                            <Output
                                output={this.state.output}
                                mergedRequirementsWithTests={this.state.mergedRequirementsWithTests}
                                requirementObjects={this.requirementObjects}
                                testObjects={this.testObjects}
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
                                        • Choose to import requirement file (.csv format) for the
                                        test suite.
                                    </span>
                                    <br></br>
                                    <span>
                                        • Choose to import test file (.csv format) containing test
                                        cases for analysis.
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
                                    <span>• May occasionally generate incorrect information</span>
                                    <br></br>
                                    <span>• Limited to .csv files</span>
                                    <br></br>
                                    <br></br>
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="home-bottom-buttons" id="home-bottom-buttonsId">
                        <Import
                            setChosenRequirementFile={this.setChosenRequirementFile}
                            setChosenTestFile={this.setChosenTestFile}
                            chosenRequirementFile={this.state.chosenRequirementFile}
                            chosenTestFile={this.state.chosenTestFile}
                            setTestArray={this.setTestArray}
                            setRequirementsArray={this.setRequirementsArray}
                            setErrorLabel={this.setErrorLabel}
                        />

                        <Send
                            requirementsArray={this.state.requirementsArray}
                            testArray={this.state.testArray}
                            requirementsWithTests={this.requirementsWithTests}
                            addRequirementWithTests={this.addRequirementWithTests}
                            setRequirementsWithTests={this.setRequirementsWithTests}
                            mergedRequirementsWithTests={this.state.mergedRequirementsWithTests}
                            setMergedRequirementsWithTests={this.setMergedRequirementsWithTests}
                            setIsFinished={this.setIsFinished}
                            setLoadingFlag={this.setLoadingFlag}
                            requirementObjects={this.requirementObjects}
                            addRequirementObject={this.addRequirementObject}
                            setRequirementObjects={this.setRequirementObjects}
                            testObjects={this.testObjects}
                            addTestObject={this.addTestObject}
                            setTestObjects={this.setTestObjects}
                            setErrorLabel={this.setErrorLabel}
                            resetAnalysisProgress={this.resetAnalysisProgress}
                            increaseAnalysisProgress={this.increaseAnalysisProgress}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
