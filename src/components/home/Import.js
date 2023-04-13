import React, { Component } from "react";
import "./Home.css";

class Import extends Component {
    constructor(props) {
        super(props);
        this.handleRequirementImport = this.handleRequirementImport.bind(this);
        this.handleTestImport = this.handleTestImport.bind(this);
        this.state = {
            chosenRequirementFile: null,
            chosenTestFile: null,
        };
    }

    componentDidMount() {
        if (!this.props) {
            console.log("props is null");
            return;
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            console.log("Props updated in import");
            console.log(this.props);
        }
    }

    openRequirementsFile() {
        document.getElementById("requirementsFile").click();
    }

    openTestFile() {
        console.log("here");
        document.getElementById("testFile").click();
    }

    handleRequirementImport() {
        var requirementsInput = document.getElementById("requirementsFile");
        var requirementsFile = requirementsInput.files[0];
        let requirementsReader = new FileReader();

        if (!requirementsFile) {
            console.log("No requirements file selected");
            return;
        }

        console.log(requirementsFile.name);
        console.log(requirementsInput);

        this.setState({
            chosenRequirementFile: requirementsFile.name,
        });

        requirementsReader.readAsText(requirementsFile);

        requirementsReader.addEventListener(
            "load",
            () => {
                this.props.setRequirementsText(requirementsReader.result);
            },
            "error",
            () => {
                console.error("Could not read requirements file!");
            }
        );
    }

    handleTestImport() {
        var testInput = document.getElementById("testFile");
        var testFile = testInput.files[0];
        let testReader = new FileReader();

        if (!testFile) {
            console.log("No test file selected");
            return;
        }

        console.log(testFile.name);
        console.log(testInput);

        this.setState({
            chosenTestFile: testFile.name,
        });

        testReader.readAsText(testFile);

        testReader.addEventListener(
            "load",
            () => {
                this.props.setTestText(testReader.result);
            },
            "error",
            () => {
                console.error("Could not read test file!");
            }
        );
    }

    render() {
        return (
            <>
                <button
                    className="home-button1 button"
                    onClick={this.openRequirementsFile}
                >
                    <span className="home-text04">
                        <span>
                            {this.state.chosenRequirementFile
                                ? this.state.chosenRequirementFile
                                : "Choose Requirements File"}
                        </span>
                        <br></br>
                    </span>
                </button>
                <input
                    type="file"
                    placeholder="placeholder"
                    className="home-textinput input"
                    id="requirementsFile"
                    onChange={this.handleRequirementImport}
                />
                <button
                    className="home-button2 button"
                    onClick={this.openTestFile}
                >
                    <span className="home-text07">
                        <span>
                            {this.state.chosenTestFile
                                ? this.state.chosenTestFile
                                : "Choose Test file"}
                        </span>
                        <br></br>
                    </span>
                </button>
                <input
                    type="file"
                    placeholder="placeholder"
                    className="home-textinput input"
                    id="testFile"
                    onChange={this.handleTestImport}
                />
            </>
        );
    }
}

export default Import;
