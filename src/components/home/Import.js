import React, { Component } from "react";
import "./Home.css";
import { CSVToArray, CSVConcat } from "./CSVParser";

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

    //componentDidUpdate(prevProps) {
    //    if (prevProps !== this.props) {
    //
    //    }
    //}

    openRequirementsFile() {
        document.getElementById("requirementsFile").click();
    }

    openTestFile() {
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

        requirementsReader.readAsText(requirementsFile);

        requirementsReader.addEventListener(
            "load",
            () => {
                let rows = CSVConcat(
                    CSVToArray(requirementsReader.result, ",")
                );

                this.props.setRequirementsArray(rows);

                this.setState({
                    chosenRequirementFile: requirementsFile.name,
                });
            },
            "error",
            () => {
                console.error("Could not read requirements file!");
                this.props.setErrorLabel("Could not read requirements file!");
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

        testReader.readAsText(testFile);

        testReader.addEventListener(
            "load",
            () => {
                var rows = CSVConcat(CSVToArray(testReader.result, ","));

                this.props.setTestArray(rows);
                this.setState({
                    chosenTestFile: testFile.name,
                });
            },
            "error",
            () => {
                const errorLabel = "Could not read test file!";
                console.error(errorLabel);
                this.props.setErrorLabel(errorLabel);
            }
        );
    }

    render() {
        //console.log(this.state);
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
                    accept=".csv"
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
                    accept=".csv"
                />
            </>
        );
    }
}

export default Import;
