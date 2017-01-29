<?php
namespace CoreUI;
use CoreUI\Form\Classes\Control;
use CoreUI\Form\Classes\Button;
use CoreUI\Utils\Session\SessionNamespace;


/**
 * Class Form
 * @package CoreUI
 */
class Form {

	protected $attributes       = array();
	protected $resource	 		= '';
	protected $template	 	    = '[default]';
	protected $current_position = 'default';
	protected $positions 	    = array();
	protected $ajax_request		= true;
	protected $theme_src        = '';
    protected $theme_location   = '';
    protected $buttons_wrapper  = null;
    protected $token            = null;

    /**
     * @var SessionNamespace|null
     */
    protected $session          = null;

	protected static $scripts_js  = array();
	protected static $scripts_css = array();

    protected $date_mask = "dd.mm.yyyy";
    protected $lang      = '';
	protected $locutions = array(
		'Save'   		 => 'Сохранить',
		'Select' 		 => 'Выбрать',
		'No read access' => 'Нет доступа для чтения этой записи'
	);


    /**
     * @param string $resource
     */
    public function __construct($resource) {

        $this->resource  = $resource;
        $this->lang      = Registry::getLanguage();
        $this->theme_src = substr(__DIR__, strlen($_SERVER['DOCUMENT_ROOT']));
        $this->token     = sha1(uniqid('coreui', true));

        $this->session = new SessionNamespace($this->resource);
        if ( ! isset($this->session->form)) {
            $this->session->form = new \stdClass();
        }

        $this->session->form->{$this->token} = new \stdClass();
    }


	/**
	 * @param  string       $name
	 * @param  array        $args
	 * @return Control\Text
     * @throws Exception
	 */
	public function __call($name, $args) {

        if (strpos($name, 'add') === 0) {
            $label        = isset($args[0]) ? $args[0] : '';
            $control_name = isset($args[1]) ? $args[1] : null;

            $control = new Control\Text($label, $control_name);
            $control->setAttr('type', strtolower(substr($name, 3)));

            $this->positions[$this->current_position]['controls'][] = $control;
            $this->current_position = 'default';
            return $control;

        } else {
            throw new Exception("Incorrect name magic function '{$name}'");
        }
	}


	/**
	 * @param  string $name
	 * @return self
	 */
	public function __get($name) {
		$this->current_position = $name;
		return $this;
	}


	/**
	 * Set HTML layout for the form
	 * @param  string $template
	 * @return bool
	 */
	public function setTemplate($template) {
        if (is_string($template)) {
			$this->template = $template;
			return true;
		} else {
			return false;
		}
	}


    /**
     * @param string $url
     */
    public function setBackUrl($url) {
        $this->setSessData('back_url', $url);
    }


	/**
	 * @param  string     $name
	 * @param  string     $value
	 * @return self
	 * @throws Exception
	 */
	public function setAttr($name, $value) {

		if (is_string($name) && (is_string($value) || is_numeric($value))) {
            $this->attributes[$name] = $value;

		} else {
			throw new Exception("Attribute not valid type. Need string or number");
		}

		return $this;
	}


	/**
	 * @param  array $attributes
	 * @return self
	 */
	public function setAttribs($attributes) {
		foreach ($attributes as $name => $value) {
			$this->setAttr($name, $value);
		}
		return $this;
	}


	/**
	 * @param bool $arg
	 */
	public function setAjaxRequest($arg = true) {
		$this->ajax_request = (bool)$arg;
	}


	/**
	 * @param $name
	 * @param $value
	 */
	public function setSessData($name, $value) {
        $this->session->form->{$this->token}->{$name} = $value;
	}


    /**
     * @param  string     $name
     * @return mixed|null
     */
	public function getSessData($name) {
        if (isset($this->session->form->{$this->token}->{$name})) {
            return $this->session->form->{$this->token}->{$name};
        }
        return null;
	}


	/**
	 * @param string $html
	 */
	public function setButtonsWrapper($html) {
        $this->buttons_wrapper = $html;
	}


