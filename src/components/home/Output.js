import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Output.css";
import { testSuggestionPrompt } from "./Prompt";
import { Configuration, OpenAIApi } from "openai";
import { mergeObjectsWithSameId } from "./ResponseParser";

class Output extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestionResponse: {},
            isLoading: {},
        };
        this.renderResultRows = this.renderResultRows.bind(this);
        this.renderResultRow = this.renderResultRow.bind(this);
        this.getRequirementDescription = this.getRequirementDescription.bind(this);
        this.getTestDescription = this.getTestDescription.bind(this);
        this.getTestCasesWithDescription = this.getTestCasesWithDescription.bind(this);
        this.sendTestSuggestionPrompt = this.sendTestSuggestionPrompt.bind(this);
    }

    getRequirementDescription(requirementId) {
        const requirementObjects = this.props.requirementObjects;
        for (const requirementObject of requirementObjects) {
            if (requirementObject.requirementID == requirementId) {
                return requirementObject.desc;
            }
        }
        return "";
    }

    getTestDescription(testId) {
        const testObjects = this.props.testObjects;
        for (const testObject of testObjects) {
            if (testObject.ID == testId) {
                return testObject.desc;
            }
        }
        return "";
    }

    getTestCasesWithDescription(testsString) {
        const testsArray = testsString.split(", ");
        var result = "";

        for (let i = 0; i < testsArray.length; i++) {
            const newLine = i == testsArray.length - 1 ? "" : "\n\n";
            const testId = testsArray[i];
            const description = this.getTestDescription(testId);
            result += testId + " - " + description + newLine;
        }

        return result;
    }

    renderResultRows() {
        if (!this.props) {
            console.log("Props is null in Output.js!");
            return;
        }

        console.log(this.props.requirementsWithTests);
        var mergedArr = mergeObjectsWithSameId([...this.props.requirementsWithTests]);
        console.log(mergedArr);
        return mergedArr.map((result) => {
            return (
                <div key={result.requirementID} className="output-row">
                    {this.renderResultRow(result.requirementID, result.tests)}
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

        const user_input = testSuggestionPrompt(this.getRequirementDescription(requirementId));
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
                        <span>{this.getRequirementDescription(requirementId)}</span>
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
                                <span>{this.getTestCasesWithDescription(tests)}</span>
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
                            <span>{this.state.suggestionResponse[requirementId]}</span>
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
                            <span>Do you want testing suggestions for the requirement?</span>
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
