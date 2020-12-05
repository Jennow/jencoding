<?php


class TemplateParser {

    private $content = '';

    public function __construct($templateFile) {
        $this->content = file_get_contents($templateFile);
    }

    public function parseTemplate() {
        $this->includeFiles();
        $this->loadTranslations();

        return $this->content;
    }


    private function loadTranslations() {
        $lang       = $_GET['lang'];
        $acceptLang = ['de', 'en'];
        $lang       = in_array($lang, $acceptLang) ? $lang : 'en';

        $translator   = new Translator($lang);
        $translations = $translator->getTranslations();

        foreach ($translations as $key => $translation) {
            $this->content = preg_replace('/{{t:"' . $key . '"}}/', $translation, $this->content);
        }
    }

    private function includeFiles() {
        if (preg_match_all('/<!-- INCLUDE (.+?) -->/', $this->content, $var)) {
            foreach ($var[1] as $includeFilename) {
                try {
                    $snippet = $this->load_file($includeFilename);
                } catch (\Exception $e) {
                    $snippet = '';
                }
                $this->content = str_replace("<!-- INCLUDE $includeFilename -->", $snippet, $this->content);
            }
        }
    }

    private function load_file($filename) {
        if (!is_file($filename)) {
            $filename = __DIR__ . '/components/' . $filename;

            if (!is_file($filename)) {
                throw new Exception("Template file '$filename' not found.");
            }
        }

        $template = file_get_contents($filename);

        if (preg_match_all('/<!-- INCLUDE (.+?) -->/', $template, $var)) {
            foreach ($var[1] as $includeFilename) {
                try {
                    $snippet = $this->load_file(dirname($filename) . '/' . $includeFilename);
                } catch (\Exception $e) {
                    $snippet = '';
                }

                $template = str_replace("<!-- INCLUDE $includeFilename -->", $snippet, $template);
            }
        }

        return $template;
    }

}