	/**
	 * @param  string $label
	 * @param  string $type
	 * @param  string $name
	 * @return Control|Control\Text|Control\Upload|Control\Select|Control\Wysiwyg
     * @throws Exception
	 */
	public function addControl($label, $type, $name = '') {

        $type_class = ucfirst(strtolower($type));
        $file_type  = __DIR__ . '/classes/Control/' . $type_class . '.php';

        if ( ! file_exists($file_type)) {
            throw new Exception("Type '{$type_class}' not found");
        }

        require_once $file_type;

        $class_name = 'CoreUI\\Form\\Classes\\Control\\'.$type_class;
        if ( ! class_exists($class_name)) {
            throw new Exception("Type '{$type_class}' broken. Not found class");
        }

        $control = new $class_name($label, $name);
        $control->setResource($this->resource);
        $control->setToken($this->token);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';

        if ($name) {
            if (strpos($name, '[]') == strlen($name) - 2) {
                $name = substr($name, 0, -2);
            }
            $this->session->form->{$this->token}->controls[$name] = [
                'label' => $label,
                'type'  => $type,
            ];
        }

        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\Text
	 */
	public function addText($label, $name = '') {
        require_once __DIR__ . '/classes/Control/Text.php';
        $control = new Control\Text($label, $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';

        if ($name) {
            $this->session->form->controls[$name] = 'text';
        }

        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $html
	 * @return Control\Custom
	 */
	public function addCustom($label, $html) {
        require_once __DIR__ . '/classes/Control/Custom.php';
        $control = new Control\Custom($label, $html);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\Password
	 */
	public function addPassword($label, $name = '') {
        require_once __DIR__ . '/classes/Control/Password.php';
        $control = new Control\Password($label, $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'password';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\Email
	 */
	public function addEmail($label, $name = '') {
        require_once __DIR__ . '/classes/Control/Email.php';
        $control = new Control\Email($label, $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'email';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\Select
	 */
	public function addSelect($label, $name = '') {
        require_once __DIR__ . '/classes/Control/Select.php';
        $control = new Control\Select($label, $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'select';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\Radio
	 */
	public function addRadio($label, $name = '') {
        require_once __DIR__ . '/classes/Control/Radio.php';
        $control = new Control\Radio($label, $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'radio';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\Checkbox
	 */
	public function addCheckbox($label, $name = '') {
        require_once __DIR__ . '/classes/Control/Checkbox.php';
        $control = new Control\Checkbox($label, $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'checkbox';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\Captcha
	 */
	public function addCaptcha($label, $name = '') {
        require_once __DIR__ . '/classes/Control/Captcha.php';
        $control = new Control\Captcha($label, $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'captcha';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\Date
	 */
	public function addDate($label, $name = '') {
        require_once __DIR__ . '/classes/Control/Date.php';
        $control = new Control\Date($label, $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'date';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\Datetime
	 */
	public function addDatetime($label, $name = '') {
        require_once __DIR__ . '/classes/Control/Datetime.php';
        $control = new Control\Datetime($label, $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'datetime';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\File
	 */
	public function addFile($label, $name = '') {
        require_once __DIR__ . '/classes/Control/File.php';
        $control = new Control\File($label, $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'file';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\Upload
	 */
	public function addUpload($label, $name = '') {
        require_once __DIR__ . '/classes/Control/Upload.php';
        $control = new Control\Upload($label, $name);
        $control->setResource($this->resource);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'file_upload';
        }
        return $control;
    }


	/**
	 * @param  string $name
	 * @return Control\Hidden
	 */
	public function addHidden($name) {
        require_once __DIR__ . '/classes/Control/Hidden.php';
        $control = new Control\Hidden('', $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'hidden';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\Textarea
	 */
	public function addTextarea($label, $name = '') {
        require_once __DIR__ . '/classes/Control/Textarea.php';
        $control = new Control\Textarea($label, $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'textarea';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @param  string $config
	 * @return Control\Wysiwyg\Ckeditor
	 */
	public function addWysiwygCkeditor($label, $name = '', $config = 'basic') {
        require_once __DIR__ . '/classes/Control/Wysiwyg/Ckeditor.php';
        $control = new Control\Wysiwyg\Ckeditor($label, $name, $config);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'wysiwyg_ckeditor';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\Markdown
	 */
	public function addMarkdown($label, $name = '') {
        require_once __DIR__ . '/classes/Control/Markdown.php';
        $control = new Control\Markdown($label, $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'markdown';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @param  string $title
	 * @return Control\Modal
	 */
	public function addModal($label, $name = '', $title = '') {
        require_once __DIR__ . '/classes/Control/Modal.php';
        $control = new Control\Modal($label, $name, $title);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'modal';
        }
        return $control;
    }


	/**
	 * @param  string $label
	 * @param  string $name
	 * @return Control\Number
	 */
	public function addNumber($label, $name = '') {
        require_once __DIR__ . '/classes/Control/Number.php';
        $control = new Control\Number($label, $name);
        $this->positions[$this->current_position]['controls'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->controls[$name] = 'number';
        }
        return $control;
    }


	/**
	 * @param  string $title
	 * @return Button\Submit
	 */
	public function addSubmit($title) {
        require_once __DIR__ . '/classes/Button/Submit.php';
        $control = new Button\Submit($title);
        $this->positions[$this->current_position]['buttons'][] = $control;
        $this->current_position = 'default';
        return $control;
    }


	/**
	 * @param  string $title
	 * @return Button\Button
	 */
	public function addButton($title) {
        require_once __DIR__ . '/classes/Button/Button.php';
        $control = new Button\Button($title);
        $this->positions[$this->current_position]['buttons'][] = $control;
        $this->current_position = 'default';
        return $control;
    }


    /**
     * @param  string $name
     * @param  string $value
     * @param  string $active_value
     * @param  string $inactive_value
     * @param  bool   $default
     * @return Button\Switched
     */
	public function addButtonSwitched($name, $value, $active_value, $inactive_value, $default = true) {
        require_once __DIR__ . '/classes/Button/Switched.php';
        $control = new Button\Switched($name, $value, $active_value, $inactive_value, $default);
        $this->positions[$this->current_position]['buttons'][] = $control;
        $this->current_position = 'default';
        if ($name) {
            $this->session->form->{$this->token}->controls[$name] = [
                'type'  => 'button_switched',
            ];
        }
        return $control;
    }


	/**
	 * @param  string $title
	 * @return Button\Reset
	 */
	public function addReset($title) {
        require_once __DIR__ . '/classes/Button/Reset.php';
        $control = new Button\Reset($title);
        $this->positions[$this->current_position]['buttons'][] = $control;
        $this->current_position = 'default';
        return $control;
    }


	/**
	 * Создание формы
	 * @return string
	 */
	public function render() {

        $this->attributes['data-csrf-token'] = $this->token;
        $this->attributes['data-resource']   = $this->resource;


		$attributes = array();

		if ($this->ajax_request && ! isset($this->attributes['onsubmit'])) {
            $this->attributes['onsubmit'] = 'return combine.form.submit(this);';
		}

		if ( ! empty($this->attributes)) {
			foreach ($this->attributes as $attr_name => $value) {
                $attributes[] = "$attr_name=\"$value\"";
			}
		}


		if ( ! empty($this->positions)) {
            $template = $this->template;
			foreach ($this->positions as $name => $position) {
				$controls_html = '';
				if ( ! empty($position['controls'])) {
					foreach ($position['controls'] as $control) {
                        if ($control instanceof Control) {
                            $controls_html .= $control->render();
                        }
					}
				}
				$buttons_html = '';
				if ( ! empty($position['buttons'])) {
                    $buttons_controls = array();
					foreach ($position['buttons'] as $button) {
                        if ($button instanceof Button) {
                            $buttons_controls[] = $button->render();
                        }
					}

                    $buttons_wrapper = $this->buttons_wrapper !== null
                        ? $this->buttons_wrapper
                        : file_get_contents(__DIR__ . '/html/form/wrappers/button.html');

                    $buttons_html = str_replace('[BUTTONS]', implode(' ', $buttons_controls), $buttons_wrapper);
                    $buttons_html = str_replace('[RESOURCE]', $this->resource, $buttons_html);
				}

				$template = str_replace("[{$name}]", $controls_html . $buttons_html, $template);
			}
		} else {
			$template = '';
		}


        // Скрипты
        $scripts_js = array();
        $main_js = "{$this->theme_src}/html/js/form.js?theme_src={$this->theme_src}";
        if ( ! isset(self::$scripts_js[$main_js])) {
            self::$scripts_js[$main_js] = false;
            $scripts_js[] = "<script src=\"{$main_js}\"></script>";
        }

        // Стили
        $scripts_css = array();
        $main_css = "{$this->theme_src}/html/css/styles.css";
        if ( ! isset(self::$scripts_css[$main_css])) {
            self::$scripts_css[$main_css] = false;
            $scripts_css[] = "<link href=\"{$main_css}\" rel=\"stylesheet\"/>";
        }


        $form = file_get_contents(__DIR__ . '/html/template.html');

		$form = str_replace('[ATTRIBUTES]', implode(' ', $attributes), $form);
		$form = str_replace('[CONTROLS]',   $template, $form);
        $form = str_replace('[RESOURCE]',   $this->resource, $form);
        $form = str_replace('[CSS]',        implode('', $scripts_css), $form);
        $form = str_replace('[JS]',         implode('', $scripts_js), $form);


		return $form;
	}
}