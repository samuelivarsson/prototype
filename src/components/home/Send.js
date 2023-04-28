import React, { Component } from "react";
import PropTypes from "prop-types";
import { Configuration, OpenAIApi } from "openai";
import "./Home.css";
import {
    testPrompt,
    requirementPrompt,
    requirementIsTestedPrompt,
} from "./Prompt";
// import readlineSync from "readline-sync";

class Send extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testObjects: [],
            requirementObjects: [],
            requirementsWithTests: [],
            awaitingResponse: false,
        };
        this.batch_size = 5;
        this.testCasesPerRequirement = 3;
        this.handleSendClick = this.handleSendClick.bind(this);
        this.sendBatch = this.sendBatch.bind(this);
        this.calculateNumOfBatches = this.calculateNumOfBatches.bind(this);
        this.sendFirstBatch = this.sendFirstBatch.bind(this);
        this.sendSecondBatch = this.sendSecondBatch.bind(this);
        this.sendTestPrompt = this.sendTestPrompt.bind(this);
        this.sendRequirementPrompt = this.sendRequirementPrompt.bind(this);
        this.findRequirementId = this.findRequirementId.bind(this);
        this.findRequirementTests = this.findRequirementTests.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.setReqAndTestObjects = this.setReqAndTestObjects.bind(this);
    }

    // componentWillMount() {}

    componentDidMount() {
        if (!this.props) {
            console.log("props is null");
            return;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log("Props updated");
    }

    sendRequirementPrompt(index) {
        const configuration = new Configuration({
            organization: "org-Bc7ZnCV6EeMA8vHscXbIqeA5",
            apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        if (!this.props.requirementsArray) {
            const errorLabel = "requirementsArray is null!";
            console.error(errorLabel);
            this.props.setErrorLabel(errorLabel);
            return;
        }

        const messages = [];
        const user_input = requirementPrompt(
            this.props.requirementsArray[0] +
                "\n" +
                this.props.requirementsArray[index]
        );
        messages.push({ role: "user", content: user_input });

        try {
            return openai.createChatCompletion({
                model: "gpt-3.5-turbo-0301",
                messages: messages,
                temperature: 0.7,
            });
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
        }
    }

    sendTestPrompt(index) {
        const configuration = new Configuration({
            organization: "org-Bc7ZnCV6EeMA8vHscXbIqeA5",
            apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        if (!this.props.testArray) {
            const errorLabel = "testArray is null!";
            console.error(errorLabel);
            this.props.setErrorLabel(errorLabel);
            return;
        }

        const messages = [];
        const user_input = testPrompt(
            this.props.testArray[0] + "\n" + this.props.testArray[index]
        );
        messages.push({ role: "user", content: user_input });

        try {
            return openai.createChatCompletion({
                model: "gpt-3.5-turbo-0301",
                messages: messages,
                temperature: 0.7,
            });
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
        }
    }

    sendRequirementIsTestedPrompt(index, index2) {
        const configuration = new Configuration({
            organization: "org-Bc7ZnCV6EeMA8vHscXbIqeA5",
            apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        if (!this.props.testArray) {
            const errorLabel = "testArray is null!";
            console.error(errorLabel);
            this.props.setErrorLabel(errorLabel);
            return;
        }

        const messages = [];
        const user_input = requirementIsTestedPrompt(
            this.state.testObjects.slice(
                index2,
                index2 + this.testCasesPerRequirement
            ),
            this.state.requirementObjects[index]
        );
        messages.push({ role: "user", content: user_input });

        try {
            return openai.createChatCompletion({
                model: "gpt-3.5-turbo-0301",
                messages: messages,
                temperature: 0.7,
            });
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                this.props.setErrorLabel(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
                this.props.setErrorLabel(error.message);
            }
        }
    }

    async sendBatch(batch) {
        try {
            console.log("-- sending batch --");
            console.log(batch.length);
            return await Promise.all(batch.map((f) => f()));
        } catch (err) {
            console.error(err);
            this.props.setErrorLabel(err);
        }
    }

    calculateNumOfBatches() {
        const numRequirements = this.props.requirementsArray.length - 1;
        const numTestCases = this.props.testArray.length - 1;
        const numTestCaseBatches =
            numTestCases % this.testCasesPerRequirement == 0
                ? numTestCases / this.testCasesPerRequirement
                : Math.floor(numTestCases / this.testCasesPerRequirement) + 1;
        const numReqIsTestedPrompts = numRequirements * numTestCaseBatches;
        return numRequirements + numTestCases + numReqIsTestedPrompts;
    }

    increaseProgress(batch_size) {
        this.props.increaseAnalysisProgress(
            (batch_size / this.calculateNumOfBatches()) * 100
        );
    }

    async sendFirstBatch() {
        const batches = [];
        var batch = [];

        var a = 0;
        for (let i = 1; i < this.props.requirementsArray.length; i++) {
            if (a == this.batch_size) {
                batches.push(batch);
                batch = [];
                a = 0;
            }
            batch.push(() => {
                return this.sendRequirementPrompt(i);
            });
            a++;
        }
        batches.push(batch);
        batch = [];

        a = 0;
        for (let i = 1; i < this.props.testArray.length; i++) {
            if (a == this.batch_size) {
                batches.push(batch);
                batch = [];
                a = 0;
            }
            batch.push(() => {
                return this.sendTestPrompt(i);
            });
            a++;
        }
        batches.push(batch);

        for (const curr_batch of batches) {
            const completions = await this.sendBatch(curr_batch);
            this.increaseProgress(curr_batch.length);
            if (completions == null) {
                const errorLabel = "No completions were fetched!";
                console.error(errorLabel);
                this.props.setErrorLabel(errorLabel);
                return;
            }
            for (let i = 0; i < completions.length; i++) {
                const completion_text =
                    completions[i].data.choices[0].message.content;
                if (completion_text.includes('"ID": "')) {
                    this.setState((prevState) => ({
                        testObjects: [
                            ...prevState.testObjects,
                            completion_text,
                        ],
                    }));
                } else {
                    this.setState((prevState) => ({
                        requirementObjects: [
                            ...prevState.requirementObjects,
                            completion_text,
                        ],
                    }));
                }
            }
        }
    }

    findTextInCompletion(completion_text, text_to_find) {
        const firstSplit = completion_text.split(
            '"' + text_to_find + '": "'
        )[1];
        if (firstSplit == null) {
            console.log(completion_text);
            console.log(text_to_find);
            const errorLabel = "Could not create first split!";
            console.error(errorLabel);
            this.props.setErrorLabel(errorLabel);
            return;
        }
        const secondSplit = firstSplit.split('"')[0];
        if (secondSplit == null) {
            console.log(completion_text);
            console.log(text_to_find);
            const errorLabel = "Could not create second split!";
            console.error(errorLabel);
            this.props.setErrorLabel(errorLabel);
            return;
        }
        return secondSplit;
    }

    findRequirementId(completion_text) {
        return this.findTextInCompletion(completion_text, "requirementID");
    }

    findRequirementTests(completion_text) {
        return this.findTextInCompletion(completion_text, "tests");
    }

    async sendSecondBatch() {
        const batches = [];
        var batch = [];

        var a = 0;
        for (let i = 0; i < this.state.requirementObjects.length; i++) {
            if (a == this.batch_size) {
                batches.push(batch);
                batch = [];
                a = 0;
            }

            for (
                let j = 0;
                j < this.state.testObjects.length;
                j += this.testCasesPerRequirement
            ) {
                if (a == this.batch_size) {
                    batches.push(batch);
                    batch = [];
                    a = 0;
                }
                batch.push(() => {
                    return this.sendRequirementIsTestedPrompt(i, j);
                });
                a++;
            }
        }
        batches.push(batch);
        console.log(batches);

        for (const curr_batch of batches) {
            const completions = await this.sendBatch(curr_batch);
            this.increaseProgress(curr_batch.length);
            for (let i = 0; i < completions.length; i++) {
                const completion_text =
                    completions[i].data.choices[0].message.content;
                const requirementID = this.findRequirementId(completion_text);
                const requirementTests =
                    this.findRequirementTests(completion_text);
                this.setState((prevState) => ({
                    requirementsWithTests: [
                        ...prevState.requirementsWithTests,
                        {
                            ID: requirementID,
                            tests: requirementTests,
                        },
                    ],
                }));
            }
        }
    }

    async handleSendClick() {
        if (this.state.awaitingResponse) {
            console.log("You are already analyzing!");
            return;
        }
        if (!this.props.requirementsArray) {
            const errorLabel = "requirementsArray is null!";
            console.error(errorLabel);
            this.props.setErrorLabel(errorLabel);
            return;
        }
        if (!this.props.testArray) {
            const errorLabel = "testArray is null!";
            console.error(errorLabel);
            this.props.setErrorLabel(errorLabel);
            return;
        }

        if (this.props.requirementsArray.length == 0) {
            console.log("You have not loaded a requirement file!");
            return;
        }
        if (this.props.testArray.length == 0) {
            console.log("You have not loaded a test file!");
            return;
        }

        this.props.resetAnalysisProgress();
        this.renderLoading(true);
        this.props.setResultArray([]);
        this.setState({
            awaitingResponse: true,
        });
        // This is a mock request function, could be a `request` call
        // or a database query; whatever it is, it MUST return a Promise.

        await this.sendFirstBatch();

        this.setReqAndTestObjects(
            this.state.requirementObjects,
            this.state.testObjects
        );

        await this.sendSecondBatch();
        console.log(this.state);
        console.log(this.state.requirementsWithTests);
        this.props.setResultArray(this.state.requirementsWithTests);
        this.setState({
            awaitingResponse: false,
        });
    }

    renderLoading(bool) {
        this.props.setLoadingFlag(bool);
    }

    setReqAndTestObjects(requirementObjects, testObjects) {
        this.props.setReqAndTestObjects(requirementObjects, testObjects);
    }

    render() {
        return (
            <>
                {this.state.awaitingResponse ? (
                    <button
                        className="home-button3 button"
                        onClick={this.handleSendClick}
                        disabled={true}
                    >
                        <span className="home-text10">
                            <span>Run Analysis</span>
                            <br></br>
                        </span>
                    </button>
                ) : (
                    <button
                        className="home-button3 button"
                        onClick={this.handleSendClick}
                    >
                        <span className="home-text10">
                            <span>Run Analysis</span>
                            <br></br>
                        </span>
                    </button>
                )}
            </>
        );
    }
}

Send.propTypes = {
    prompt: PropTypes.string,
};

export default Send;
