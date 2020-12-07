<?php

include_once 'Translator.php';
include_once 'TemplateParser.php';

$parser = new TemplateParser('template.html');
$parser->setVariable('rootUrl', 'http://localhost/jencoding');
$parser->setVariable('contactMail', 'jeniferprochnow@web.de');

echo $parser->parseTemplate();


// TODO: Add Projects
// TODO: Add own contentpage for each project
// TODO: Make slider dynamic to have mor than 3 projects
// TODO: Project Icons Größe anpassen
// TODO? Mobil Bewegung der Icons bei Bewegung des Devices?
