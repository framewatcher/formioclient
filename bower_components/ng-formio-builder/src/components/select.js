var _clone = require('lodash/clone');
module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(formioComponentsProvider) {
      formioComponentsProvider.register('select', {
        icon: 'fa fa-th-list',
        views: [
          {
            name: 'Display',
            template: 'formio/components/select/display.html'
          },
          {
            name: 'Data',
            template: 'formio/components/select/data.html'
          },
          {
            name: 'Validation',
            template: 'formio/components/select/validate.html'
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
        onEdit: ['$scope', 'FormioUtils', function($scope, FormioUtils) {
          $scope.dataSources = {
            values: 'Values',
            json: 'Raw JSON',
            url: 'URL',
            resource: 'Resource',
            custom: 'Custom'
          };
          $scope.resources = [];
          $scope.resourceFields = [];

          // Returns only input fields we are interested in.
          var getInputFields = function(components) {
            var fields = [];
            FormioUtils.eachComponent(components, function(component) {
              if (component.key && component.input && (component.type !== 'button') && component.key !== $scope.component.key) {
                var comp = _clone(component);
                if (!comp.label) {
                  comp.label = comp.key;
                }
                fields.push(comp);
              }
            });
            return fields;
          };

          $scope.formFields = [{label: 'Any Change', key: 'data'}].concat(getInputFields($scope.form.components));

          // Loads the selected fields.
          var loadFields = function() {
            if (!$scope.component.data.resource || ($scope.resources.length === 0)) {
              return;
            }
            var selected = null;
            $scope.resourceFields = [
              {
                property: '',
                title: '{Entire Object}'
              },
              {
                property: '_id',
                title: 'Submission Id'
              }
            ];
            if ($scope.formio.projectId) {
              $scope.component.data.project = $scope.formio.projectId;
            }
            for (var index in $scope.resources) {
              if ($scope.resources[index]._id.toString() === $scope.component.data.resource) {
                selected = $scope.resources[index];
                break;
              }
            }
            if (selected) {
              var fields = getInputFields(selected.components);
              for (var i in fields) {
                var field = fields[i];
                var title = field.label || field.key;
                $scope.resourceFields.push({
                  property: 'data.' + field.key,
                  title: title
                });
              }
              if (!$scope.component.valueProperty && $scope.resourceFields.length) {
                $scope.component.valueProperty = $scope.resourceFields[0].property;
              }
            }
          };

          $scope.$watch('component.dataSrc', function(source, prevSource) {
            if (source !== prevSource) {
              $scope.component.template = '<span>{{ item.label }}</span>';
            }

            if (($scope.resources.length === 0) && (source === 'resource')) {
              $scope.formio.loadForms({params: {
                type: 'resource',
                limit: 4294967295,
                select: '_id,title,components'
              }}).then(function(resources) {
                $scope.resources = resources;
                loadFields();
              });
            }
          });

          // Trigger when the resource changes.
          $scope.$watch('component.data.resource', function(resourceId) {
            if (!resourceId) {
              return;
            }
            loadFields();
          });

          // Update other parameters when the value property changes.
          $scope.currentValueProperty = $scope.component.valueProperty;
          $scope.$watch('component.valueProperty', function(property) {
            if ($scope.component.dataSrc === 'resource' && $scope.currentValueProperty !== property) {
              if (!property) {
                $scope.component.searchField = '';
                $scope.component.template = '<span>{{ item.data }}</span>';
              }
              else {
                $scope.component.searchField = property + '__regex';
                $scope.component.template = '<span>{{ item.' + property + ' }}</span>';
              }
            }
          });

          loadFields();
        }],
        documentation: 'http://help.form.io/userguide/#select'
      });
    }
  ]);
  app.run([
    '$templateCache',
    function($templateCache) {
      // Create the settings markup.
      $templateCache.put('formio/components/select/display.html',
        '<ng-form>' +
          '<form-builder-option property="label"></form-builder-option>' +
          '<form-builder-option property="hideLabel"></form-builder-option>' +
          '<form-builder-option-label-position></form-builder-option-label-position>' +
          '<form-builder-option property="placeholder"></form-builder-option>' +
          '<form-builder-option property="description"></form-builder-option>' +
          '<form-builder-option property="tooltip"></form-builder-option>' +
          '<form-builder-option property="errorLabel"></form-builder-option>' +
          '<form-builder-option property="customClass"></form-builder-option>' +
          '<form-builder-option property="tabindex"></form-builder-option>' +
          '<form-builder-option property="multiple"></form-builder-option>' +
          '<form-builder-option property="clearOnHide"></form-builder-option>' +
          '<form-builder-option property="protected"></form-builder-option>' +
          '<form-builder-option property="persistent"></form-builder-option>' +
          '<form-builder-option property="autofocus"></form-builder-option>' +
          '<form-builder-option property="encrypted" class="form-builder-premium"></form-builder-option>' +
          '<form-builder-option property="hidden"></form-builder-option>' +
          '<form-builder-option property="disabled"></form-builder-option>' +
          '<form-builder-option property="dataGridLabel"></form-builder-option>' +
          '<form-builder-option property="tableView"></form-builder-option>' +
        '</ng-form>'
      );

      $templateCache.put('formio/components/select/data.html',
        '<ng-form>' +
          '<div class="form-group">' +
            '<label for="dataSrc" form-builder-tooltip="The source to use for the select data. Values lets you provide your own values and labels. JSON lets you provide raw JSON data. URL lets you provide a URL to retrieve the JSON data from.">{{\'Data Source Type\' |??formioTranslate}}</label>' +
            '<select class="form-control" id="dataSrc" name="dataSrc" ng-model="component.dataSrc" ng-options="value as label | formioTranslate for (value, label) in dataSources"></select>' +
          '</div>' +
          '<ng-switch on="component.dataSrc">' +
            '<div class="form-group" ng-switch-when="json">' +
              '<label for="data.json" form-builder-tooltip="A raw JSON array to use as a data source.">{{\'Data Source Raw JSON\' |??formioTranslate}}</label>' +
              '<textarea class="form-control" id="data.json" name="data.json" ng-model="component.data.json" placeholder="Raw JSON Array" json-input rows="3">{{ component.data.json }}</textarea>' +
            '</div>' +
            '<div ng-switch-when="url">' +
            '  <form-builder-option property="data.url" label="Data Source URL" placeholder="Data Source URL" title="A URL that returns a JSON array to use as the data source."></form-builder-option>' +
            '</div>' +
            '<value-builder ng-switch-when="url" data=component.data.headers label="Request Headers" tooltip-text="Set any headers that should be sent along with the request to the url. This is useful for authentication." label-label="Key" label-property="key"></value-builder>' +
            '<value-builder ng-switch-when="values" data="component.data.values" label="Data Source Values" tooltip-text="Values to use as the data source. Labels are shown in the select field. Values are the corresponding values saved with the submission."></value-builder>' +
            '<div class="form-group" ng-switch-when="resource">' +
            '<label for="placeholder" form-builder-tooltip="The resource to be used with this field.">{{\'Resource\' |??formioTranslate}}</label>' +
            '<ui-select ui-select-required ui-select-open-on-focus ng-model="component.data.resource" theme="bootstrap">' +
              '<ui-select-match class="ui-select-match" placeholder="">' +
                '{{$select.selected.title}}' +
              '</ui-select-match>' +
              '<ui-select-choices class="ui-select-choices" repeat="value._id as value in resources | filter: $select.search" refresh="refreshSubmissions($select.search)" refresh-delay="250">' +
                '<div ng-bind-html="value.title | highlight: $select.search"></div>' +
              '</ui-select-choices>' +
            '</ui-select>' +
          '</div>' +
          '</ng-switch>' +
          '<form-builder-option ng-hide="component.dataSrc !== \'url\'" property="selectValues" label="Data Path" type="text" placeholder="The object path to the iterable items." title="The property within the source data, where iterable items reside. For example: results.items or results[0].items"></form-builder-option>' +
          '<form-builder-option ng-hide="component.dataSrc == \'values\' || component.dataSrc == \'resource\' || component.dataSrc == \'custom\'" property="valueProperty" label="Value Property" placeholder="The selected item\'s property to save." title="The property of each item in the data source to use as the select value. If not specified, the item itself will be used."></form-builder-option>' +
          '<div class="form-group" ng-hide="component.dataSrc !== \'resource\' || !component.data.resource || resourceFields.length == 0">' +
            '<label for="placeholder" form-builder-tooltip="The field to use as the value.">{{\'Value\' |??formioTranslate}}</label>' +
            '<select class="form-control" id="valueProperty" name="valueProperty" ng-options="value.property as value.title for value in resourceFields" ng-model="component.valueProperty"></select>' +
          '</div>' +
          '<div class="form-group" ng-if="component.dataSrc == \'resource\' && component.valueProperty === \'\'">' +
          '  <label for="placeholder" form-builder-tooltip="The properties on the resource to return as part of the options. Separate property names by commas. If left blank, all properties will be returned.">{{\'Select Fields\' |??formioTranslate}}</label>' +
          '  <input type="text" class="form-control" id="selectFields" name="selectFields" ng-model="component.selectFields" placeholder="Comma separated list of fields to select." value="{{ component.selectFields }}">' +
          '</div>' +
          '<div ng-show="component.dataSrc == \'url\'">' +
          '<input type="checkbox" ng-model="component.data.disableLimit" name="disableLimit"></input>' +
          '  <label for="disableLimit" form-builder-tooltip="When enabled the request will not include the limit and skip options in the query string">{{\'Disable limiting response\' |??formioTranslate}}</label>' +
          '</div>' +
          '<form-builder-option ng-show="component.dataSrc == \'url\' || component.dataSrc == \'resource\'" property="searchField" label="Search Query Name" placeholder="Name of URL query parameter" title="The name of the search querystring parameter used when sending a request to filter results with. The server at the URL must handle this query parameter."></form-builder-option>' +
          '<form-builder-option ng-show="component.dataSrc == \'url\' || component.dataSrc == \'resource\'" property="filter" label="Filter Query" placeholder="The filter query for results." title="Use this to provide additional filtering using query parameters."></form-builder-option>' +
          '<form-builder-option ng-show="component.dataSrc == \'url\' || component.dataSrc == \'resource\' || component.dataSrc == \'json\'" property="limit" label="Limit" placeholder="Maximum number of items to view per page of results." title="Use this to limit the number of items to request or view."></form-builder-option>' +
          '<div class="form-group" ng-show="component.dataSrc == \'json\'">' +
          '  <label for="filter" form-builder-tooltip="The filter type for search.">{{\'Search Filter\' |??formioTranslate}}</label>' +
          '  <select class="form-control" id="filter" name="filter" ng-model="component.filter" ng-options="value as label | formioTranslate for (value, label) in {none: \'No Search\', contains: \'Contains\', startsWith: \'Starts With\'}"></select>' +
          '</div>' +
          '<div class="form-group" ng-show="component.dataSrc == \'custom\'">' +
          '  <label for="custom" form-builder-tooltip="Write custom code to return the value options. The form data object is available.">{{\'Custom Values\' |??formioTranslate}}</label>' +
          '  <formio-script-editor rows="10" id="custom" name="custom" ng-model="component.data.custom" placeholder="/*** Example Code ***/\nvalues = data[\'mykey\'];"></formio-script-editor>' +
          '</div>' +
          '<div class="form-group">' +
            '<label for="placeholder" form-builder-tooltip="The HTML template for the result data items.">{{\'Item Template\' |??formioTranslate}}</label>' +
            '<textarea class="form-control" id="template" name="template" ng-model="component.template" rows="3">{{ component.template }}</textarea>' +
          '</div>' +
          '<div class="form-group" ng-hide="component.dataSrc == \'values\' || component.dataSrc == \'json\'">' +
          '  <label for="placeholder" form-builder-tooltip="Refresh data when another field changes.">{{\'Refresh On\' |??formioTranslate}}</label>' +
          '  <select class="form-control" id="refreshOn" name="refreshOn" ng-options="field.key as field.label for field in formFields" ng-model="component.refreshOn"></select>' +
          '</div>' +
          '<form-builder-option ng-show="component.dataSrc == \'resource\' || component.dataSrc == \'url\' || component.dataSrc == \'custom\'" property="clearOnRefresh"></form-builder-option>' +
          '<form-builder-option ng-show="component.dataSrc == \'resource\'" property="reference"></form-builder-option>' +
          '<form-builder-option ng-show="component.dataSrc == \'url\'" property="authenticate"></form-builder-option>' +
          '<form-builder-option property="defaultValue"></form-builder-option>' +
          '<form-builder-option property="dbIndex" class="form-builder-premium form-builder-dbindex"></form-builder-option>' +
        '</ng-form>'
      );

      // Create the API markup.
      $templateCache.put('formio/components/select/validate.html',
        '<ng-form>' +
          '<form-builder-option property="validate.required"></form-builder-option>' +
          '<form-builder-option ng-show="!!component.searchField" property="validate.select"></form-builder-option>' +
          '<form-builder-option property="unique"></form-builder-option>' +
          '<form-builder-option property="validate.customMessage"></form-builder-option>' +
          '<form-builder-option-custom-validation></form-builder-option-custom-validation>' +
        '</ng-form>'
      );
    }
  ]);
};
