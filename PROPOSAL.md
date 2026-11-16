# Individual Project Proposal

**Student:** Yelubay Iliyas

## 1. Project title
**Quiz Night**, a trivia quiz web application

## 2. Chosen API
**Open Trivia DB**: https://opentdb.com/api_config.php
Free, no API key needed (listed in public-apis, category "Games & Comics").

## 3. Endpoints I will use
| Endpoint | Purpose |
|---|---|
| `GET https://opentdb.com/api_category.php` | get the list of categories for the form |
| `GET https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple` | get quiz questions based on the user's choice |
| `GET https://opentdb.com/api_count.php?category=18` | get the number of questions in a category (easy / medium / hard) |

## 4. Pages / routes
| Method | Route | Page |
|---|---|---|
| GET | `/` | Home page with the quiz form |
| POST | `/quiz` | Validates the form, gets questions from the API, shows the quiz |
| POST | `/quiz/:id/check` | Checks the answers, shows the result (score, %, correct answers) |
| GET | `/categories` | List of all categories |
| GET | `/categories/:id` | Category details: number of questions by difficulty |
| — | any other URL | 404 page |

## 5. Main page description
The home page will have a header with the logo "Quiz Night" and links (Play, Categories), a title "Ready for Quiz Night?" and a form:
- Your name (text field)
- Category (dropdown loaded from the API)
- Difficulty (Mixed / Easy / Medium / Hard)
- Number of questions (1–10)
- Button "Start the quiz"

If the input is wrong (empty name, wrong number), an error message will be shown above the form. After the quiz, the user will see the score, the percentage, a rank (for example "Big Brain") and the correct answers.

```
+----------------------------------------------+
|  Quiz Night                Play  Categories  |
+----------------------------------------------+
|           Ready for Quiz Night?              |
|                                              |
|   Your name:     [______________]            |
|   Category:      [Any category    v]         |
|   Difficulty:    [Mixed           v]         |
|   Questions:     [ 5 ]                       |
|                                              |
|            [ Start the quiz ]                |
+----------------------------------------------+
|        footer: Questions from Open Trivia DB |
+----------------------------------------------+
```
