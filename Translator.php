<?php

class Translator {
    private $lang = array();
    private function findString($str,$lang) {
        if (array_key_exists($str, $this->lang[$lang])) {
            return $this->lang[$lang][$str];
        }
        return $str;
    }
    private function splitStrings($str) {
        return explode('=',trim($str));
    }

    public function getTranslations() {
        return $this->lang;
    }

    public function __construct ($lang) {
        $file_path = __DIR__ . '/lang/' . $lang.'.txt' ;

        if (!array_key_exists($lang, $this->lang)) {
            if (file_exists($file_path)) {
                $strings = array_map(array($this,'splitStrings'),file($file_path));
                foreach ($strings as $k => $v) {
                    $this->lang[$v[0]] = $v[1];
                }
            }
        }
    }
}
