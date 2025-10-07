<?php
// Simple PHP entry for LCM Balloon Pop Game
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>LCM Balloon Pop - Learn by Playing</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css" />
</head>
<body>
    <div class="app">
        <header class="app__header">
            <div class="brand">LCM Balloon Pop</div>
            <nav class="nav">
                <button id="tab-play" class="tab tab--active" data-tab="play" aria-controls="panel-play">Play</button>
                <button id="tab-learn" class="tab" data-tab="learn" aria-controls="panel-learn">Learn</button>
                <button id="tab-scores" class="tab" data-tab="scores" aria-controls="panel-scores">Scores</button>
            </nav>
        </header>

        <main class="app__main">
            <section id="panel-play" class="panel panel--active" role="region" aria-labelledby="tab-play">
                <div class="controls">
                    <label>Numbers:
                        <input id="numA" type="number" min="2" max="12" value="4" />
                        and
                        <input id="numB" type="number" min="2" max="12" value="6" />
                    </label>
                    <label>Speed:
                        <select id="speed">
                            <option value="slow">Slow</option>
                            <option value="normal" selected>Normal</option>
                            <option value="fast">Fast</option>
                        </select>
                    </label>
                    <button id="btn-start" class="primary">Start Game</button>
                    <div class="hud">
                        <div>Target LCM: <span id="hud-lcm">—</span></div>
                        <div>Score: <span id="hud-score">0</span></div>
                        <div>Time: <span id="hud-time">60</span>s</div>
                    </div>
                </div>

                <div id="game-area" class="game-area" aria-live="polite"></div>

                <dialog id="game-over">
                    <h2>Great job!</h2>
                    <p>Your score: <strong id="final-score">0</strong></p>
                    <form method="dialog">
                        <input id="player-name" type="text" maxlength="12" placeholder="Your name" />
                        <button id="btn-save-score" class="primary">Save Score</button>
                        <button id="btn-replay">Play Again</button>
                    </form>
                </dialog>
            </section>

            <section id="panel-learn" class="panel" role="region" aria-labelledby="tab-learn">
                <div class="learn">
                    <h2>What is LCM?</h2>
                    <p><strong>LCM</strong> means Least Common Multiple. It is the smallest number that is a multiple of both numbers.</p>
                    <div class="learn__viz">
                        <div>
                            <label>Number A
                                <input id="learnA" type="number" min="2" max="12" value="4" />
                            </label>
                        </div>
                        <div>
                            <label>Number B
                                <input id="learnB" type="number" min="2" max="12" value="6" />
                            </label>
                        </div>
                        <button id="btn-refresh-learn" class="secondary">Show Multiples</button>
                    </div>
                    <div class="times">
                        <div>
                            <h3>Multiples of A</h3>
                            <ul id="listA" class="chips"></ul>
                        </div>
                        <div>
                            <h3>Multiples of B</h3>
                            <ul id="listB" class="chips"></ul>
                        </div>
                        <div>
                            <h3>Common Multiples</h3>
                            <ul id="listCommon" class="chips chips--common"></ul>
                        </div>
                    </div>
                    <p class="tip">Tip: The first common multiple you see is the LCM!</p>
                </div>
            </section>

            <section id="panel-scores" class="panel" role="region" aria-labelledby="tab-scores">
                <h2>High Scores</h2>
                <form id="scores-form" class="scores-form">
                    <button id="btn-load-scores" class="secondary" type="button">Refresh</button>
                </form>
                <ol id="scores-list" class="scores-list"></ol>
            </section>
        </main>

        <footer class="app__footer">
            <span>Made for grades 4–7 • Learn, Play, Practice</span>
        </footer>
    </div>

    <script src="game.js"></script>
</body>
</html>

