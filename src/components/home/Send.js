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
        };
        this.handleSendClick = this.handleSendClick.bind(this);
        this.sendBatch = this.sendBatch.bind(this);
    }

    // componentWillMount() {}

    componentDidMount() {
        if (!this.props) {
            console.log("props is null");
            return;
        }

        //this.setState({});
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("Props updated");
        //console.log(this.props);
    }

    // componentWillReceiveProps(nextProps) {}

    // shouldComponentUpdate(nextProps, nextState) {}

    // componentWillUpdate(nextProps, nextState) {}

    //

    // componentWillUnmount() {}

    setUpConfig() {}

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
        const sendRequirementPrompt = (index) => {
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
        };

        const sendTestPrompt = (index) => {
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
        };

        const batch = [];
        for (let i = 1; i < this.props.requirementsArray.length; i++) {
            batch.push(function () {
                return sendRequirementPrompt(i);
            });
        }
        for (let i = 1; i < this.props.testArray.length; i++) {
            batch.push(function () {
                return sendTestPrompt(i);
            });
        }

        await this.sendBatch(batch);

        //for (let i = 1; i < this.props.requirementsArray.length; i++) {
        //    batch.push(() => {
        //        sendRequirementPrompt(i);
        //    });
        //}
    }

    async sendBatch(batch) {
        try {
            console.log("-- sending batch --");
            const completions = await Promise.all(batch.map((f) => f()));
            for (let i = 0; i < completions.length; i++) {
                const completion_text =
                    completions[i].data.choices[0].message.content;
                if (completion_text.startsWith('{"ID"')) {
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
            console.log(this.state.requirementObjects);
            console.log(this.state.testObjects);
            console.log("DONE!!!!!!!!!!");
        } catch (err) {
            console.error(err);
        }
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
