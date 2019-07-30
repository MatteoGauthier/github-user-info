#!/usr/bin/env node

const terminalImage = require("terminal-image")
const got = require("got")
const prompts = require("prompts")
const open = require("open")
const fetch = require("node-fetch")
const boxen = require("boxen")
const chalk = require("chalk")
const clipboardy = require("clipboardy")
const terminalLink = require("terminal-link")

const argv = require("yargs")
    .usage("Usage: $0 -u [eg. username] --copy [eg. login] -o")
    .alias("c", "copy")
    .nargs("c", 1)
    .describe("c", "Copy user infos")
    .alias("o", "open")
    .describe("c", "Open in your browser the current github profile")
    .help("h")
    .alias("h", "help")
    .epilog("Mattèo Gauthier - semoule.fr 2019").argv

var location = ""

function handleErrors(response) {
    if (!response.ok) {
        throw Error(chalk.red(response.statusText))
    }
    return response
}

// function jsoin(x) {
//     console.dir(JSON.parse(x), {
//         depth: null,
//         colors: true
//     })
// }

var insidetext = chalk.bold("Github User Info")

console.log(
    boxen(insidetext, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
        float: "center"
    })
)
const questions = [
    {
        type: "text",
        name: "githubUsername",
        message: "What's your Github username?",
        validate: githubUsername => (githubUsername == "" ? `Type something..` : true)
    }
]

;(async () => {
    var answers
    if (argv.u) {
        answers = { githubUsername: argv.u }
    } else {
        answers = await prompts(questions)
    }

    try {
        var response = await got(`https://api.github.com/users/${answers.githubUsername}`)

        // console.log("statusCode:", response.statusCode);
        // console.log("body:", jsoin(response.body));

        process(JSON.parse(response.body))
    } catch (error) {
        if (error.statusCode == 404) {
            console.log(`${chalk.bold.red('Invalid Request - 404 error')}`)
        } else {

            console.log("error:", error)
        }
    }
})()

async function process(json) {
    try {
        const { body } = await got(json.avatar_url, {
            encoding: null
        })
        console.log(await terminalImage.buffer(body))
    } catch (error) {
        console.log("error:", error)
    } finally {
        if (argv.c == "username" || argv.c == "login") {
            clipboardy.writeSync(json.login)
        }
        if (argv.c == "name") {
            clipboardy.writeSync(json.name)
        }
        if (argv.c == "id" || argv.c == "identifier") {
            clipboardy.writeSync(json.id)
        }
        if (argv.c == "repos" || argv.c == "repository") {
            clipboardy.writeSync(json.public_repos.toString())
        }
        if (argv.c == "social") {
            clipboardy.writeSync(`${json.name} follow ${json.following} users and ${json.followers} follow him`)
        }
        if (argv.c == "location" || argv.c == "geo") {
            clipboardy.writeSync(json.location)
        }
        if (argv.o) {
            open(json.html_url)
        }
    }

    let apiKey = "17057ac07423aea45e89374601e85ef5"
    let city = json.location
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    fetch(url)
        .then(handleErrors)
        .then(res => res.json())
        .then(took => {
            if (took.cod != "200") {
                console.log("eroor")
            }

            return took
        })
        .then(message => {
            console.log(`
            Username: ${chalk.blue(json.login)}
                Name: ${chalk.blue(json.name)}
          Identifier: ${chalk.blue(json.id)}
         Repos count: ${chalk.blue(json.public_repos)}
        Social Stats: ${chalk.blue(json.name)} follow ${chalk.blue(json.following)} users and ${chalk.blue(json.followers)} follow him
            Location: ${chalk.blue(json.location)}
             Weather: ${message.main.temp}°C in ${chalk.blue(json.location)}
                    \n
                ${chalk.yellow(`Direct Link to this github profile ${json.html_url}`)}
            `)
        })
}
