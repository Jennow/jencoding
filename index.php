<?php

include_once 'Translator.php';
include_once 'TemplateParser.php';


$parser = new TemplateParser('template.html');
echo $parser->parseTemplate();



