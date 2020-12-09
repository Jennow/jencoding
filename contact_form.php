<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if(!empty($_POST['message']) && !empty($_POST['name']&& !empty($_POST['email']))) {

  $mail = new PHPMailer(true);
  $mail->CharSet = "UTF-8";

  try {
    $mail->setFrom($_POST['email'], 'Jencoding Kontaktformular');
    $mail->addAddress('moin@jencoding.com');

    $mail->Subject = 'jencoding.com Kontakt von ' . $_POST['name'];
    $mail->Body    = 'Nachricht von ' . $_POST['name'] . ': ' . $_POST['message'];
    $success       = $mail->send();
    echo json_encode(['success' => true]);
    exit;
  } catch (Exception $e) {
    echo json_encode(['success' => false]);
    exit;
  }
}

echo json_encode(['success' => false]);
exit;
