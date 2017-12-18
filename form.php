<?php


$in = json_decode(file_get_contents('php://input'), true);

$fields = ['name', 'email', 'message'];

$data = [];
$error = false;


foreach ($fields as $field) {
    if (isset($in[$field])) {
        $data[$field] = htmlentities($in[$field]);
    } else {
        $error = true;
    }
}
header('Content-Type: application/json');
if (!$error) {
    echo json_encode(['success' => true]);
    $to = 'conall@coda.works';
    $subject = sprintf('New message from %s [%s]', $data['name'], $data['email']);
    $message = sprintf('Name: %s', $data['name']) . PHP_EOL . PHP_EOL .
        sprintf('Email: %s', $in['email']) . PHP_EOL . PHP_EOL .
        $in['message'];
    mail($to, $subject, $message);
}