// Function to remove duplicates and combine choices
const combineDuplicates = (arr) => {
    return Array.from(
        arr.reduce((acc, { ques, choice }) => {
            if (!acc.has(ques)) {
                acc.set(ques, []);
            }
            acc.get(ques).push(choice);
            return acc;
        }, new Map())
    ).map(([ques, choices]) => ({ ques, choice: choices }));
};

module.exports = combineDuplicates;
