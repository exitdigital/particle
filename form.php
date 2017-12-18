<?php
require 'vendor/autoload.php';

function send($name, $email, $message)
{
    $from = new SendGrid\Email($name, $email);
    $to = new SendGrid\Email("Coda", "hello@coda.works");
    $to = new SendGrid\Email("Coda", "conall@coda.works");
    $subject = sprintf('New message from %s [%s]', $name, $email);
    $content = new SendGrid\Content("text/plain", $message);
    $mail = new SendGrid\Mail($from, $subject, $to, $content);
    $sg = new \SendGrid('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');
    $response = $sg->client->mail()->send()->post($mail);

    return [
        'code' => $response->statusCode(),
        'body' => $response->body()
    ];

}

$in = json_decode(file_get_contents('php://input'), true);

$fields = ['name', 'email', 'message'];

$data = [];
$error = false;


if (isset($_GET['fish']) && $_GET['fish'] === 'alno0ynhulj8') {
    var_dump(send('Test User', 'conall@coda.works', 'Test message dasd asd 
    
    dasdsa
    d
    asd
    as
    d'));
}

foreach ($fields as $field) {
    if (isset($in[$field])) {
        $data[$field] = htmlspecialchars($in[$field]);
    } else {
        $error = true;
    }
}
header('Content-Type: application/json');
if (!$error) {
    echo json_encode(['success' => true]);
    send($data['name'], $data['email'], $data['message']);
} else {
    echo json_encode(['success' => false]);
}

