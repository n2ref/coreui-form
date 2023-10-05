let tpl = Object.create(null)
tpl['form-error.html'] = '<div class="coreui-form__error alert alert-danger alert-dismissible fade show mb-3 <%= options.class %>">\n    <%- message %>\n    <% if (options.dismiss) { %>\n    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>\n    <% } %>\n</div>'
tpl['form-field-content.html'] = '<%- content %>'
tpl['form-field-group.html'] = '<div id="coreui-form-<%= id %>" class="coreui-form__group_container mb-3">\n    <div class="coreui-form__group_label pe-2">\n        <h6 class="coreui-form__field_label_text col-form-label-sm">\n            <%- group.label %>\n            <% if (group.showCollapsible) { %>\n                <button type="button" class="btn btn-sm btn-link btn-collapsible text-dark">\n                    <% if ( ! group.show) { %>\n                    <i class="bi bi-chevron-right"></i>\n                    <% } else { %>\n                    <i class="bi bi-chevron-down"></i>\n                    <% } %>\n                </button>\n            <% } %>\n        </h6>\n    </div>\n    <div class="coreui-form__group_content"<% if ( ! group.show) { %> style="display:none"<% } %>>\n        <%- content %>\n    </div>\n</div>'
tpl['form-field-label.html'] = '<div id="coreui-form-<%= id %>" class="coreui-form__field_container d-flex flex-column flex-md-row mb-3"\n     <% if ( ! field.show) { %> style="display:none"<% } %>>\n    <% if (field.labelWidth !== 0 && field.labelWidth !== \'0px\') { %>\n    <div class="coreui-form__field_label text-md-end text-sm-start pe-2"<% if (field.labelWidth) { %> style="min-width:<%= field.labelWidth %>;width:<%= field.labelWidth %>"<% } %>>\n        <div class="coreui-form__field_label_content col-form-label-sm">\n            <% if (field.required) { %>\n            <span class="coreui-form__field_label_req text-danger">*</span>\n            <% } %>\n            <span class="coreui-form__field_label_text fw-medium"><%- field.label %></span>\n        </div>\n\n        <% if (field.description) { %>\n        <div class="coreui-form__field_label_description text-muted">\n            <small><%- field.description %></small>\n        </div>\n        <% } %>\n    </div>\n    <% } %>\n    <div class="coreui-form__field_content flex-fill pt-1">\n        <div class="d-inline-block content-<%= hash %>">\n            <%- content %>\n        </div>\n\n        <% if (field.outContent) { %>\n        <span class="coreui-form__field-content-out d-inline-block align-top pt-1 ps-1">\n            <%- field.outContent %>\n        </span>\n        <% } %>\n\n        <% if (attachFields && attachFields.length > 0) { %>\n            <% $.each(attachFields, function(key, attachField) { %>\n                <div class="<% if (attachField.hasOwnProperty(\'direction\') && attachField.direction === \'column\') { %>d-block mt-2<% } else { %>d-inline-block<% } %> content-<%= attachField.hash %>">\n                    <%- attachField.content %>\n                </div>\n            <% }); %>\n        <% } %>\n    </div>\n</div>'
tpl['form.html'] = '<div id="coreui-form-<%= form.id %>" class="coreui-form mb-2"\n    <% if (widthSizes) { %>style="<%= widthSizes.join(\';\') %>"<% } %>>\n    <% if (form.title) { %>\n    <h5 class="mb-4"><%- form.title %></h5>\n    <% } %>\n\n    <form action="<%= form.send.url %>" method="<%= form.send.method %>"<%- formAttr %>>\n        <div class="coreui-form__fields d-flex justify-content-start flex-column flex-wrap">\n            <%- layout %>\n        </div>\n\n        <% if (controls) { %>\n        <div class="coreui-form__controls d-flex justify-content-start flex-sm-wrap flex-md-nowrap">\n            <% if (form.controlsOffset !== 0 && form.controlsOffset !== \'0px\') { %>\n            <div class="d-none d-md-block" style="width:<%= form.controlsOffset %>;min-width:<%= form.controlsOffset %>"></div>\n            <% } %>\n\n            <div class="d-flex justify-content-start flex-wrap gap-2">\n                <% $.each(controls, function(key, control) { %>\n                <div id="coreui-form-<%= form.id %>-control-<%= control.index %>" class="coreui-form__control_container"\n                     <% if ( ! control.show) { %>style="display:none"<% } %>>\n                    <%- control.content %>\n                </div>\n                <% }); %>\n            </div>\n        </div>\n        <% } %>\n    </form>\n</div>'
tpl['controls/button.html'] = '<button <%- render.attr %>><%- control.content %></button>'
tpl['controls/link.html'] = '<a href="<%- control.href %>"<%- render.attr %>><%- control.content %></a>'
tpl['fields/checkbox.html'] = '<% if (field.readonly) { %>\n    <%- render.selectedItems.join(\', \') %>\n<% } else { %>\n    <% $.each(render.options, function(key, option) { %>\n    <div class="form-check<% if (field.inline) { %> form-check-inline<% } %>">\n        <input <%- option.attr %>/>\n        <label class="form-check-label" for="<%= option.id %>"><%= option.text %></label>\n    </div>\n    <% }); %>\n<% } %>'
tpl['fields/color.html'] = '<% if (field.readonly) { %>\n    <div class="rounded-1" style="width: 14px;height: 14px;background-color: <%= value %>"></div>\n<% } else { %>\n    <input <%- render.attr %>/>\n\n    <% if (render.datalist.length > 0) { %>\n    <datalist id="<%= datalistId %>">\n        <% $.each(render.datalist, function(key, item) { %>\n        <option <%- item.attr %>/>\n        <% }); %>\n    </datalist>\n    <% } %>\n<% } %>'
tpl['fields/custom.html'] = '<%- content %>'
tpl['fields/dataset-row-readonly.html'] = '<tr class="coreui-form__field-dataset-item">\n    <% $.each(options, function(key, option) { %>\n        <td class="pe-2 pb-1">\n            <%- option.value %>\n        </td>\n    <% }); %>\n</tr>'
tpl['fields/dataset-row.html'] = '<tr class="coreui-form__field-dataset-item" id="dataset-item-<%= hashItem %>">\n    <% $.each(options, function(key, option) { %>\n        <td class="pe-1 pb-1">\n        <% if (option.type === \'select\') { %>\n            <select <%- option.attr %>>\n                <% $.each(option.items, function(key, item) { %>\n                <option <%- item.attr %>><%- item.title %></option>\n                <% }); %>\n            </select>\n        <% } else if (option.type === \'switch\') { %>\n            <div class="form-check form-switch">\n                <input <%- option.attr %>/>\n            </div>\n        <% } else { %>\n            <input <%- option.attr %>>\n        <% } %>\n        </td>\n    <% }); %>\n\n    <td class="pb-1">\n        <button type="button" class="btn btn-sm btn-link btn-dataset-remove" data-item-id="dataset-item-<%= hashItem %>">\n            <i class="bi bi-x text-muted"></i>\n        </button>\n    </td>\n</tr>'
tpl['fields/dataset.html'] = '<% if (field.readonly) { %>\n    <table class="coreui-form__field-dataset-container" <% if (render.rows.length == 0) { %> style="display:none"<% } %>>\n        <thead>\n            <tr>\n                <% $.each(render.headers, function(key, item) { %>\n                <td class="text-muted pe-2"><small><%= item.title %></small></td>\n                <% }); %>\n            </tr>\n        </thead>\n        <tbody class="coreui-form__field-dataset-list">\n            <% $.each(render.rows, function(key, row) { %>\n            <%- row %>\n            <% }); %>\n        </tbody>\n    </table>\n\n<% } else { %>\n    <table class="coreui-form__field-dataset-container" <% if (render.rows.length == 0) { %> style="display:none"<% } %>>\n        <thead>\n            <tr>\n                <% $.each(render.headers, function(key, item) { %>\n                <td class="text-muted"><small><%= item.title %></small></td>\n                <% }); %>\n                <td></td>\n            </tr>\n        </thead>\n        <tbody class="coreui-form__field-dataset-list">\n            <% $.each(render.rows, function(key, row) { %>\n                <%- row %>\n            <% }); %>\n        </tbody>\n    </table>\n\n    <button type="button" class="btn btn-sm btn-link btn-dataset-add"><%= lang.dataset_add %></button>\n<% } %>'
tpl['fields/hidden.html'] = '<% if ( ! field.readonly) { %>\n    <input <%- render.attr %>/>\n<% } %>'
tpl['fields/input.html'] = '<% if (field.readonly) { %>\n    <%- value %>\n<% } else { %>\n    <input <%- render.attr %>/>\n\n    <% if (render.datalist.length > 0) { %>\n    <datalist id="<%= datalistId %>">\n        <% $.each(render.datalist, function(key, item) { %>\n        <option <%- item.attr %>/>\n        <% }); %>\n    </datalist>\n    <% } %>\n<% } %>'
tpl['fields/modal-loading.html'] = '<div class="py-4 d-flex justify-content-center align-items-center gap-2">\n    <div class="spinner-border mr-2"></div> <%= lang.modal_loading %>\n</div>\n'
tpl['fields/modal.html'] = '<% if (field.readonly) { %>\n    <%= text %>\n<% } else { %>\n    <div class="input-group"<% if (render.width) { %> style="width:<%= render.width %>"<% } %>>\n        <input <%- render.attr %>/>\n        <input type="hidden" name="<%= field.name %>" value="<%= value %>" class="coreui-form-modal-value"/>\n        <% if ( ! field.required) { %>\n        <button class="btn btn-sm btn-outline-secondary btn-modal-clear border-secondary-subtle" type="button">\n            <i class="bi bi-x"></i>\n        </button>\n        <% } %>\n        <button class="btn btn-sm btn-outline-secondary btn-modal-select border-secondary-subtle" type="button"><%= lang.modal_select %></button>\n    </div>\n<% } %>'
tpl['fields/passwordRepeat.html'] = '<% if (field.readonly) { %>\n    <%- value %>\n<% } else { %>\n    <div class="d-flex gap-1 align-items-center">\n        <input <%- render.attr %>/>\n        <small class="password-text-repeat"><%= lang.repeat %></small>\n\n        <% if (field.showBtn) { %>\n            <div class="input-group flex-nowrap">\n                <input <%- render.attr2 %>/>\n                <button class="btn btn-sm btn-outline-secondary border-secondary-subtle btn-password-change" type="button"\n                        data-change="<%- lang.change %>" data-cancel="<%- lang.cancel %>"><%= btn_text %></button>\n            </div>\n        <% } else { %>\n            <input <%- render.attr2 %>/>\n        <% } %>\n\n    </div>\n<% } %>'
tpl['fields/radio.html'] = '<% if (field.readonly) { %>\n    <%- render.selectedItem %>\n<% } else { %>\n    <% $.each(render.options, function(key, option) { %>\n    <div class="form-check<% if (field.inline) { %> form-check-inline<% } %>">\n        <input <%- option.attr %>/>\n        <label class="form-check-label" for="<%= option.id %>"><%= option.text %></label>\n    </div>\n    <% }); %>\n<% } %>'
tpl['fields/select.html'] = '<% if (field.readonly) { %>\n    <%= render.selectedOptions.join(\', \') %>\n<% } else { %>\n    <select <%- render.attr %>>\n        <% $.each(render.options, function(key, option) { %>\n            <% if (option.type === \'group\') { %>\n                <optgroup<%- option.attr %>/>\n                <% $.each(option.options, function(key, groupOption) { %>\n                    <option <%- groupOption.attr %>/><%= groupOption.text %></option>\n                <% }); %>\n                </optgroup>\n            <% } else { %>\n            <option <%- option.attr %>/><%= option.text %></option>\n            <% } %>\n        <% }); %>\n    </select>\n<% } %>'
tpl['fields/switch.html'] = '<% if (field.readonly) { %>\n    <%= field.valueY == value ? lang.switch_yes : lang.switch_no %>\n<% } else { %>\n    <div class="form-check form-switch">\n        <input <%- render.attr %>/>\n    </div>\n<% } %>'
tpl['fields/textarea.html'] = '<% if (field.readonly) { %>\n    <%- value %>\n<% } else { %>\n    <textarea <%- render.attr %>><%- value %></textarea>\n<% } %>'
tpl['fields/wysiwyg.html'] = '<% if (field.readonly) { %>\n    <%- value %>\n<% } else { %>\n    <textarea name="<%= field.name %>" id="editor-<%= editorHash %>"><%- value %></textarea>\n<% } %>';
export default tpl;