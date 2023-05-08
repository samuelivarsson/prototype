import React, { Component } from "react";
import PropTypes from "prop-types";
import { Configuration, OpenAIApi } from "openai";
import "./Home.css";
import { testPrompt, requirementPrompt, requirementIsTestedPrompt } from "./Prompt";
import { parseStringToObject } from "./ResponseParser";

class Send extends Component {
    constructor(props) {
        super(props);
        this.state = {
            awaitingResponse: false,
        };
        this.batch_size = 10;
        this.testCasesPerRequirement = 20;
        this.currTokens = 0;
        this.currSecond = 0;
        this.totalTokens = 0;
        this.handleSendClick = this.handleSendClick.bind(this);
        this.sendBatch = this.sendBatch.bind(this);
        this.calculateNumOfBatches = this.calculateNumOfBatches.bind(this);
        this.createFirstBatches = this.createFirstBatches.bind(this);
        this.sendFirstBatches = this.sendFirstBatches.bind(this);
        this.createSecondBatches = this.createSecondBatches.bind(this);
        this.sendSecondBatches = this.sendSecondBatches.bind(this);
        this.sendTestPrompt = this.sendTestPrompt.bind(this);
        this.sendRequirementPrompt = this.sendRequirementPrompt.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.setRequirementObjects = this.setRequirementObjects.bind(this);
        this.setTestObjects = this.setTestObjects.bind(this);
        this.incrementSecond = this.incrementSecond.bind(this);
    }

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
            this.props.requirementsArray[0] + "\n" + this.props.requirementsArray[index]
        );
        messages.push({ role: "user", content: user_input });
        // console.log(user_input);

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
        const user_input = testPrompt(this.props.testArray[0] + "\n" + this.props.testArray[index]);
        messages.push({ role: "user", content: user_input });
        // console.log(user_input);

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
            this.props.testObjects.slice(index2, index2 + this.testCasesPerRequirement),
            JSON.stringify(this.props.requirementObjects[index])
        );
        messages.push({ role: "user", content: user_input });
        // console.log(user_input);

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

    sleep(seconds) {
        const ms = seconds * 1000;
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async sendBatch(batch, retry) {
        try {
            if (this.currTokens > 60000) {
                // const secondsToWait = 60 - this.currSecond;
                const secondsToWait = 60;
                console.log("Waiting for " + secondsToWait + " seconds.");
                await this.sleep(secondsToWait);
                console.log("Resetting currSecond and currTokens...");
                this.currSecond = 0;
                this.totalTokens += this.currTokens;
                this.currTokens = 0;
            }
            console.log("-- sending batch of size " + batch.length + " --");
            return await Promise.all(batch.map((f) => f()));
        } catch (err) {
            console.error(err);
            if (err.response) {
                if (err.response.status == 429 && retry < 10) {
                    console.log(retry + " Retrying...");
                    return await this.sendBatch(batch, retry + 1);
                }
            }
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
        this.props.increaseAnalysisProgress((batch_size / this.calculateNumOfBatches()) * 100);
    }

    createFirstBatches() {
        var batches = [];
        var batch = [];

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

        for (let i = 0; i < batch.length; i += this.batch_size) {
            const smaller_batch = batch.slice(i, i + this.batch_size);
            batches.push(smaller_batch);
        }

        return batches;
    }

    async sendFirstBatches() {
        const batches = this.createFirstBatches();

        if (batches.length < 1) {
            console.log("batches was empty!");
            return;
        }

        for (const curr_batch of batches) {
            if (curr_batch.length < 1) {
                console.log("curr_batch was empty!");
                continue;
            }

            const completions = await this.sendBatch(curr_batch, 0);

            this.increaseProgress(curr_batch.length);

            if (completions == null) {
                const errorLabel = "No completions were fetched!";
                console.error(errorLabel);
                this.props.setErrorLabel(errorLabel);
                return;
            }

            var tokens = 0;
            for (let i = 0; i < completions.length; i++) {
                tokens += completions[i].data.usage.total_tokens;
                const completion_text = completions[i].data.choices[0].message.content;
                console.log("\nTokens for " + completion_text);
                console.log(completions[i].data.usage);
                console.log("\n");
                // console.log(completion_text);

                try {
                    const obj = parseStringToObject(completion_text);
                    if (obj.ID != null) {
                        this.props.addTestObject(obj);
                    } else {
                        this.props.addRequirementObject(obj);
                    }
                } catch (err) {
                    console.log(completion_text);
                    console.error(err);
                    this.props.setErrorLabel(err);
                }
            }
            this.currTokens += tokens;
            console.log("tokens for this batch: " + tokens);
            console.log("currTokens: " + this.currTokens);
        }
    }

    createSecondBatches() {
        var batches = [];
        var batch = [];

        for (let i = 0; i < this.props.requirementObjects.length; i++) {
            for (let j = 0; j < this.props.testObjects.length; j += this.testCasesPerRequirement) {
                batch.push(() => {
                    return this.sendRequirementIsTestedPrompt(i, j);
                });
            }
        }

        for (let i = 0; i < batch.length; i += this.batch_size) {
            const smaller_batch = batch.slice(i, i + this.batch_size);
            batches.push(smaller_batch);
        }

        return batches;
    }

    async sendSecondBatches() {
        const batches = this.createSecondBatches();

        if (batches.length < 1) {
            console.log("Batches was empty!");
            return;
        }

        for (const curr_batch of batches) {
            if (curr_batch.length < 1) {
                console.log("curr_batch was empty!");
                continue;
            }

            const completions = await this.sendBatch(curr_batch, 0);

            this.increaseProgress(curr_batch.length);

            var tokens = 0;
            for (let i = 0; i < completions.length; i++) {
                tokens += completions[i].data.usage.total_tokens;
                const completion_text = completions[i].data.choices[0].message.content;
                console.log("\nTokens for " + completion_text);
                console.log(completions[i].data.usage);
                console.log("\n");
                // console.log(completion_text);

                try {
                    const obj = parseStringToObject(completion_text);
                    this.props.addRequirementWithTests(obj);
                } catch (err) {
                    console.error(err);
                    this.props.setErrorLabel(err);
                }
            }
            this.currTokens += tokens;
            console.log("tokens for this batch: " + tokens);
            console.log("currTokens: " + this.currTokens);
        }
    }

    incrementSecond() {
        this.currSecond += 1;
    }

    async handleSendClick() {
        console.time("analysisTime");
        setInterval(this.incrementSecond, 1000);

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
        this.props.setIsFinished(false);
        this.renderLoading(true);
        this.props.setRequirementsWithTests([]);
        this.props.setRequirementObjects([]);
        this.props.setTestObjects([]);
        this.setState({
            awaitingResponse: true,
        });

        await this.sendFirstBatches();

        await this.sendSecondBatches();
        this.props.setIsFinished(true);
        this.setState({
            awaitingResponse: false,
        });
        console.timeEnd("analysisTime");

        this.totalTokens += this.currTokens;
        console.log("Total tokens used: " + this.totalTokens);
    }

    renderLoading(bool) {
        this.props.setLoadingFlag(bool);
    }

    setRequirementObjects() {
        this.props.setRequirementObjects(this.state.requirementObjects);
    }

    setTestObjects() {
        this.props.setTestObjects(this.state.testObjects);
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
                    <button className="home-button3 button" onClick={this.handleSendClick}>
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
