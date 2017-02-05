<?php
namespace CoreUI\Form\Classes\Control;
use CoreUI\Form\Classes\Control;
use CoreUI\Utils\Mtpl;

require_once __DIR__ . '/../Control.php';



/**
 * Class Modal
 * @package CoreUI\Form\Control
 */
class Modal extends Control {

    protected $url        = '';
    protected $title      = '';
    protected $text       = '';
    protected $size       = 'normal';
    protected $attributes = array(
        'type' => 'hidden'
    );


    /**
     * @param string $label
     * @param string $name
     * @param string $title
     */
    public function __construct($label, $name = '', $title = '') {
        parent::__construct($label, $name);
        $this->title = $title;
    }


    /**
     * @param  string     $url
     * @return self
     * @throws \Exception
     */
    public function setUrl($url) {

        $this->url = $url;
        return $this;
    }


    /**
     * @param  string     $size
     * @return self
     * @throws \Exception
     */
    public function setSize($size) {

        $this->size = $size;
        return $this;
    }


    /**
     * @param  string     $text
     * @return self
     * @throws \Exception
     */
    public function setText($text) {

        $this->text = htmlspecialchars($text);
        return $this;
    }


    /**
     * @param  string     $value
     * @return self
     * @throws \Exception
     */
    public function setValue($value) {

        $this->attributes['value'] = htmlspecialchars($value);
        return $this;
    }


    /**
     * @return string
     */
    protected function makeControl() {

        $tpl = new Mtpl(__DIR__ . '/../../html/form/controls/modal.html');

        if ($this->readonly) {
            $tpl->readonly->assign('[TEXT]', $this->text);

        } else {
            $id = crc32(uniqid('mod', true));
            $attributes = array(
                "id=\"{$id}\""
            );

            if ( ! empty($this->attributes)) {
                foreach ($this->attributes as $attr_name => $value) {
                    if (trim($attr_name) != 'id') {
                        $attributes[] = "$attr_name=\"$value\"";
                    }
                }
            }

            if ($this->required) {
                $attributes[] = 'required="required"';
            }

            switch ($this->size) {
                case 'small': $size = ' combine-modal-sm'; break;
                case 'large': $size = ' combine-modal-lg'; break;
                case 'normal': default: $size = '';break;
            }


            $this->addCss($this->theme_src . '/css/bootstrap.modal.min.css', true);
            $this->addJs($this->theme_src . '/js/bootstrap.modal.min.js',  true);

            $tpl->control->assign('[ATTRIBUTES]', implode(' ', $attributes));
            $tpl->control->assign('[THEME_SRC]',  $this->theme_src);
            $tpl->control->assign('[KEY]',        $id);
            $tpl->control->assign('[URL]',        $this->url);
            $tpl->control->assign('[TITLE]',      $this->title);
            $tpl->control->assign('[TEXT]',       $this->text);
            $tpl->control->assign('[SIZE]',       $size);
        }

        return $tpl->render();
    }
}