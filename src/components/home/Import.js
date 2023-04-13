import React, { Component } from "react";
import "./Home.css";

class Import extends Component {
    constructor(props) {
        super(props);
        this.handleImport = this.handleImport.bind(this);
        this.state = {};
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
        document.getElementById("testFile").click();
    }

    handleImport() {
        var requirementsInput = document.getElementById("requirementsFile");
        var testInput = document.getElementById("testFile");
        var requirementsFile = requirementsInput.files[0];
        var testFile = testInput.files[0];
        let requirementsReader = new FileReader();
        let testReader = new FileReader();
        if (!requirementsFile) {
            console.log("No requirements file selected");
            return;
        }
        if (!testFile) {
            console.log("No test file selected");
            return;
        }

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
                        <span>Choose Requirements File</span>
                        <br></br>
                    </span>
                </button>
                <input
                    type="file"
                    placeholder="placeholder"
                    className="home-textinput input"
                    id="requirementsFile"
                />
                <button
                    className="home-button2 button"
                    onClick={this.openTestFile}
                >
                    <span className="home-text07">
                        <span>Choose Test file</span>
                        <br></br>
                    </span>
                </button>
                <input
                    type="file"
                    placeholder="placeholder"
                    className="home-textinput input"
                    id="testFile"
                />
            </>
        );
    }
}

export default Import;
