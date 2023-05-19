export function requirementPrompt(file_content) {
    return (
        'I am about to give you the string representation of the contents of a file. The file contains a requirement. The headers of the file may suggest that the data in the file is not a requirement, but I want you to think of it as requirement anyways, and that is VERY important. The file is in csv format. The file is called "requirements.csv".' +
        "\n\n" +
        "What I want you to do is to find the ID of the requirement. The ID can be a name or a key of some sort. I also want you to find the description of the requirement. I also want you to find any other useful information about the requirement." +
        "\n\n" +
        "Now I am going to give you the contents of the file and the only thing I want you to answer is in the following form:" +
        "\n\n" +
        '{"requirementID": "[insert id here]", "desc": "[insert description here]", "other": "[insert other information here]"}' +
        "\n\n" +
        'The contents of "requirements.csv" are:' +
        "\n\n" +
        file_content +
        "\n\nI am going to parse your input in my javascript program, therefore, ONLY ANSWER IN THE FORM I GAVE YOU AND CHANGE \" TO ' IF IT IS INSIDE QUTATION MARKS."
    );
}

export function testPrompt(file_content) {
    return (
        'I am about to give you the string representation of the contents of a file. The file contains a requirement. The headers of the file may suggest that the data in the file is not test cases, but I want you to think of them as test cases anyways, and that is VERY important. The file is in csv format. The file is called "test.csv".' +
        "\n\n" +
        'What I want you to do is to find the ID of the test case. The ID can be a name or a key of some sort. I also want you to find the description of the test case. I also want you to find the steps of the test case, if there are any. If there is no information about steps in the test case, just think "No test steps provided". I also want you to find the expected outcome of the test case, if there is any.' +
        "\n\n" +
        "Now I am going to give you the contents of the file and the only thing I want you to answer is in the following form:" +
        "\n\n" +
        '{"ID": "[insert id here]", "desc": "[insert description here]", "steps": "[insert steps here]", "expected_outcome": "[insert expected outcome here]"}' +
        "\n\n" +
        'The contents of "test_case.csv" are:' +
        "\n\n" +
        file_content +
        "\n\n" +
        "I am going to parse your input in my javascript program, therefore, ONLY ANSWER IN THE FORM I GAVE YOU AND CHANGE \" TO ' IF IT IS INSIDE QUTATION MARKS."
    );
}

export function getTestCasesString(test_cases) {
    var res = "";
    for (let i = 0; i < test_cases.length; i++) {
        const objString = JSON.stringify(test_cases[i]);
        if (i == test_cases.length - 1) {
            res += objString;
            break;
        }
        res += objString + "\n\n";
    }
    return res;
}

export function requirementIsTestedPrompt(test_cases, requirement) {
    return (
        "I have this requirement:" +
        "\n\n" +
        requirement +
        "\n\n" +
        'Would you say that any of the test cases in the file "tests.csv" are testing the requirement? If yes, answer ONLY with the test case ID(s) that are testing the requirement in the following form:' +
        "\n\n" +
        '{"requirementID": "[insert requirement id]", "tests": "[insert test id 1], [insert test id 2], [insert test id 3], ..."}' +
        "\n\n" +
        "DO NOT ADD ANY TEXT BEFORE OR AFTER THE CURLY BRACKETS. If no, answer ONLY in the following form:" +
        "\n\n" +
        '{"requirementID": "[insert requirement id]", "tests": ""}' +
        "\n\n" +
        'The contents of "tests.csv" are:' +
        "\n\n" +
        getTestCasesString(test_cases) +
        "\n\n" +
        "I am going to parse your input in my javascript program, therefore, ONLY ANSWER IN THE FORM I GAVE YOU."
    );
}

export function testSuggestionPrompt(requirement) {
    return (
        "I have this requirement:" +
        "\n\n" +
        requirement +
        "\n\n" +
        "Give me a plan of how to test this requirement. Answer ONLY in the following form adn DO NOT add any text before or after the form:" +
        "\n\n" +
        "-Step 1: [insert description for step 1]\n-Step2: [insert description for step 2]\n..."
    );
}
