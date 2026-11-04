# 🎤 Quiz Night

**Web Development 2 — Individual Project** · Yelubay Iliyas

Quiz Night is a small trivia game made with **Express / Node.js**. The user enters a name, chooses a category,
difficulty and number of questions. The server uses **Axios** to get questions from the public
**Open Trivia DB** API, shows them with **EJS**, checks the answers and gives a score and a funny rank.

## API used
**Open Trivia DB** — https://opentdb.com/api_config.php (free, no API key, from the [public-apis](https://github.com/public-apis/public-apis) list, category *Games & Comics*).

| Endpoint | What I use it for |
|---|---|
| `GET /api_category.php` | list of categories for the form and the Categories page |
| `GET /api.php?amount=&category=&difficulty=&type=multiple&encode=url3986` | questions for the quiz (user input is used here) |
| `GET /api_count.php?category=ID` | number of questions in a category by difficulty |

## Features
- Form with name, category, difficulty and number of questions (1–10)
- Server-side validation with friendly messages (the form keeps what the user typed)
- Data processing: answers are decoded and **shuffled**, the score and **percentage** are calculated,
  a **rank** is given (Trivia Legend 🏆 / Big Brain 🧠 / Not Bad 😎 / Keep Practicing 📚),
  categories are **sorted** A–Z and their names are shortened, difficulty **percentages** are calculated
- Correct answers are kept on the server (in `models/quizStore.js`), not in the HTML
- Categories are cached in memory, because the API allows only 1 request per 5 seconds; if the rate limit still happens, the server waits 5 seconds and tries once more
- Error handling: timeouts, no connection, 4xx/5xx, rate limit, "not enough questions" (shown on the form), 404 page. The API needs no key, so there is no "invalid key" case
- Responsive design (desktop + mobile), EJS partials for header and footer

## Routes
| Method | Route | Description |
|---|---|---|
| GET | `/` | home page with the quiz form |
| POST | `/quiz` | validates the form, gets questions from the API, shows the quiz |
| POST | `/quiz/:id/check` | checks answers, shows the result page |
| GET | `/categories` | list of all categories |
| GET | `/categories/:id` | details of one category (question counts + bars) |
| * | anything else | 404 page |

## Project structure
```
quiz-night/
├── app.js                    # settings, middleware, routes
├── routes/quizRoutes.js      # URLs -> controller functions
├── controllers/quizController.js  # logic of the pages
├── services/triviaService.js # all Axios requests to the API
├── models/quizStore.js       # quizzes in memory
├── middleware/
│   ├── logger.js             # custom: logs method, URL, status, time
│   ├── validateQuiz.js       # custom: checks the form
│   ├── notFound.js           # 404 handler
│   └── errorHandler.js       # centralized error handler (err, req, res, next)
├── views/ (index, quiz, result, categories, category, 404, error + partials/)
├── public/css/style.css
├── .env.example
└── package.json
```

## Code comments
Every file in the project has short comments in English to make the code easy to read and check:
- `app.js`: the order of middleware and why it matters
- `routes/`: which URL calls which controller function
- `controllers/`: the logic of each page
- `services/triviaService.js`: every Axios request, its parameters and the API `response_code` values
- `middleware/`: what each custom middleware checks and when it calls `next()`
- `views/`: EJS loops and conditions are easy to find by the page sections

## Installation and run
```bash
git clone https://github.com/<your-username>/quiz-night.git
cd quiz-night
npm install
cp .env.example .env     # on Windows: copy .env.example .env
npm start
```
Open http://localhost:3000

`.env` variables:
```
PORT=3000
TRIVIA_API_URL=https://opentdb.com
```

## Screenshots
| Home | Quiz | Result |
|---|---|---|
| ![home](screenshots/01-home.png) | ![quiz](screenshots/02-quiz.png) | ![result](screenshots/03-result.png) |

| Category details | Validation | Mobile |
|---|---|---|
| ![category](screenshots/04-category.png) | ![validation](screenshots/05-validation.png) | ![mobile](screenshots/06-mobile.png) |

## Credits
- Questions: [Open Trivia DB](https://opentdb.com) (CC BY-SA 4.0)
- Shuffle algorithm: Fisher–Yates (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
- Project structure is based on the course lectures (Express, Middleware, EJS, Axios)
