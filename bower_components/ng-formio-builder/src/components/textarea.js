module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(formioComponentsProvider) {
      formioComponentsProvider.register('textarea', {
        icon: 'fa fa-font',
        views: [
          {
            name: 'Display',
            template: 'formio/components/textarea/display.html'
          },
          {
            name: 'Data',
            template: 'formio/components/textarea/data.html'
          },
          {
            name: 'Validation',
            template: 'formio/components/textfield/validate.html'
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
        documentation: 'http://help.form.io/userguide/#textarea'
      });
    }
  ]);
  app.controller('wysiwygSettings', ['$scope', function($scope) {
    $scope.wysiwygEnabled = !!$scope.component.wysiwyg;
    $scope.wysiwygSettings = $scope.wysiwygEnabled && typeof($scope.component.wysiwyg) == "object" ? $scope.component.wysiwyg: {
      toolbarGroups:  [
        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
        {name: 'links', groups: ['links']},
        {name: 'insert', groups: ['insert']},
        '/',
        {name: 'styles', groups: ['Styles', 'Format', 'Font', 'FontSize']},
        {name: 'colors', groups: ['colors']},
        {name: 'clipboard', groups: ['clipboard', 'undo']},
        {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
        {name: 'document', groups: ['mode', 'document', 'doctools']},
        {name: 'others', groups: ['others']},
        {name: 'tools', groups: ['tools']}
      ],
      extraPlugins: 'justify,font',
      removeButtons: 'Cut,Copy,Paste,Underline,Subscript,Superscript,Scayt,About',
      uiColor: '#eeeeee',
      height: '400px',
      width: '100%'
    };
    $scope.$watch('wysiwygEnabled', function(value) {
      $scope.component.wysiwyg = value ? $scope.wysiwygSettings : false;
    });
    $scope.$watch('wysiwygSettings', function(value) {
      if ($scope.wysiwygEnabled) {
        $scope.component.wysiwyg = value;
      }
    });
  }]);
  app.run([
    '$templateCache',
    function($templateCache) {
      // Create the settings markup.
      $templateCache.put('formio/components/textarea/display.html',
        '<ng-form>' +
          '<form-builder-option property="label"></form-builder-option>' +
          '<form-builder-option property="hideLabel"></form-builder-option>' +
          '<form-builder-option-label-position></form-builder-option-label-position>' +
          '<form-builder-option property="placeholder"></form-builder-option>' +
          '<form-builder-option property="description"></form-builder-option>' +
          '<form-builder-option property="rows"></form-builder-option>' +
          '<form-builder-option property="tooltip"></form-builder-option>' +
          '<form-builder-option property="errorLabel"></form-builder-option>' +
          '<form-builder-option property="inputMask"></form-builder-option>' +
          '<div ng-controller="wysiwygSettings">' +
            '<div class="checkbox">' +
              '<label><input type="checkbox" ng-model="wysiwygEnabled"> {{\'Enable WYSIWYG\' |??formioTranslate}}</label>' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="wysiwyg">{{\'WYSIWYG Settings\' |??formioTranslate}}</label>' +
              '<textarea class="form-control" rows="5" id="wysiwyg" ng-model="wysiwygSettings" json-input placeholder="Enter the CKEditor JSON configuration to turn this TextArea into a WYSIWYG."></textarea>' +
            '</div>' +
          '</div>' +
          '<form-builder-option property="prefix"></form-builder-option>' +
          '<form-builder-option property="suffix"></form-builder-option>' +
          '<form-builder-option property="customClass"></form-builder-option>' +
          '<form-builder-option property="tabindex"></form-builder-option>' +
          '<form-builder-option property="multiple"></form-builder-option>' +
          '<form-builder-option property="clearOnHide"></form-builder-option>' +
          '<form-builder-option property="spellcheck"></form-builder-option>' +
          '<form-builder-option property="protected"></form-builder-option>' +
          '<form-builder-option property="persistent"></form-builder-option>' +
          '<form-builder-option property="encrypted" class="form-builder-premium"></form-builder-option>' +
          '<form-builder-option property="autofocus"></form-builder-option>' +
          '<form-builder-option property="hidden"></form-builder-option>' +
          '<form-builder-option property="disabled"></form-builder-option>' +
          '<form-builder-option property="dataGridLabel"></form-builder-option>' +
          '<form-builder-option property="tableView"></form-builder-option>' +
        '</ng-form>'
      );

      $templateCache.put('formio/components/textarea/data.html',
        '<form-builder-option property="defaultValue"></form-builder-option>' +
        '<form-builder-option-input-format></form-builder-option-input-format>' +
        '<form-builder-option property="dbIndex" class="form-builder-premium form-builder-dbindex"></form-builder-option>' +
        '<uib-accordion>' +
        '  <div uib-accordion-group heading="Custom Default Value" class="panel panel-default">' +
        '    <uib-accordion>' +
        '      <div uib-accordion-group heading="JavaScript Default" class="panel panel-default" is-open="true">' +
        '        <formio-script-editor rows="5" id="customDefaultValue" name="customDefaultValue" ng-model="component.customDefaultValue" placeholder="/*** Example Code ***/\nvalue = data[\'mykey\'] + data[\'anotherKey\'];"></formio-script-editor>' +
        '        <small>' +
        '          <p>Enter custom default value code.</p>' +
        '          <p>You must assign the <strong>value</strong> variable as the result you want for the default value.</p>' +
        '          <p>The global variable <strong>data</strong> is provided, and allows you to access the data of any form component, by using its API key.</p>' +
        '          <p>Also <strong>moment</strong> library is available, and allows you to manipulate dates in a convenient way.</p>' +
        '          <p>Default Values are only calculated on form load. Use Calculated Value for a value that will update with the form.</p>' +
        '        </small>' +
        '      </div>' +
        '      <div uib-accordion-group heading="JSONLogic Default" class="panel panel-default">' +
        '        <small>' +
        '          <p>Execute custom default value using <a href="http://jsonlogic.com/">JSONLogic</a>.</p>' +
        '          <p>Submission data is available as JsonLogic variables, with the same api key as your components.</p>' +
        '          <p><a href="http://formio.github.io/formio.js/app/examples/calculated.html" target="_blank">Click here for an example</a></p>' +
        '        </small>' +
        '        <textarea class="form-control" rows="5" id="json" name="json" json-input ng-model="component.customDefaultValue" placeholder=\'{ ... }\'></textarea>' +
        '      </div>' +
        '    </uib-accordion>' +
        '  </div>' +
        '  <div uib-accordion-group heading="Calculated Value" class="panel panel-default">' +
        '    <uib-accordion>' +
        '      <div uib-accordion-group heading="JavaScript Value" class="panel panel-default" is-open="true">' +
        '        <formio-script-editor rows="5" id="calculateValue" name="calculateValue" ng-model="component.calculateValue" placeholder="/*** Example Code ***/\nvalue = data[\'mykey\'] + data[\'anotherKey\'];"></formio-script-editor>' +
        '        <small>' +
        '          <p>Enter code to calculate a value.</p>' +
        '          <p>You must assign the <strong>value</strong> variable as the result you want for the default value.</p>' +
        '          <p>The global variable <strong>data</strong> is provided, and allows you to access the data of any form component, by using its API key.</p>' +
        '          <p>Also <strong>moment</strong> library is available, and allows you to manipulate dates in a convenient way.</p>' +
        '        </small>' +
        '      </div>' +
        '      <div uib-accordion-group heading="JSONLogic Value" class="panel panel-default">' +
        '        <small>' +
        '          <p>Execute custom calculation logic with JSON and <a href="http://jsonlogic.com/">JSONLogic</a>.</p>' +
        '          <p>Submission data is available as JsonLogic variables, with the same api key as your components.</p>' +
        '          <p><a href="http://formio.github.io/formio.js/app/examples/calculated.html" target="_blank">Click here for an example</a></p>' +
        '        </small>' +
        '        <textarea class="form-control" rows="5" id="json" name="json" json-input ng-model="component.calculateValue" placeholder=\'{ ... }\'></textarea>' +
        '      </div>' +
        '    </uib-accordion>' +
        '    <form-builder-option property="calculateServer" type="checkbox" label="Calculate on server" tooltip="Perform these calculations on the server as well as the frontend."></form-builder-option>' +
        '  </div>' +
        '</uib-accordion>'
      );
    }
  ]);
};
