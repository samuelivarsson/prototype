import React, { Component } from "react";
import PropTypes from "prop-types";
import { Configuration, OpenAIApi } from "openai";
import "./Home.css";
// import readlineSync from "readline-sync";

class Send extends Component {
    constructor(props) {
        super(props);
        this.state = { configuration: null, openai: null, response: null };
        this.handleSendClick = this.handleSendClick.bind(this);
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
        console.log(this.props);
    }

    // componentWillReceiveProps(nextProps) {}

    // shouldComponentUpdate(nextProps, nextState) {}

    // componentWillUpdate(nextProps, nextState) {}

    //

    // componentWillUnmount() {}

    setUpConfig() {}

    async handleSendClick() {
        const configuration = new Configuration({
            organization: "org-Bc7ZnCV6EeMA8vHscXbIqeA5",
            apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        });
        // this.setState({
        //     configuration: configuration,
        //     openai: openai,
        //     response: response,
        // });
        const openai = new OpenAIApi(configuration);

        const history = [];

        // while (true) {
        // const user_input = readlineSync.question("Your input: ");
        if (!this.props.prompt) {
            console.error("Prompt is null!");
            return;
        }
        const user_input = this.props.prompt;

        const messages = [];
        for (const [input_text, completion_text] of history) {
            messages.push({ role: "user", content: input_text });
            messages.push({ role: "assistant", content: completion_text });
        }

        messages.push({ role: "user", content: user_input });

        try {
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
            });

            const completion_text = completion.data.choices[0].message.content;
            console.log(completion_text);

            history.push([user_input, completion_text]);

            // const user_input_again = readlineSync.question(
            //     "\nWould you like to continue the conversation? (Y/N)"
            // );
            // if (user_input_again.toUpperCase() === "N") {
            //     return;
            // } else if (user_input_again.toUpperCase() !== "Y") {
            //     console.log("Invalid input. Please enter 'Y' or 'N'.");
            //     return;
            // }
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
        }
        // }
    }

    render() {
        return (
            <button className="home-button3 button">
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
