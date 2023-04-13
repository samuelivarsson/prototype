import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Home.css";

class Output extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // componentWillMount() {}

    componentDidMount() {}

    // componentWillReceiveProps(nextProps) {}

    // shouldComponentUpdate(nextProps, nextState) {}

    // componentWillUpdate(nextProps, nextState) {}

    // componentDidUpdate(prevProps, prevState) {}

    // componentWillUnmount() {}

    render() {
        return <div className="home-label">{this.props.output}</div>;
    }
}

Output.propTypes = {};

export default Output;
