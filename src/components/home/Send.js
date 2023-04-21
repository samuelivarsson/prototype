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
        };
        this.handleSendClick = this.handleSendClick.bind(this);
        this.sendBatch = this.sendBatch.bind(this);
        this.sendFirstBatch = this.sendFirstBatch.bind(this);
        this.sendSecondBatch = this.sendSecondBatch.bind(this);
        this.sendTestPrompt = this.sendTestPrompt.bind(this);
        this.sendRequirementPrompt = this.sendRequirementPrompt.bind(this);
        this.findRequirementId = this.findRequirementId.bind(this);
        this.findRequirementTests = this.findRequirementTests.bind(this);
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
            console.error("requirementsArray is null!");
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
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: 0,
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
            console.error("testArray is null!");
            return;
        }

        const messages = [];
        const user_input = testPrompt(
            this.props.testArray[0] + "\n" + this.props.testArray[index]
        );
        messages.push({ role: "user", content: user_input });

        try {
            return openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: 0,
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

    sendRequirementIsTestedPrompt(index) {
        const configuration = new Configuration({
            organization: "org-Bc7ZnCV6EeMA8vHscXbIqeA5",
            apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        if (!this.props.testArray) {
            console.error("testArray is null!");
            return;
        }

        const messages = [];
        const user_input = requirementIsTestedPrompt(
            this.state.testObjects,
            this.state.requirementObjects[index]
        );
        messages.push({ role: "user", content: user_input });

        try {
            return openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
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

    async sendBatch(batch) {
        try {
            console.log("-- sending batch --");
            return await Promise.all(batch.map((f) => f()));
        } catch (err) {
            console.error(err);
        }
    }

    async sendFirstBatch() {
        const batch = [];
        for (let i = 1; i < this.props.requirementsArray.length; i++) {
            batch.push(() => {
                return this.sendRequirementPrompt(i);
            });
        }
        for (let i = 1; i < this.props.testArray.length; i++) {
            batch.push(() => {
                return this.sendTestPrompt(i);
            });
        }
        const completions = await this.sendBatch(batch);
        for (let i = 0; i < completions.length; i++) {
            const completion_text =
                completions[i].data.choices[0].message.content;
            if (completion_text.startsWith('{"ID"')) {
                this.setState((prevState) => ({
                    testObjects: [...prevState.testObjects, completion_text],
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

    findTextInCompletion(completion_text, text_to_find) {
        const firstSplit = completion_text.split(
            '"' + text_to_find + '": "'
        )[1];
        if (firstSplit == null) {
            console.log(completion_text);
            console.log(text_to_find);
            console.error("Could not create first split!");
            return;
        }
        console.log(firstSplit.split('"'));
        const secondSplit = firstSplit.split('"')[0];
        if (secondSplit == null) {
            console.log(completion_text);
            console.log(text_to_find);
            console.error("Could not create second split!");
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
        const batch = [];
        for (let i = 0; i < this.state.requirementObjects.length; i++) {
            batch.push(() => {
                return this.sendRequirementIsTestedPrompt(i);
            });
        }
        const completions = await this.sendBatch(batch);
        for (let i = 0; i < completions.length; i++) {
            const completion_text =
                completions[i].data.choices[0].message.content;
            const requirementID = this.findRequirementId(completion_text);
            const requirementTests = this.findRequirementTests(completion_text);
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

    async handleSendClick() {
        if (!this.props.requirementsArray) {
            console.error("Requirements array is null!");
            return;
        }
        if (!this.props.testArray) {
            console.error("Test array is null!");
            return;
        }
        // This is a mock request function, could be a `request` call
        // or a database query; whatever it is, it MUST return a Promise.

        await this.sendFirstBatch();
        await this.sendSecondBatch();
        console.log(this.state);
        console.log(this.state.requirementsWithTests);
    }

    render() {
        return (
            <button
                className="home-button3 button"
                onClick={this.handleSendClick}
            >
                <span className="home-text10">
                    <span>Run Analysis</span>
                    <br></br>
                </span>
            </button>
        );
    }
}

Send.propTypes = {
    prompt: PropTypes.string,
};

export default Send;
