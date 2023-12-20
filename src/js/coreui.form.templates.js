let tpl = Object.create(null)
tpl['form-error.html'] = '<div class="coreui-form__error alert alert-danger alert-dismissible fade show mb-3 <%= options.class %>"> <%- message %> <% if (options.dismiss) { %> <button type="button" class="btn-close" data-bs-dismiss="alert"></button> <% } %> </div>'
tpl['form-field-content.html'] = '<%- content %>'
tpl['form-field-group.html'] = '<div id="coreui-form-<%= id %>" class="coreui-form__group_container mb-3"> <div class="coreui-form__group_label pe-2"> <h6 class="coreui-form__field_label_text col-form-label"> <%- group.label %> <% if (group.showCollapsible) { %> <button type="button" class="btn btn-link btn-collapsible text-dark"> <% if ( ! group.show) { %> <i class="bi bi-chevron-right"></i> <% } else { %> <i class="bi bi-chevron-down"></i> <% } %> </button> <% } %> </h6> </div> <div class="coreui-form__group_content"<% if ( ! group.show) { %> style="display:none"<% } %>> <%- content %> </div> </div>'
tpl['form-field-label.html'] = '<div id="coreui-form-<%= id %>" class="coreui-form__field_container d-flex flex-column flex-md-row mb-3" <% if ( ! field.show) { %> style="display:none"<% } %>> <% if (field.labelWidth !== 0 && field.labelWidth !== \'0px\') { %> <div class="coreui-form__field_label text-md-end text-sm-start pe-2"<% if (field.labelWidth) { %> style="min-width:<%= field.labelWidth %>;width:<%= field.labelWidth %>"<% } %>> <div class="coreui-form__field_label_content col-form-label"> <% if (field.required) { %> <span class="coreui-form__field_label_req text-danger">*</span> <% } %> <span class="coreui-form__field_label_text fw-medium"><%- field.label %></span> </div> <% if (field.description) { %> <div class="coreui-form__field_label_description text-muted"> <small><%- field.description %></small> </div> <% } %> </div> <% } %> <div class="coreui-form__field_content flex-fill"> <div class="d-inline-block content-<%= hash %>"> <%- content %> </div> <% if (field.outContent) { %> <span class="coreui-form__field-content-out d-inline-block align-top ps-1"> <%- field.outContent %> </span> <% } %> <% if (attachFields && attachFields.length > 0) { %> <% $.each(attachFields, function(key, attachField) { %> <div class="<% if (attachField.hasOwnProperty(\'direction\') && attachField.direction === \'column\') { %>d-block mt-2<% } else { %>d-inline-block<% } %> content-<%= attachField.hash %>"> <%- attachField.content %> </div> <% }); %> <% } %> </div> </div>'
tpl['form.html'] = '<div id="coreui-form-<%= form.id %>" class="coreui-form mb-2" <% if (widthSizes) { %>style="<%= widthSizes.join(\';\') %>"<% } %>> <% if (form.title) { %> <h5 class="mb-4"><%- form.title %></h5> <% } %> <form action="<%= form.send.url %>" method="<%= form.send.method %>"<%- formAttr %>> <div class="coreui-form__fields d-flex justify-content-start flex-column flex-wrap"> <%- layout %> </div> <% if (controls) { %> <div class="coreui-form__controls d-flex justify-content-start flex-sm-wrap flex-md-nowrap"> <% if (form.controlsOffset !== 0 && form.controlsOffset !== \'0px\') { %> <div class="d-none d-md-block" style="width:<%= form.controlsOffset %>;min-width:<%= form.controlsOffset %>"></div> <% } %> <div class="d-flex justify-content-start flex-wrap gap-2"> <% $.each(controls, function(key, control) { %> <div id="coreui-form-<%= form.id %>-control-<%= control.index %>" class="coreui-form__control_container" <% if ( ! control.show) { %>style="display:none"<% } %>> <%- control.content %> </div> <% }); %> </div> </div> <% } %> </form> </div>'
tpl['controls/button.html'] = '<button <%- render.attr %>><%- control.content %></button>'
tpl['controls/link.html'] = '<a href="<%- control.href %>"<%- render.attr %>><%- control.content %></a>'
tpl['fields/checkbox.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly pt-2"><%- render.selectedItems.join(\', \') %></div> <% } else { %> <% $.each(render.options, function(key, option) { %> <div class="form-check<% if (field.inline) { %> form-check-inline<% } %>"> <input <%- option.attr %>/> <label class="form-check-label" for="<%= option.id %>"><%= option.text %></label> </div> <% }); %> <% } %>'
tpl['fields/color.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly pt-2 rounded-1" style="width: 14px;height: 14px;background-color: <%= value %>"></div> <% } else { %> <input <%- render.attr %>/> <% if (render.datalist.length > 0) { %> <datalist id="<%= datalistId %>"> <% $.each(render.datalist, function(key, item) { %> <option <%- item.attr %>/> <% }); %> </datalist> <% } %> <% } %>'
tpl['fields/custom.html'] = '<%- content %>'
tpl['fields/dataset-row-readonly.html'] = '<tr class="coreui-form__field-dataset-item"> <% $.each(options, function(key, option) { %> <td class="pe-2 pb-1"> <%- option.value %> </td> <% }); %> </tr>'
tpl['fields/dataset-row.html'] = '<tr class="coreui-form__field-dataset-item" id="dataset-item-<%= hashItem %>"> <% $.each(options, function(key, option) { %> <td class="pe-1 pb-1"> <% if (option.type === \'select\') { %> <select <%- option.attr %>> <% $.each(option.items, function(key, item) { %> <option <%- item.attr %>><%- item.title %></option> <% }); %> </select> <% } else if (option.type === \'switch\') { %> <div class="form-check form-switch"> <input <%- option.attr %>/> </div> <% } else { %> <input <%- option.attr %>> <% } %> </td> <% }); %> <td class="pb-1"> <button type="button" class="btn btn-link btn-dataset-remove" data-item-id="dataset-item-<%= hashItem %>"> <i class="bi bi-x text-muted"></i> </button> </td> </tr>'
tpl['fields/dataset.html'] = '<% if (field.readonly) { %> <table class="coreui-form__field-dataset-container" <% if (render.rows.length == 0) { %> style="display:none"<% } %>> <thead> <tr> <% $.each(render.headers, function(key, item) { %> <td class="text-muted pe-2"><small><%= item.title %></small></td> <% }); %> </tr> </thead> <tbody class="coreui-form__field-dataset-list"> <% $.each(render.rows, function(key, row) { %> <%- row %> <% }); %> </tbody> </table> <% } else { %> <table class="coreui-form__field-dataset-container" <% if (render.rows.length == 0) { %> style="display:none"<% } %>> <thead> <tr> <% $.each(render.headers, function(key, item) { %> <td class="text-muted"><small><%= item.title %></small></td> <% }); %> <td></td> </tr> </thead> <tbody class="coreui-form__field-dataset-list"> <% $.each(render.rows, function(key, row) { %> <%- row %> <% }); %> </tbody> </table> <button type="button" class="btn btn-link btn-dataset-add"><%= lang.dataset_add %></button> <% } %>'
tpl['fields/hidden.html'] = '<% if ( ! field.readonly) { %> <input <%- render.attr %>/> <% } %>'
tpl['fields/input.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly pt-2"><%- value %></div> <% } else { %> <input <%- render.attr %>/> <% if (render.datalist.length > 0) { %> <datalist id="<%= datalistId %>"> <% $.each(render.datalist, function(key, item) { %> <option <%- item.attr %>/> <% }); %> </datalist> <% } %> <% } %>'
tpl['fields/modal-loading.html'] = '<div class="py-4 d-flex justify-content-center align-items-center gap-2"> <div class="spinner-border mr-2"></div> <%= lang.modal_loading %> </div> '
tpl['fields/modal.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly pt-2"><%= text %></div> <% } else { %> <div class="input-group"<% if (render.width) { %> style="width:<%= render.width %>"<% } %>> <input <%- render.attr %>/> <input type="hidden" name="<%= field.name %>" value="<%= value %>" class="coreui-form-modal-value"/> <% if ( ! field.required) { %> <button class="btn btn-outline-secondary btn-modal-clear border-secondary-subtle" type="button"> <i class="bi bi-x"></i> </button> <% } %> <button class="btn btn-outline-secondary btn-modal-select border-secondary-subtle" type="button"><%= lang.modal_select %></button> </div> <% } %>'
tpl['fields/passwordRepeat.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly pt-2"><%- value %></div> <% } else { %> <div class="d-flex gap-1 align-items-center"> <input <%- render.attr %>/> <% if (field.showBtn) { %> <div class="input-group flex-nowrap"> <input <%- render.attr2 %>/> <button class="btn btn-outline-secondary border-secondary-subtle btn-password-change" type="button" data-change="<%- lang.change %>" data-cancel="<%- lang.cancel %>"><%= btn_text %></button> </div> <% } else { %> <input <%- render.attr2 %>/> <% } %> </div> <% } %>'
tpl['fields/radio.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly pt-2"><%- render.selectedItem %></div> <% } else { %> <% $.each(render.options, function(key, option) { %> <div class="form-check<% if (field.inline) { %> form-check-inline<% } %>"> <input <%- option.attr %>/> <label class="form-check-label" for="<%= option.id %>"><%= option.text %></label> </div> <% }); %> <% } %>'
tpl['fields/select.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly pt-2"><%= render.selectedOptions.join(\', \') %></div> <% } else { %> <select <%- render.attr %>> <% $.each(render.options, function(key, option) { %> <% if (option.type === \'group\') { %> <optgroup<%- option.attr %>/> <% $.each(option.options, function(key, groupOption) { %> <option <%- groupOption.attr %>/><%= groupOption.text %></option> <% }); %> </optgroup> <% } else { %> <option <%- option.attr %>/><%= option.text %></option> <% } %> <% }); %> </select> <% } %>'
tpl['fields/switch.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly pt-2"><%= field.valueY == value ? lang.switch_yes : lang.switch_no %></div> <% } else { %> <div class="form-check form-switch"> <input <%- render.attr %>/> </div> <% } %>'
tpl['fields/textarea.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly pt-2"><%- value %></div> <% } else { %> <textarea <%- render.attr %>><%- value %></textarea> <% } %>'
tpl['fields/wysiwyg.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly pt-2"><%- value %></div> <% } else { %> <textarea name="<%= field.name %>" id="editor-<%= editorHash %>"><%- value %></textarea> <% } %>';
export default tpl;