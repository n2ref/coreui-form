<?php
namespace CoreUI\Form\Classes\Control;
use CoreUI\Form\Classes\Control;
use CoreUI\Utils\Mtpl;


require_once __DIR__ . '/../Control.php';



/**
 * Class Markdown
 * @package CoreUI\Form\Control
 */
class Markdown extends Control {

    protected $value      = '';
    protected $attributes = array(
        'class' => 'combine-form-control',
        'rows'  => '6'
    );


    /**
     * @param  string $string
     * @return $this
     */
    public function setValue($string) {
        $this->value = htmlspecialchars($string);
        return $this;
    }


    /**
     * @return string
     */
    protected function makeControl() {

        $tpl = new Mtpl(__DIR__ . '/../../html/form/controls/markdown.html');

        if ($this->readonly) {
            $tpl->readonly->assign('[VALUE]', $this->value);

        } else {
            $id = uniqid('mk');
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

            $this->addCss($this->theme_src . '/editors/markdown/styles.css', true);
            $this->addJs($this->theme_src . '/editors/markdown/jstoolbar.js', true);
            $this->addJs($this->theme_src . '/editors/markdown/lang/ru.js', true);

            $tpl->control->assign('[TPL_DIR]',    $this->theme_src);
            $tpl->control->assign('[ATTRIBUTES]', implode(' ', $attributes));
            $tpl->control->assign('[VALUE]',      $this->value);
            $tpl->control->assign('[ID]',         $id);
        }

        return $tpl->render();
    }
}