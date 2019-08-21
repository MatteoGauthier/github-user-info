# github-user-info
Github cli app to display user info

# Usage
`npm i -g gh-user-info`
```yaml
$ gh-user-info --help
Usage: gh-user-info -u [eg. username] --copy [eg. login] -o

Options:
  --version   Show version number                                      [boolean]
  -c, --copy  Copy user infos
  -o, --open  Open in your browser the current github profile
  -u, --user  Chose a specific github user
  -h, --help  Show help                                                [boolean]

Mattèo Gauthier - semoule.fr 2019
```

## Dev Instruction

Clone the repository

`git clone https://github.com/MattixNow/github-user-info`

Start the app

`node .`


## TODO
- [ ] replace node-fetch by got
- [ ] remove terminal-link
