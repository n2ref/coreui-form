
import coreuiForm from "./coreui.form";

import langEn from "./lang/en";
import langRu from "./lang/ru";

import Field   from "./abstract/Field";
import Control from "./abstract/Control";

import ControlButton from "./controls/button";
import ControlSubmit from "./controls/submit";
import ControlLink   from "./controls/link";
import ControlCustom from "./controls/custom";

import FieldCheckbox       from "./fields/checkbox";
import FieldCheckboxBtn    from "./fields/checkboxBtn";
import FieldColor          from "./fields/color";
import FieldCustom         from "./fields/custom";
import FieldDataset        from "./fields/dataset";
import FieldGroup          from "./fields/group";
import FieldHidden         from "./fields/hidden";
import FieldInput          from "./fields/input";
import FieldMask           from "./fields/mask";
import FieldModal          from "./fields/modal";
import FieldNumber         from "./fields/number";
import FieldRadio          from "./fields/radio";
import FieldRadioBtn       from "./fields/radioBtn";
import FieldRange          from "./fields/range";
import FieldSelect         from "./fields/select";
import FieldSwitch         from "./fields/switch";
import FieldTextarea       from "./fields/textarea";
import FieldWysiwyg        from "./fields/wysiwyg";
import FieldPasswordRepeat from "./fields/passwordRepeat";
import FieldFile           from "./fields/file";
import FieldFileUpload     from "./fields/fileUpload";



coreuiForm.lang.ru = langRu;
coreuiForm.lang.en = langEn;

coreuiForm.abstract.field   = Field;
coreuiForm.abstract.control = Control;

coreuiForm.controls.button = ControlButton;
coreuiForm.controls.submit = ControlSubmit;
coreuiForm.controls.link   = ControlLink;
coreuiForm.controls.custom = ControlCustom;

coreuiForm.fields.checkboxBtn    = FieldCheckboxBtn;
coreuiForm.fields.checkbox       = FieldCheckbox;
coreuiForm.fields.color          = FieldColor;
coreuiForm.fields.custom         = FieldCustom;
coreuiForm.fields.dataset        = FieldDataset;
coreuiForm.fields.group          = FieldGroup;
coreuiForm.fields.hidden         = FieldHidden;
coreuiForm.fields.input          = FieldInput;
coreuiForm.fields.mask           = FieldMask;
coreuiForm.fields.modal          = FieldModal;
coreuiForm.fields.number         = FieldNumber;
coreuiForm.fields.radio          = FieldRadio;
coreuiForm.fields.radioBtn       = FieldRadioBtn;
coreuiForm.fields.range          = FieldRange;
coreuiForm.fields.select         = FieldSelect;
coreuiForm.fields.switch         = FieldSwitch;
coreuiForm.fields.textarea       = FieldTextarea;
coreuiForm.fields.wysiwyg        = FieldWysiwyg;
coreuiForm.fields.passwordRepeat = FieldPasswordRepeat;
coreuiForm.fields.file           = FieldFile;
coreuiForm.fields.fileUpload     = FieldFileUpload;

export default coreuiForm;