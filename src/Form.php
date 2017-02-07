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

	protected $attributes       = ['method' => 'post'];
	protected $resource	 		= '';
	protected $template	 	    = '[default]';
	protected $current_position = 'default';
	protected $positions 	    = array();
	protected $ajax_request		= true;
	protected $readonly	        = false;
	protected $theme_src        = '';
    protected $theme_location   = '';
    protected $buttons_wrapper  = null;
    protected $token            = null;

    /**
     * @var SessionNamespace|null
     */
    protected $session = null;

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
        $this->theme_src = substr(__DIR__ . '/html', strlen($_SERVER['DOCUMENT_ROOT']));
        $this->token     = sha1(uniqid('coreui', true));

        $this->attributes['action'] = $_SERVER['REQUEST_URI'];

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
     * @param bool $readonly
     */
    public function setReadonly($readonly = true) {
        $this->readonly = (bool)$readonly;
    }


    /**
     * @return bool
     */
    public function isReadonly() {
        return $this->readonly;
    }


	/**
	 * @param  string     $name
	 * @param  string     $value
	 * @return self
	 * @throws Exception
	 */
	public function setAttr($name, $value) {

		if (is_string($name) && is_scalar($value)) {
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
	public function addButtonSwitched($name, $value, $active_value = 'Y', $inactive_value = 'N', $default = true) {
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


        // Стили
        $main_css = "{$this->theme_src}/css/styles.css";
        if ( ! isset(self::$scripts_css[$main_css])) {
            self::$scripts_css[$main_css] = true;
        }

        // Скрипты
        $main_js = "{$this->theme_src}/js/form.js?coreui_theme_src={$this->theme_src}";
        if ( ! isset(self::$scripts_js[$main_js])) {
            self::$scripts_js[$main_js] = true;
        }


		if ( ! empty($this->positions)) {
            $template = $this->template;
			foreach ($this->positions as $name => $position) {
				$controls_html = '';
				if ( ! empty($position['controls'])) {
					foreach ($position['controls'] as $control) {
                        if ($control instanceof Control) {
                            if ($this->readonly) {
                                $control->setReadonly(true);
                            }

                            if ($control->isRequired()) {
                                $control_name = $control->getName();
                                if ( ! empty($this->session->form->{$this->token}->controls[$control_name])) {
                                    $this->session->form->{$this->token}->controls[$control_name]['required'] = true;
                                }
                            }

                            $controls_html .= $control->render();

                            $control_css = $control->getCss();
                            if ( ! empty($control_css)) {
                                foreach ($control_css as $src => $is_cached) {
                                    if ( ! isset(self::$scripts_css[$src]) || ! $is_cached) {
                                        self::$scripts_css[$src] = true;
                                    }
                                }
                            }

                            $control_js = $control->getJs();
                            if ( ! empty($control_js)) {
                                foreach ($control_js as $src => $is_cached) {
                                    if ( ! isset(self::$scripts_js[$src]) || ! $is_cached) {
                                        self::$scripts_js[$src] = true;
                                    }
                                }
                            }
                        }
					}
				}
				$buttons_html = '';
				if ( ! empty($position['buttons'])) {
                    $buttons_controls = array();
					foreach ($position['buttons'] as $button) {
                        if ($button instanceof Button) {
                            if ($this->readonly) {
                                $button->setReadonly(true);
                            }

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



        $scripts_js = array();
        foreach (self::$scripts_js as $src => $is_add) {
            if ($is_add) {
                $scripts_js[] = "<script type=\"text/javascript\" src=\"{$src}\"></script>";
                self::$scripts_js[$src] = false;
            }
        }

        $scripts_css = array();
        foreach (self::$scripts_css as $src => $is_add) {
            if ($is_add) {
                $scripts_css[] = "<link type=\"text/css\" rel=\"stylesheet\" href=\"{$src}\"/>";
                self::$scripts_css[$src] = false;
            }
        }



        $form = file_get_contents(__DIR__ . '/html/template.html');

		$form = str_replace('[ATTRIBUTES]', implode(' ', $attributes), $form);
		$form = str_replace('[CONTROLS]',   $template,                 $form);
        $form = str_replace('[RESOURCE]',   $this->resource,           $form);
        $form = str_replace('[CSS]',        implode('', $scripts_css), $form);
        $form = str_replace('[JS]',         implode('', $scripts_js),  $form);


		return $form;
	}
}