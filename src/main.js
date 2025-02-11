
import Form from "./js/form";

import langEn from "./js/lang/en";
import langRu from "./js/lang/ru";

import Field   from "./js/abstract/Field";
import Control from "./js/abstract/Control";

import ControlButton from "./js/controls/button";
import ControlSubmit from "./js/controls/submit";
import ControlLink   from "./js/controls/link";
import ControlCustom from "./js/controls/custom";

import FieldCheckbox       from "./js/fields/checkbox";
import FieldCheckboxBtn    from "./js/fields/checkboxBtn";
import FieldColor          from "./js/fields/color";
import FieldCustom         from "./js/fields/custom";
import FieldDataset        from "./js/fields/dataset";
import FieldGroup          from "./js/fields/group";
import FieldHidden         from "./js/fields/hidden";
import FieldInput          from "./js/fields/input";
import FieldMask           from "./js/fields/mask";
import FieldModal          from "./js/fields/modal";
import FieldNumber         from "./js/fields/number";
import FieldRadio          from "./js/fields/radio";
import FieldRadioBtn       from "./js/fields/radioBtn";
import FieldRange          from "./js/fields/range";
import FieldSelect         from "./js/fields/select";
import FieldSwitch         from "./js/fields/switch";
import FieldTextarea       from "./js/fields/textarea";
import FieldWysiwyg        from "./js/fields/wysiwyg";
import FieldPasswordRepeat from "./js/fields/passwordRepeat";
import FieldFile           from "./js/fields/file";
import FieldFileUpload     from "./js/fields/fileUpload";



Form.lang.ru = langRu;
Form.lang.en = langEn;

Form.abstract.field   = Field;
Form.abstract.control = Control;

Form.controls.button = ControlButton;
Form.controls.submit = ControlSubmit;
Form.controls.link   = ControlLink;
Form.controls.custom = ControlCustom;

Form.fields.checkboxBtn    = FieldCheckboxBtn;
Form.fields.checkbox       = FieldCheckbox;
Form.fields.color          = FieldColor;
Form.fields.custom         = FieldCustom;
Form.fields.dataset        = FieldDataset;
Form.fields.group          = FieldGroup;
Form.fields.hidden         = FieldHidden;
Form.fields.input          = FieldInput;
Form.fields.mask           = FieldMask;
Form.fields.modal          = FieldModal;
Form.fields.number         = FieldNumber;
Form.fields.radio          = FieldRadio;
Form.fields.radioBtn       = FieldRadioBtn;
Form.fields.range          = FieldRange;
Form.fields.select         = FieldSelect;
Form.fields.switch         = FieldSwitch;
Form.fields.textarea       = FieldTextarea;
Form.fields.wysiwyg        = FieldWysiwyg;
Form.fields.passwordRepeat = FieldPasswordRepeat;
Form.fields.file           = FieldFile;
Form.fields.fileUpload     = FieldFileUpload;

export default Form;