<?php
namespace CoreUI\Form;
use CoreUI\Handlers;
use CoreUI\Exception;
use CoreUI\Registry;
use CoreUI\Utils\Session\SessionNamespace;


/**
 * Class Handler
 * @package CoreUI
 */
class Handler extends Handlers {

    protected $lang      = '';
    protected $locutions = array(
        'ru' => array(
            'Пожалуйста, заполните обязательное поле "%s"' => 'Пожалуйста, заполните обязательное поле "%s"',
            'Пожалуйста, заполните обязательные поля'      => 'Пожалуйста, заполните обязательные поля',
            'В поле "%s" введен некорректный email'        => 'В поле "%s" введен некорректный email',
            'Введен некорректный email'                    => 'Введен некорректный email',
            'В поле "%s" введена некорректная дата'        => 'В поле "%s" введена некорректная дата',
            'В поле "%s" введен неверный формат даты'      => 'В поле "%s" введен неверный формат даты',
            'Введена некорректная дата'                    => 'Введена некорректная дата',
            'В поле "%s" введено некорректное число'       => 'В поле "%s" введено некорректное число',
            'Введено некорректное число'                   => 'Введено некорректное число',
        ),
        'en' => array(
            'Пожалуйста, заполните обязательное поле "%s"' => 'Please fill in the required field "%s"',
            'Пожалуйста, заполните обязательные поля'      => 'Please fill in the required fields',
            'В поле "%s" введен некорректный email'        => 'The field "%s" is invalid email',
            'Введен некорректный email'                    => 'Entered an incorrect email',
            'В поле "%s" введена некорректная дата'        => 'The field "%s" is invalid date',
            'В поле "%s" введен неверный формат даты'      => 'The field "%s" you enter the wrong date format',
            'Введена некорректная дата'                    => 'Enter the incorrect date',
            'В поле "%s" введено некорректное число'       => 'The field "%s" is invalid number',
            'Введено некорректное число'                   => 'Permission incorrect number',
        )
    );


    /**
     * Handler constructor.
     */
    public function __construct() {
        parent::__construct();
        $this->lang = Registry::getLanguage();
    }



    /**
     * @param  string $locution
     * @return mixed
     */
    protected function _($locution) {
        return isset($this->locutions[$this->lang][$locution])
            ? htmlspecialchars($this->locutions[$this->lang][$locution])
            : htmlspecialchars($locution);
    }


    /**
     * @param  string     $name
     * @return mixed|null
     */
    public function getSessData($name) {

        $session = new SessionNamespace($this->resource);
        if (isset($session->form) &&
            isset($session->form->{$this->token}) &&
            isset($session->form->{$this->token}->{$name})
        ) {
            return $session->form->{$this->token}->{$name};
        }
        return null;
    }


    /**
     * @return mixed
     */
    public function getRecordId() {

        $session = new SessionNamespace($this->resource);
        if (isset($session->form) &&
            isset($session->form->{$this->token}) &&
            isset($session->form->{$this->token}->record_id)
        ) {
            return $session->form->{$this->token}->record_id;
        }
        return null;
    }


    /**
     * @param  array $data
     * @return int
     * @throws Exception
     */
    public function saveData($data) {

        if ( ! $this->isValidRequest('form')) {
            throw new Exception('Not valid request');
        }

        $session = new SessionNamespace($this->resource);

        if (empty($session->form->{$this->token}->table)) {
            throw new Exception('Table empty');
        }

        $table = $session->form->{$this->token}->table;
        if ( ! is_string($table)) {
            throw new Exception('Table parameter not string');
        }

        if (empty($session->form->{$this->token}->primary_key)) {
            throw new Exception('Primary key empty');
        }

        $primary_key = $session->form->{$this->token}->primary_key;
        if ( ! is_string($primary_key) && ! is_numeric($primary_key)) {
            throw new Exception('Primary key not valid');
        }

        if (empty($data) || ! is_array($data)) {
            throw new Exception('Data not valid');
        }

        $record_id = $session->form->{$this->token}->record_id;
        if ($record_id) {
            $is_save = $this->db->update($table, $data, "{$primary_key} = {$record_id}");
        } else {
            $is_save = $this->db->insert($table, $data);
            $record_id  = $this->db->lastInsertId($table);
        }

        if ( ! $is_save) {
            throw new Exception('Error save data');
        }

        self::$response['status'] = 'success';

        return $record_id;
    }


    /**
     * Отсеевание необазначенных полей
     * @param array $data
     * @return array
     * @throws \CoreUI\Exception
     */
    public function filterControls(array $data) {
        $session = new SessionNamespace($this->resource);

        if (empty($session->form) ||
            empty($session->form->{$this->token}) ||
            empty($session->form->{$this->token}->controls)
        ) {
            throw new Exception('Empty controls');
        }

        foreach ($data as $name => $value) {
            if ( ! isset($session->form->{$this->token}->controls[$name])) {
                unset($data[$name]);
            }
        }

        return $data;
    }


