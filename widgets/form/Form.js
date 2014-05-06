define(['altair/facades/declare',
        'altair/Lifecycle',
        'apollo/_HasSchemaMixin',
        'altair/facades/sprintf',
        'altair/facades/all',
        'lodash'
], function (declare,
             Lifecycle,
             _HasSchemaMixin,
             sprintf,
             all,
             _) {

    return declare([Lifecycle, _HasSchemaMixin], {

        getViewValues: function () {

            var schema      = this.get('formSchema');

            //load all templates for this schema
            return this.parent.templatesForSchema(schema, [this.dir + 'views']).then(this.hitch(function (templates) {

                var rows        = [],
                    row         = 0,
                    maxCols     = this.get('maxCols', 12),
                    colClass    = this.get('colClass', 'col-md-%d'),
                    currentCol  = 0,
                    rendered    = {},
                    properties  = _.map(schema.properties(), function (property, named) {

                        var prop = _.cloneDeep(property);
                        prop.name = named;

                        return prop;

                    });

                //remove any property whose include is false
                properties = _.remove(properties, function (property) {

                    if(!property.form || !_.has(property.form, 'include')) {
                        return true;
                    }

                    return property.form.include;

                });

                //split props into rows and drop in classes and templates, then render templates
                _.each(properties, function (prop) {

                    var cols = _.has(prop, 'form') ? prop.form.col : maxCols;

                    if(cols + currentCol > maxCols) {
                        row = row + 1;
                        currentCol = cols;
                    } else {
                        currentCol += cols;
                    }

                    if(!rows[row]) {
                        rows[row] = [];
                    }

                    prop.className  = sprintf(colClass, cols);
                    prop.template   = templates[prop.name];

                    rows[row].push(prop);

                    //give rendered version
                    rendered[prop.name] = this.parent.render(prop.template, prop);

                }, this);

                return all({
                    rows: rows, //properties in rows
                    rendered: all(rendered), //already rendered form elements
                    properties: properties //all properties in the order they are in the schema
                });

            }));



        }

    });

});