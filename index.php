<?php

include_once 'Translator.php';
include_once 'TemplateParser.php';


if (!empty($_GET['ajax'] && !empty($_GET['template']))) {
    $parser = new TemplateParser('components/inc_' . $_GET['template'] .  '.html');
    $parser->setVariable('rootUrl', 'http://localhost/jencoding');

    if ($_GET['template'] === 'contact') {
        $parser->setVariable('contactMail', 'moin@jencoding.com');

    }
    echo $parser->parseTemplate();
    die();
}

$parser = new TemplateParser('template.html');
$parser->setVariable('rootUrl', 'https://jencoding.com');

echo $parser->parseTemplate();

// TODO: Add Project Content