    /**
     * @param array $data
     * @param array $fields
     * @return bool
     */
    public function validateControls($data, $fields = array()) {

        $is_valid = true;

        $controls = $this->getSessData('controls');

        if (empty($fields) && ! empty($controls)) {
            foreach ($controls as $name => $control) {
                $field = array();

                if (isset($control['required']) && $control['required']) {
                    $field[] = 'req';
                }
                if (in_array($control['type'], ['email', 'date', 'datetime'])) {
                    $field[] = $control['type'];

                } elseif ($control['type'] == 'number') {
                    $field[] = 'float';
                }

                if ( ! empty($field)) {
                    $fields[$name] = implode(',', $field);
                }
            }
        }


        if ( ! empty($fields)) {
            foreach ($fields as $field => $params_raw) {
                $params = explode(",", $params_raw);
                $label  = ! empty($controls[$field]) && ! empty($controls[$field]['label'])
                    ? $controls[$field]['label']
                    : '';

                if (empty($data[$field])) {
                    if (in_array("req", $params)) {
                        $is_valid = false;
                        $message  = $label
                            ? sprintf($this->_('Пожалуйста, заполните обязательное поле "%s"'), $label)
                            : $this->_('Пожалуйста, заполните обязательные поля');
                        $this->addError(['field' => $field, 'message' => $message]);
                    }

                } else {
                    if (in_array("email", $params)) {
                        if ( ! filter_input($data[$field], FILTER_VALIDATE_EMAIL)) {
                            $is_valid = false;
                            $message  = $label
                                ? sprintf($this->_('В поле "%s" введен некорректный email'), $label)
                                : $this->_('Введен некорректный email');
                            $this->addError(['field' => $field, 'message' => $message]);
                        }

                    } elseif (in_array("date", $params)) {
                        if ( ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $data[$field])) {
                            $is_valid = false;
                            $message  = $label
                                ? sprintf($this->_('В поле "%s" введен неверный формат даты'), $label)
                                : $this->_('Введен неверный формат даты');
                            $this->addError(['field' => $field, 'message' => $message]);

                        } else {
                            list($year, $month, $day) = sscanf($data[$field], '%d-%d-%d');
                            if ( ! checkdate($month, $day, $year)) {
                                $is_valid = false;
                                $message  = $label
                                    ? sprintf($this->_('В поле "%s" введена некорректная дата'), $label)
                                    : $this->_('Введена некорректная дата');
                                $this->addError(['field' => $field, 'message' => $message]);
                            }
                        }

                    } elseif (in_array("datetime", $params)) {
                        if ( ! preg_match('/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}(|:{1}\d{2}))$/', $data[$field])) {
                            $is_valid = false;
                            $message  = $label
                                ? sprintf($this->_('В поле "%s" введен неверный формат даты'), $label)
                                : $this->_('Введен неверный формат даты');
                            $this->addError(['field' => $field, 'message' => $message]);

                        } else {
                            list($year, $month, $day) = sscanf($data[$field], '%d-%d-%d');
                            if ( ! checkdate($month, $day, $year)) {
                                $is_valid = false;
                                $message  = $label
                                    ? sprintf($this->_('В поле "%s" введена некорректная дата'), $label)
                                    : $this->_('Введена некорректная дата');
                                $this->addError(['field' => $field, 'message' => $message]);
                            }
                        }

                    } elseif (in_array("float", $params)) {
                        if ( ! filter_input($data[$field], FILTER_VALIDATE_FLOAT)) {
                            $is_valid = false;
                            $message  = $label
                                ? sprintf($this->_('В поле "%s" введено некорректное число'), $label)
                                : $this->_('Введено некорректное число');
                            $this->addError(['field' => $field, 'message' => $message]);
                        }

                    } elseif (in_array("int", $params)) {
                        if ( ! filter_input($data[$field], FILTER_VALIDATE_INT)) {
                            $is_valid = false;
                            $message  = $label
                                ? sprintf($this->_('В поле "%s" введено некорректное число'), $label)
                                : $this->_('Введено некорректное число');
                            $this->addError(['field' => $field, 'message' => $message]);
                        }

                    }
                }
            }
        }

        return $is_valid;
    }


    /**
     * @throws Exception
     */
    public function uploadFile() {

        if ( ! $this->isValidRequest('form')) {
            throw new Exception('Not valid request');
        }

        if ( ! empty($_FILES['combine_upload'])) {
            if ($_FILES['combine_upload']['error']) {
                self::$response['status'] = 'error';
            } else {
                $new_name = sys_get_temp_dir() . '/' . uniqid('cms');
                rename($_FILES['combine_upload']['tmp_name'], $new_name);
                self::$response['tmp_name'] = $new_name;
                self::$response['filename'] = $_FILES['combine_upload']['name'];
            }

        } else {
            throw new Exception('Empty file');
        }
    }
}