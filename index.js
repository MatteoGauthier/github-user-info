const prompts = require('prompts');
const fetch = require('node-fetch');
const boxen = require('boxen');
const chalk = require('chalk')

var location = ''

function handleErrors(response) {
    if (!response.ok) {
        throw Error(chalk.red(response.statusText));
    }
    return response;
}


var insidetext = chalk.bold('Github User Info')

console.log(boxen(insidetext, { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'cyan', float: 'center' }))
const questions = [
    {
        type: 'text',
        name: 'githubUsername',
        message: "What's your Github username?",
        validate: githubUsername => githubUsername == '' ? `Type something..` : true
    }
];

(async () => {
    const response = await prompts(questions);
    console.log(response.githubUsername)

    fetch(`https://api.github.com/users/${response.githubUsername}`)
    .then(handleErrors)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            process(json)

        });
    // => response => { username, age, about }
})();

function process(json) {

    let apiKey = '17057ac07423aea45e89374601e85ef5'
    let city = json.location;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    fetch(url).then(handleErrors).then(res => res.json()).then(took => {
        console.log("hey ", json)
        if (took.cod !== '200') {
            console.log('eroor')
        }
        return took
    }).then(message => {

        console.log(`
            Username: ${chalk.blue(json.login)}
                Name: ${chalk.blue(json.name)}
          Identifier: ${chalk.blue(json.id)}
         Repos count: ${chalk.blue(json.public_repos)}
        Social Stats: ${chalk.blue(json.name)} follow ${chalk.blue(json.following)} users and ${chalk.blue(json.followers)} follow him
            Location: ${chalk.blue(json.location)}
             Weather: ${message.main.temp}°C in ${chalk.blue(json.location)}
            `)
    })

    
}