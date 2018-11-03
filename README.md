# Slide everything

## Quick start
- `yarn install`
- `yarn build`
- Create `lecturer.json` with an empty object as content (`{}`)
- `mkdir database`
- `mkdir -p public/lectures/YOUR-LECTURE-NAME` (dashes will be replaced by spaces)
- `pdf2svg YOUR.pdf public/lectures/YOUR-LECTURE-NAME/%d.svg all`
- `yarn run`
- Open `localhost:3000` in your browser
- Try to login as lecturer. This will fail, but provide you with the correct authentication token in the server log.
- Add your username and token as key/value pair to the `lecturer.json`. E.g. `{"klaus": "TOKEN"}`.
- Restart your server.
