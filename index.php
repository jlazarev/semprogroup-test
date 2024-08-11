<?php

if (!empty($_REQUEST)) {
    $post = [
        'secret' => '6LeuUcsoAAAAAEnGb-3NMkC_1LXz6rUsO5g6vWNg',
        'response' => $_REQUEST['g-recaptcha-response'],
    ];
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $serverOutput = curl_exec($ch);
    $response = json_decode($serverOutput, true);
    if ($response['success'] !== true) {
        createResponse();
    }
}

if ($_POST) {
    $fromEmail = "no-reply@tprs.ru";
    $recipientEmail = 'support@tprs.ru';

    $senderName = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
    $senderPhone = filter_var($_POST['tel'], FILTER_SANITIZE_STRING);
    $senderEmail = filter_var($_POST['email'], FILTER_SANITIZE_STRING);
    $senderCompany = filter_var($_POST['company'], FILTER_SANITIZE_STRING);
    $senderMessage = filter_var($_POST['prodject'], FILTER_SANITIZE_STRING);

    $boundary = md5("specialToken$4332");

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "From:" . $fromEmail . "\r\n";
    $headers .= "Reply-To: " . $senderEmail . "" . "\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary = $boundary\r\n\r\n";

    $senderMessage = sprintf(
        "Имя: %s\r\nТелефон: %s\r\nЕмайл: %s\r\nКомпания: %s\r\nСопроводительное письмо: %s",
        "Заявка с сайта kazna.tprs.ru",
        $senderName,
        $senderPhone,
        $senderEmail,
        $senderCompany,
        $senderMessage
    );

    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=utf-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($senderMessage));

    $status = mail($recipientEmail, $encodedSubject, $body, $headers);
    createResponse($status);
}

function createResponse($status = false)
{
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: https://kazna.tprs.ru/');
    header("HTTP/1.1 200 OK");
    echo json_encode(["status" => $status]);
    exit(1);
}
