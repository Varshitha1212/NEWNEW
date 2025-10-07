<?php
// Tiny flat-file score storage. For demo only.
// Methods:
//  - GET: returns JSON { scores: [{ name, score, ts }] }
//  - POST: body JSON { name, score }

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$file = __DIR__ . DIRECTORY_SEPARATOR . 'scores.json';
if (!file_exists($file)) { file_put_contents($file, json_encode([ 'scores' => [] ])); }

function read_scores($file) {
    $raw = @file_get_contents($file);
    if ($raw === false) { return [ 'scores' => [] ]; }
    $json = json_decode($raw, true);
    if (!is_array($json) || !isset($json['scores']) || !is_array($json['scores'])) {
        return [ 'scores' => [] ];
    }
    return $json;
}

function write_scores($file, $data) {
    $tmp = $file . '.tmp';
    file_put_contents($tmp, json_encode($data, JSON_PRETTY_PRINT));
    rename($tmp, $file);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = read_scores($file);
    // Sort by score desc then recency
    usort($data['scores'], function($a, $b) {
        if (($b['score'] ?? 0) === ($a['score'] ?? 0)) {
            return ($b['ts'] ?? 0) <=> ($a['ts'] ?? 0);
        }
        return ($b['score'] ?? 0) <=> ($a['score'] ?? 0);
    });
    echo json_encode([ 'scores' => array_slice($data['scores'], 0, 50) ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true);
    $name = trim(strval($payload['name'] ?? 'Player'));
    $score = intval($payload['score'] ?? 0);
    $name = substr($name, 0, 12);
    $score = max(0, min($score, 100000));

    $data = read_scores($file);
    $data['scores'][] = [ 'name' => $name, 'score' => $score, 'ts' => time() ];
    write_scores($file, $data);
    echo json_encode([ 'ok' => true ]);
    exit;
}

http_response_code(405);
echo json_encode([ 'error' => 'Method not allowed' ]);

