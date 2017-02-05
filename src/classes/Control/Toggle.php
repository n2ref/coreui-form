<?php
namespace CoreUI\Form\Classes\Control;
use CoreUI\Form\Classes\Control;
use CoreUI\Utils\Mtpl;


require_once __DIR__ . '/../Control.php';



/**
 * Class Toggle
 * @package CoreUI\Form\Control
 */
class Toggle extends Control {

    protected $inactive_value = 'N';
    protected $active_value   = 'Y';
    protected $default_value  = false;
    protected $attributes     = array(
        'type' => 'hidden'
    );
    protected $locutions = array(
        'ru' => array(
            'Да'  => 'Да',
            'Нет' => 'Нет',
        ),
        'en' => array(
            'Yes' => 'Yes',
            'No'  => 'No',
        )
    );



    /**
     * @param string $active
     * @param string $inactive
     * @return self
     */
    public function setvalues($active, $inactive) {
        $this->inactive_value = $inactive;
        $this->active_value   = $active;
        return $this;
    }


    /**
     * @param bool $is_active
     * @return self
     */
    public function setDefault($is_active) {
        $this->default_value = (bool)$is_active;
        return $this;
    }


    /**
     * @return string
     */
    protected function makeControl() {

        $tpl = new Mtpl(__DIR__ . '/../../html/form/controls/toggle.html');

        if ($this->readonly) {
            $value = '';
            $text  = '';
            if ( ! empty($this->attributes['value'])) {
                $value = $this->attributes['value'];
            }

            if ($value == '') {
                $text = $this->default_value
                    ? $this->locutions[$this->lang]['Да']
                    : $this->locutions[$this->lang]['Нет'];

            } else {
                $text = $value == $this->active_value
                    ? $this->locutions[$this->lang]['Да']
                    : $this->locutions[$this->lang]['Нет'];
            }

            $tpl->readonly->assign('[VALUE]', $text);

        } else {
            $id = hash('crc32b', uniqid('tg', true));
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


            $tpl->control->assign('[ATTRIBUTES]',     implode(' ', $attributes));
            $tpl->control->assign('[INACTIVE_VALUE]', $this->inactive_value);
            $tpl->control->assign('[ACTIVE_VALUE]',   $this->active_value);
            $tpl->control->assign('[DEFAULT_VALUE]',  $this->default_value ? '1' : '0');
            $tpl->control->assign('ID',               $id);
        }

        return $tpl->render();
    }
}