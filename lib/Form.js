define(['altair/facades/declare',
    'altair/mixins/_DeferredMixin',
    'apollo/_HasSchemaMixin',
    'lodash'
], function (declare, _DeferredMixin, _HasSchemaMixin, _) {

    return declare([_DeferredMixin, _HasSchemaMixin], {

        _templateResolver: null,

        constructor: function (schema, values) {

        },

        renderableProperties: function () {

            var cleanedProps = {},
                props = _.map(this.schema().properties(), function (property, named) {

                    var prop = _.cloneDeep(property);
                    prop.name = named;

                    return prop;

                });

            //remove any property whose include is false
            props = _.remove(props, function (property) {

                if (!property.form || !_.has(property.form, 'include')) {
                    return true;
                }

                return property.form.include;

            });

            _.each(props, function (prop) {
                cleanedProps[prop.name] = prop;
            });

            return cleanedProps;

        },

        /**
         * Gets you templates looking in the paths you specify for all render-able properties
         *
         * @param paths
         */
        templates: function (paths) {

            var d, data, schema;

            if(!paths) {

                d = new this.Deferred();
                d.reject(new Error('You must pass the paths to Form.templates() so I know where to look for views.'));

                return d;

            }

            data = _.cloneDeep(this.schema().data());

            //replace properties with renderable ones
            data.properties = this.renderableProperties();

            //create a schema with renderable props
            schema = this.nexus('cartridges/Apollo').createSchema(data);

            //lazy load resolver
            if(this._templateResolver) {

                d = this._templateResolver.templatesFromSchema(schema, paths);

            } else {

                d = this.parent.forge('templates/Resolver').then(function (resolver) {

                    this._templateResolver = resolver;
                    return resolver.templatesFromSchema(schema, paths);

                });
            }

            return d;

        }

    });

});