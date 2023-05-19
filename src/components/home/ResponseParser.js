export function parseStringToObject(completion_text) {
    const obj = JSON.parse(completion_text);
    return obj;
}

export function isNoTests(tests) {
    return (
        tests.length == 0 ||
        (tests.length == 4 && tests.toLowerCase().includes("none")) ||
        (tests.length == 2 && tests.toLowerCase().includes("no")) ||
        (tests.length == 3 && tests.toLowerCase().includes("n/a")) ||
        (tests.length == 1 && tests.toLowerCase().includes(" "))
    );
}

export function mergeObjectsWithSameId(objects) {
    var arr = [...objects];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].requirementID === arr[j].requirementID) {
                if (isNoTests(arr[i].tests)) {
                    if (isNoTests(arr[j].tests)) {
                        arr[i].tests = "";
                    } else {
                        arr[i].tests = arr[j].tests;
                    }
                } else if (!isNoTests(arr[j].tests)) {
                    arr[i].tests += ", " + arr[j].tests;
                }
                arr.splice(j, 1);
                j--;
            }
        }
    }
    return arr;
}
