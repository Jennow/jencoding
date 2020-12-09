<?php

include_once 'Translator.php';
include_once 'TemplateParser.php';

$rootUrl = 'http://localhost/jencoding';
//$rootUrl = 'https://jencoding.com';

if (!empty($_GET['ajax'] && !empty($_GET['template']))) {
    if(strpos($_GET['template'], 'project') === 0) {
        $parser = new TemplateParser('components/projects/inc_' . $_GET['template'] .  '.html');
    } else {
        $parser = new TemplateParser('components/inc_' . $_GET['template'] .  '.html');
    }
    $parser->setVariable('rootUrl', $rootUrl);

    if ($_GET['template'] === 'contact') {
        $parser->setVariable('contactMail', 'moin@jencoding.com');

    }
    echo $parser->parseTemplate();
    die();
}

$parser = new TemplateParser('template.html');
$parser->setVariable('rootUrl', $rootUrl);

echo $parser->parseTemplate();

// TODO: Add Project Content
