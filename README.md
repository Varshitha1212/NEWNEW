# NEWNEW

A simple browser game with a lightweight frontend and a minimal PHP backend for saving scores.

## Overview

- **Frontend**: `index.html`, `style.css`, `game.js`
- **Backend**: `index.php` (entry for hosting with PHP), `scores.php` (save/read scores)
- **Purpose**: Play the game in the browser and optionally persist high scores via the PHP endpoint.

## Features

- Interactive gameplay in the browser
- Responsive layout
- Score submission and retrieval via simple PHP endpoints

## Getting Started (Local)

You can open `index.html` directly in a browser to play offline. For score saving, run a small PHP server so the `scores.php` endpoint works.

### Option 1: PHP built‑in server

```bash
cd NEWNEW
php -S localhost:8000
```

Then open `http://localhost:8000/index.html` in your browser.

### Option 2: Any web server

Serve the folder with your preferred server (Apache, Nginx, XAMPP, WAMP). Ensure `.php` files are routed and executable by PHP.

## Project Structure

```
NEWNEW/
├─ index.html       # Game UI
├─ style.css        # Styles
├─ game.js          # Game logic
├─ index.php        # Optional PHP index
└─ scores.php       # Simple score API
```

## Score API (basic)

- `POST /scores.php` – submit a score (implementation may vary)
- `GET  /scores.php` – list scores

Note: This is a minimal demo endpoint and is not secured for production use.

## Development

- Edit `game.js` to change gameplay mechanics
- Adjust styles in `style.css`
- Update `scores.php` to modify storage format/logic

## License

This project is available under the MIT License. You can modify and use it as needed.