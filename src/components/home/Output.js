import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Output.css";

class Output extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.renderResultRows = this.renderResultRows.bind(this);
        this.renderResultRow = this.renderResultRow.bind(this);
    }

    // componentWillMount() {}

    componentDidMount() {}

    // componentWillReceiveProps(nextProps) {}

    // shouldComponentUpdate(nextProps, nextState) {}

    // componentWillUpdate(nextProps, nextState) {}

    // componentDidUpdate(prevProps, prevState) {}

    // componentWillUnmount() {}

    renderResultRows() {
        if (!this.props) {
            console.log("Props is null in Output.js!");
            return;
        }
        const resultArray = this.props.resultArray;
        return resultArray.map((result) => {
            return (
                <div key={result.ID} className="output-row">
                    {this.renderResultRow(result.ID, result.tests)}
                </div>
            );

            // <RenderResultRow
            //     key={result.ID}
            //     requirementId={result.ID}
            //     tests={result.tests}
            // />
        });
    }

    renderResultRow(requirementId, tests) {
        return (
            <>
                <div className="output-container2">
                    <span className="output-text12">
                        <span>{"• " + requirementId}</span>
                        <br></br>
                    </span>
                </div>
                {tests.length > 0 ? (
                    <div className="output-container3">
                        <span className="output-text15">Yes</span>
                        <svg viewBox="0 0 1024 1024" className="output-check">
                            <path d="M864 128l-480 480-224-224-160 160 384 384 640-640z"></path>
                        </svg>
                    </div>
                ) : (
                    <div className="output-container3">
                        <span className="output-text15">No</span>
                        <svg viewBox="0 0 1024 1024" className="output-cross">
                            <path d="M864 128l-480 480-224-224-160 160 384 384 640-640z"></path>
                        </svg>
                    </div>
                )}
                <div className="output-container4">
                    <span className="output-text16">
                        {tests.length > 0 ? (
                            <>
                                <span>{"• " + tests}</span>
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
            </>
        );
    }

    render() {
        return (
            <div className="output-container">
                <div className="output-header">
                    <span className="output-text03">
                        <span>Requirement ID</span>
                        <br></br>
                    </span>
                    <span className="output-text06">
                        <span>Tested</span>
                        <br></br>
                    </span>
                    <span className="output-text09">
                        <span>Tested by </span>
                        <br></br>
                    </span>
                </div>
                <div className="output-content">{this.renderResultRows()}</div>
            </div>
        );
    }
}

Output.propTypes = {};

export default Output;
