//const { Random } = require('random');
const questionss = require('./questions');

const GetRandomQuestion = (topic) => {
    
    let questionTopic = topic.toLowerCase();// перевод слова в нижний регистр
    if (questionTopic == 'random') {
        questionTopic = Object.keys(questionss)[Math.floor(Math.random() * Object.keys(questionss).length)];// берем количество названий объектов и запускаем для поика рандомного значения

    }
    
    const randomQuetionIndex = Math.floor(Math.random() * questionss[questionTopic].length);

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