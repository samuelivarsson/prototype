export function parseStringToObject(completion_text) {
    const obj = JSON.parse(completion_text);
    return obj;
}

export function mergeObjectsWithSameId(objects) {
    var arr = [...objects];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].requirementID === arr[j].requirementID) {
                if (arr[i].tests.length == 0) {
                    arr[i].tests = arr[j].tests;
                } else if (arr[j].tests.length != 0) {
                    arr[i].tests += ", " + arr[j].tests;
                }
                arr.splice(j, 1);
                j--;
            }
        }
    }
    return arr;
}
