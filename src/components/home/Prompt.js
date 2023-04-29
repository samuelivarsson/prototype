export function testPrompt(file_content) {
    return (
        'I am about to give you the string representation of the contents of a file. The file contains a requirement. The headers of the file may suggest that the data in the file is not test cases, but I want you to think of them as test cases anyways, and that is VERY important. The file is in csv format. The file is called "test.csv".\n\nWhat I want you to do is to find the ID of the test case. The ID can be a name or a key of some sort. I also want you to find the description of the test case. I also want you to find the steps of the test case, if there are any. If there is no information about steps in the test case, just think “No test steps provided”.\n\nNow I am going to give you the contents of the file and the only thing I want you to answer is is in the following form:\n\n{"ID": "[insert id here]", "desc": "[insert description here]", "steps": "[insert steps here]"}\n\nThe contents of "test_case.csv" are:\n\n' +
        file_content
    );
}

export function requirementPrompt(file_content) {
    return (
        'I am about to give you the string representation of the contents of a file. The file contains a requirement. The headers of the file may suggest that the data in the file is not requirements, but I want you to think of them as requirement anyways, and that is VERY important. The file is in csv format. The file is called "requirements.csv".\n\nWhat I want you to do is to find the ID of the requirement. The ID can be a name or a key of some sort. I also want you to find the description of the requirement.\n\nNow I am going to give you the contents of the file and the only thing I want you to answer is is in the following form:\n\n{"requirementID": "[insert id here]", "desc": "[insert description here]"}\n\nThe contents of "requirements.csv" are:\n\n' +
        file_content
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
        "Consider these test cases:\n\n" +
        getTestCasesString(test_cases) +
        "\n\nI have this requirement:\n\n" +
        requirement +
        '\n\nBased on the description of the requirement, would you say that any of these test cases are testing the requirement? If yes, answer ONLY with the test case ID(s) that are testing the requirement in the following form:\n\n{"requirementID": "[insert requirement id]", "tests": "[insert test id 1], [insert test id 2], [insert test id 3], ..."}\n\nDO NOT ADD ANY TEXT BEFORE OR AFTER THE CURLY BRACKETS. If no, answer ONLY in the following form:\n\n{"requirementID": "[insert requirement id]", "tests": ""}\n\nI am going to parse your input in my javascript program, therefore, ONLY ANSWER IN THE FORM I GAVE YOU.'
    );
}

export function testSuggestionPrompt(requirement) {
    return (
        "I have this requirement:\n\n" +
        requirement +
        "\n\nGive me a plan of how to test this requirement. Answer ONLY in the following form adn DO NOT add any text before or after the form:\n\n-Step 1: [insert description for step 1]\n-Step2: [insert description for step 2]\n..."
    );
}
