<?php


class TemplateParser {

    private $content = '';
    private $lang = '';
    private $variables = [];

    public function __construct($templateFile) {
        $this->content     = file_get_contents($templateFile);
        $acceptLang        = ['de', 'en'];
        
        $lang              = $_GET['lang'] ?: substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
        $lang = in_array($lang, $acceptLang) ? $lang : 'en';
        $this->lang        = $lang;
        $langSwitch        = array_values(array_diff($acceptLang, [$this->lang]))[0] ?: 'de';
        $this->setVariable('langswitch', $langSwitch);
        $this->setVariable('lang', $lang);
    }

    public function parseTemplate() {
        $this->includeFiles();
        $this->loadTranslations();
        $this->passVariables();

        return $this->content;
    }

    private function loadTranslations() {
        $translator   = new Translator($this->lang);
        $translations = $translator->getTranslations();
        foreach ($translations as $key => $translation) {
            $this->content = preg_replace('/{{t:"' . $key . '"}}/', $translation, $this->content);
        }
    }

    public function setVariable($key, $value) {
        $this->variables[$key] = $value;
    }

    public function setVariables($array) {
        $this->variables = array_merge($this->variables, $array);
    }

    private function passVariables() {
        foreach ($this->variables as $key => $value) {
            $this->content = preg_replace('/{{' . $key . '}}/', $value, $this->content);
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
