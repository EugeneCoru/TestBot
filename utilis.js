const questionss = require('./questions');

const GetRandomQuestion = (topic) => {
    // console.log(1);
    console.log(questionss);
    // console.log(2);
    const questionTopic = topic.toLowerCase();
    //console.log(questionss[questionTopic]);
    const randomQuetionIndex = Math.floor(Math.random() * questionss[questionTopic].length);
    // console.log(3);
    // console.log(randomQuetionIndex);
    return questionss[questionTopic][randomQuetionIndex];
}



const GetCorrectAnswer = (topic, id) => {
    const question = questionss[topic].find(question => { return question.id === id });
    
    if (!question.hasOptions) {
        return question.answer;
    }

    return question.options.find((option) => option.isCorrect).txt;
};

module.exports = { GetRandomQuestion, GetCorrectAnswer };