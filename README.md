LCM Balloon Pop - Learn by Playing

Overview
- Kid-friendly mini-game to learn Least Common Multiple (LCM) for grades 4–7.
- Tech: PHP (flat-file), Vanilla JS, CSS.

Run locally (WAMP/XAMPP/LAMP)
- Copy files to web root (e.g., htdocs/LCMGame).
- Start Apache (PHP enabled).
- Open http://localhost/LCMGame/index.php

How to play
- Choose two numbers (2–12). Target LCM is shown.
- Pop balloons that are multiples of the LCM. 60-second timer.
- +5 points for correct, −3 for incorrect.

Learn tab
- Shows first 12 multiples of both numbers.
- Highlights common multiples; the first common multiple is the LCM.

High scores
- After a round, enter a name and save.
- Data is stored in scores.json via scores.php (flat-file for demo).

Notes
- For classrooms/demos. For production, prefer a database and auth.

