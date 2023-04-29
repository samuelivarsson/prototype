import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./style.css";
import Home from "./components/home/Home";

const App = () => {
    return (
        <Router>
            <div>
                <Route component={Home} exact path="/" />
            </div>
        </Router>
    );
};

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
