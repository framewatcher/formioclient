module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(formioComponentsProvider) {
      formioComponentsProvider.register('checkbox', {
        icon: 'fa fa-check-square',
        onEdit: ['$scope', function($scope) {
          $scope.inputTypes = [
            {
              name: 'checkbox',
              title: 'Checkbox'
            },
            {
              name: 'radio',
              title: 'Radio'
            }
          ];

          $scope.labelPositions = [
            {
              value: 'top',
              title: 'Top'
            },
            {
              value: 'left',
              title: 'Left'
            },
            {
              value: 'right',
              title: 'Right'
            },
            {
              value: 'bottom',
              title: 'Bottom'
            }
          ];

          if (!$scope.component.labelPosition) {
            $scope.component.labelPosition = 'right';
          }
        }],
        views: [
          {
            name: 'Display',
            template: 'formio/components/checkbox/display.html'
          },
          {
            name: 'Data',
            template: 'formio/components/common/data.html'
          },
          {
            name: 'Validation',
            template: 'formio/components/checkbox/validate.html'
          },
          {
            name: 'API',
            template: 'formio/components/common/api.html'
          },
          {
            name: 'Layout',
            template: 'formio/components/common/layout.html'
          },
          {
            name: 'Conditional',
            template: 'formio/components/common/conditional.html'
          }
        ],
        documentation: 'http://help.form.io/userguide/#checkbox'
      });
    }
  ]);
  app.run([
    '$templateCache',
    function($templateCache) {
      // Create the settings markup.
      $templateCache.put('formio/components/checkbox/display.html',
        '<ng-form>' +
          '<form-builder-option property="label"></form-builder-option>' +
          '<form-builder-option property="hideLabel"></form-builder-option>' +
          '<div class="form-group">' +
            '<label for="labelPosition" form-builder-tooltip="Position for the label for this field.">{{\'Label Position\' |??formioTranslate}}</label>' +
            '<select class="form-control" id="labelPosition" name="labelPosition" ng-options="position.value as position.title | formioTranslate for position in labelPositions" ng-model="component.labelPosition"></select>' +
          '</div>' +
          '<form-builder-option property="tooltip"></form-builder-option>' +
          '<form-builder-option property="errorLabel"></form-builder-option>' +
          '<div class="form-group">' +
            '<label for="inputType" form-builder-tooltip="This is the input type used for this checkbox.">{{\'Input Type\' |??formioTranslate}}</label>' +
            '<select class="form-control" id="inputType" name="inputType" ng-options="inputType.name as inputType.title | formioTranslate for inputType in inputTypes" ng-model="component.inputType"></select>' +
          '</div>' +
          '<div class="form-group" ng-if="component.inputType === \'radio\'">' +
          '  <label for="name" form-builder-tooltip="The key used to trigger the radio button toggle.">{{\'Radio Key\' |??formioTranslate}}</label>' +
          '  <input type="text" class="form-control" id="name" name="name" ng-model="component.name" placeholder="{{ component.key }}" />' +
          '</div>' +
          '<div class="form-group" ng-if="component.inputType === \'radio\'">' +
          '  <label for="value" form-builder-tooltip="The value used with this radio button.">{{\'Radio Value\' |??formioTranslate}}</label>' +
          '  <input type="text" class="form-control" id="value" name="value" ng-model="component.value" placeholder="{{ component.value }}" />' +
          '</div>' +
          '<form-builder-option property="customClass"></form-builder-option>' +
          '<form-builder-option-shortcut></form-builder-option-shortcut>' +
          '<form-builder-option property="tabindex"></form-builder-option>' +
          '<form-builder-option property="clearOnHide"></form-builder-option>' +
          '<form-builder-option property="protected"></form-builder-option>' +
          '<form-builder-option property="persistent"></form-builder-option>' +
          '<form-builder-option property="encrypted" class="form-builder-premium"></form-builder-option>' +
          '<form-builder-option property="hidden"></form-builder-option>' +
          '<form-builder-option property="autofocus"></form-builder-option>' +
          '<form-builder-option property="disabled"></form-builder-option>' +
          '<form-builder-option property="dataGridLabel"></form-builder-option>' +
          '<form-builder-option property="tableView"></form-builder-option>' +
        '</ng-form>'
      );

      $templateCache.put('formio/components/checkbox/validate.html',
        '<ng-form>' +
          '<form-builder-option property="validate.required"></form-builder-option>' +
          '<form-builder-option property="validate.customMessage"></form-builder-option>' +
          '<form-builder-option-custom-validation></form-builder-option-custom-validation>' +
        '</ng-form>'
      );
    }
  ]);
};
