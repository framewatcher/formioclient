var _map = require('lodash/map');
module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(
      formioComponentsProvider
    ) {
      formioComponentsProvider.register('file', {
        onEdit: [
          '$scope',
          'Formio',
          function($scope, Formio) {
            // Pull out title and name from the list of storage plugins.
            $scope.storage = _map(Formio.providers.storage, function(storage, key) {
              return {
                title: storage.title,
                name: key
              };
            });
          }
        ],
        icon: 'fa fa-file',
        views: [
          {
            name: 'Display',
            template: 'formio/components/file/display.html'
          },
          {
            name: 'Validation',
            template: 'formio/components/file/validate.html'
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
        documentation: 'http://help.form.io/userguide/#file'
      });
    }
  ]);
  app.run([
    '$templateCache',
    function($templateCache) {
      // Create the settings markup.
      $templateCache.put('formio/components/file/display.html',
        '<ng-form>' +
          '<form-builder-option property="label"></form-builder-option>' +
          '<form-builder-option property="hideLabel"></form-builder-option>' +
          '<form-builder-option-label-position></form-builder-option-label-position>' +
          '<form-builder-option property="tooltip"></form-builder-option>' +
          '<div class="form-group">' +
            '<label for="storage" form-builder-tooltip="Which storage to save the files in.">{{\'Storage\' |¬†formioTranslate}}</label>' +
            '<select class="form-control" id="storage" name="storage" ng-options="store.name as store.title | formioTranslate for store in storage" ng-model="component.storage"></select>' +
          '</div>' +
          '<form-builder-option property="url" ng-show="component.storage === \'url\'"></form-builder-option>' +
          '<form-builder-option property="dir"></form-builder-option>' +
          '<form-builder-option property="image"></form-builder-option>' +
          '<form-builder-option property="imageSize" ng-if="component.image"></form-builder-option>' +
          '<form-builder-option property="filePattern"></form-builder-option>' +
          '<form-builder-option property="fileMinSize"></form-builder-option>' +
          '<form-builder-option property="fileMaxSize"></form-builder-option>' +
          '<form-builder-option property="customClass"></form-builder-option>' +
          '<form-builder-option property="tabindex"></form-builder-option>' +
          '<form-builder-option property="multiple"></form-builder-option>' +
          '<form-builder-option property="clearOnHide"></form-builder-option>' +
          '<form-builder-option property="protected"></form-builder-option>' +
          '<form-builder-option property="persistent"></form-builder-option>' +
          '<form-builder-option property="encrypted" class="form-builder-premium"></form-builder-option>' +
          '<form-builder-option property="hidden"></form-builder-option>' +
          '<form-builder-option property="autofocus"></form-builder-option>' +
          '<form-builder-option property="disabled"></form-builder-option>' +
          '<form-builder-option property="tableView"></form-builder-option>' +
        '</ng-form>'
      );

      $templateCache.put('formio/components/file/validate.html',
        '<ng-form>' +
          '<form-builder-option property="validate.required"></form-builder-option>' +
          '<form-builder-option property="validate.customMessage"></form-builder-option>' +
          '<form-builder-option property="validate.minItems" label="Min items" type="number"></form-builder-option>' +
          '<form-builder-option property="validate.maxItems" label="Max items" type="number"></form-builder-option>' +
        '</ng-form>'
      );
    }
  ]);
};
