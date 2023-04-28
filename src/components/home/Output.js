import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Output.css";
import { testSuggestionPrompt } from "./Prompt";
import { Configuration, OpenAIApi } from "openai";

class Output extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestionResponse: {},
            isLoading: {},
        };
        this.renderResultRows = this.renderResultRows.bind(this);
        this.renderResultRow = this.renderResultRow.bind(this);
        this.findTextInObject = this.findTextInObject.bind(this);
        this.getDescription = this.getDescription.bind(this);
        this.getRequirementDescription =
            this.getRequirementDescription.bind(this);
        this.getTestDescription = this.getTestDescription.bind(this);
        this.getTestCasesWithDescription =
            this.getTestCasesWithDescription.bind(this);
        this.sendTestSuggestionPrompt =
            this.sendTestSuggestionPrompt.bind(this);
    }

    // componentWillMount() {}

    componentDidMount() {}

    // componentWillReceiveProps(nextProps) {}

    // shouldComponentUpdate(nextProps, nextState) {}

    // componentWillUpdate(nextProps, nextState) {}

    // componentDidUpdate(prevProps, prevState) {}

    // componentWillUnmount() {}

    findTextInObject(object, text_to_find) {
        const firstSplit = object.split('"' + text_to_find + '": "')[1];
        if (firstSplit == null) {
            console.log(object);
            console.log(text_to_find);
            const errorLabel = "Could not create first split!";
            console.error(errorLabel);
            this.props.setErrorLabel(errorLabel);
            return;
        }
        const secondSplit = firstSplit.split('"')[0];
        if (secondSplit == null) {
            console.log(object);
            console.log(text_to_find);
            const errorLabel = "Could not create second split!";
            console.error(errorLabel);
            this.props.setErrorLabel(errorLabel);
            return;
        }
        return secondSplit;
    }

    getDescription(objects, objectId, type) {
        if (objects == null) {
            const errorLabel = "objects is null!";
            console.error(errorLabel);
            this.props.setErrorLabel(errorLabel);
            return;
        }
        for (let i = 0; i < objects.length; i++) {
            const object = objects[i];
            if (object.includes(objectId)) {
                const text_to_find = type == "TEST" ? "desc" : objectId;
                return this.findTextInObject(object, text_to_find);
            }
        }
        return "";
    }

    getRequirementDescription(requirementId) {
        const requirementObjects = this.props.requirementObjects;
        const type = "REQUIREMENT";
        return this.getDescription(requirementObjects, requirementId, type);
    }

    getTestDescription(testId) {
        const testObjects = this.props.testObjects;
        const type = "TEST";
        return this.getDescription(testObjects, testId, type);
    }

    getTestCasesWithDescription(testsString) {
        const testsArray = testsString.split(", ");
        var result = "";
        for (let i = 0; i < testsArray.length - 1; i++) {
            const testId = testsArray[i];
            const description = this.getTestDescription(testId);
            result += testId + " - " + description + "\n\n";
        }

        // Add last element without new lines
        const testId = testsArray[testsArray.length - 1];
        const description = this.getTestDescription(testId);
        result += testId + " - " + description;

        return result;
    }

    mergeObjectsWithSameId(arr) {
        arr.forEach((obj1) => {
            console.log(obj1);
            const duplicateObjs = arr.filter(
                (obj2) => obj1.ID === obj2.ID && obj1 !== obj2
            );
            console.log(duplicateObjs);
            if (duplicateObjs.length > 0) {
                duplicateObjs.forEach((duplicateObj) => {
                    if (duplicateObj.tests.length > 0) {
                        obj1.tests += `, ${duplicateObj.tests}`;
                    }
                    arr = arr.filter((obj) => obj !== duplicateObj);
                });
            }
        });
        return arr;
    }

    renderResultRows() {
        if (!this.props) {
            console.log("Props is null in Output.js!");
            return;
        }
        const resultArray = this.mergeObjectsWithSameId(this.props.resultArray);
        return resultArray.map((result) => {
            return (
                <div key={result.ID} className="output-row">
                    {this.renderResultRow(result.ID, result.tests)}
                </div>
            );
        });
    }

    formatSuggestion(completion_text) {
        const arr = completion_text.split("-Step ");
        var res = "";
        for (let i = 1; i < arr.length - 1; i++) {
            const row = arr[i];
            res += "Step " + row + "\n";
        }
        res += "Step " + arr[arr.length - 1];
        return res;
    }

    async sendTestSuggestionPrompt(requirementId) {
        this.setState((prevState) => ({
            isLoading: {
                ...prevState.isLoading,
                [requirementId]: true,
            },
        }));

        const configuration = new Configuration({
            organization: "org-Bc7ZnCV6EeMA8vHscXbIqeA5",
            apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        if (!this.props.requirementObjects) {
            const errorLabel = "requirementObjects is null!";
            console.error(errorLabel);
            this.props.setErrorLabel(errorLabel);
            return;
        }

        const messages = [];

        const user_input = testSuggestionPrompt(
            this.getRequirementDescription(requirementId)
        );
        messages.push({ role: "user", content: user_input });

        try {
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo-0301",
                messages: messages,
                temperature: 0.7,
            });
            const completion_text = completion.data.choices[0].message.content;
            this.setState((prevState) => ({
                suggestionResponse: {
                    ...prevState.suggestionResponse,
                    [requirementId]: this.formatSuggestion(completion_text),
                },
            }));
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
        }
    }

    renderResultRow(requirementId, tests) {
        return (
            <>
                <div className="output-col1">
                    <span className="output-row-text">
                        <span>{"• " + requirementId}</span>
                        <br></br>
                    </span>
                </div>
                <div className="output-col2">
                    <span className="output-row-text">
                        <span>
                            {this.getRequirementDescription(requirementId)}
                        </span>
                        <br></br>
                    </span>
                </div>
                {tests.length > 0 ? (
                    <div className="output-col3">
                        <span className="output-row-text">Yes&nbsp;&nbsp;</span>
                        <svg viewBox="0 0 1024 1024" className="output-check">
                            <path d="M864 128l-480 480-224-224-160 160 384 384 640-640z"></path>
                        </svg>
                    </div>
                ) : (
                    <div className="output-col3">
                        <span className="output-row-text">No&nbsp;&nbsp;</span>
                        <svg viewBox="0 0 1024 1024" className="output-cross">
                            <path d="M864 128l-480 480-224-224-160 160 384 384 640-640z"></path>
                        </svg>
                    </div>
                )}
                <div className="output-col4">
                    <span className="output-row-text">
                        {tests.length > 0 ? (
                            <>
                                <span>
                                    {this.getTestCasesWithDescription(tests)}
                                </span>
                                <br></br>
                            </>
                        ) : (
                            <>
                                <span>• None</span>
                                <br></br>
                            </>
                        )}
                    </span>
                </div>

                {this.state.suggestionResponse[requirementId] != null ? (
                    <div className="output-col5">
                        <span className="output-row-text">
                            <span>
                                {this.state.suggestionResponse[requirementId]}
                            </span>
                            <br></br>
                        </span>
                    </div>
                ) : this.state.isLoading[requirementId] != null ? (
                    <div className="output-col5-ring">
                        <div className="output-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                ) : (
                    <div className="output-col5">
                        <button
                            className="example-yes-button"
                            onClick={() => {
                                this.sendTestSuggestionPrompt(requirementId);
                            }}
                        >
                            <span className="example-yes-button-text">
                                <span>Yes</span>
                                <br></br>
                            </span>
                        </button>
                    </div>
                )}
            </>
        );
    }

    render() {
        return (
            <div className="output-container">
                <div className="output-header">
                    <div className="output-col1">
                        <span className="output-header-text">
                            <span>Req. ID</span>
                            <br></br>
                        </span>
                    </div>
                    <div className="output-col2">
                        <span className="output-header-text">
                            <span>Description</span>
                            <br></br>
                        </span>
                    </div>
                    <div className="output-col3">
                        <span className="output-header-text">
                            <span>Tested</span>
                            <br></br>
                        </span>
                    </div>
                    <div className="output-col4">
                        <span className="output-header-text">
                            <span>Tested by </span>
                            <br></br>
                        </span>
                    </div>
                    <div className="output-col5">
                        <span className="output-header-text">
                            <span>
                                Do you want testing suggestions for the
                                requirement?
                            </span>
                            <br></br>
                        </span>
                    </div>
                </div>
                <div className="output-content">{this.renderResultRows()}</div>
            </div>
        );
    }
}

Output.propTypes = {};

export default Output;
