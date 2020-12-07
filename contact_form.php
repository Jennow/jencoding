<?php
if(!empty($_POST['message']) && !empty($_POST['name']&& !empty($_POST['email']))) {
    $to      = 'jeniferprochnow@web.de';
    $subject = 'jencoding.com Kontakt von ' . $_POST['name'];
    $message = 'Nachricht von ' . $_POST['name'] . ': ' . $_POST['message'];
    $headers = 'From: ' - $_POST['email'] . "\r\n" . 'X-Mailer: PHP/' . phpversion();

    $success = mail($to, $subject, $message, $headers);
    echo json_encode(['succsess' => $success]);
    exit;
}
echo json_encode(['succsess' => false]);
exit;
