define(['altair/facades/declare',
        'altair/mixins/_DeferredMixin',
        'apollo/Schema'

], function (declare,
             _DeferredMixin,
             Schema) {

    return declare([_DeferredMixin], {

        form: function (schema) {

            var _schema = schema;

            if(!_schema.isInstanceOf || !_schema.isInstanceOf(Schema)) {
                _schema = this.nexus('cartridges/Apollo').createSchema(schema);
            }

            return this.forge('lib/Form', _schema);


        },

        templatesForSchema: function (schema, templatePaths) {

            return this.forge('templates/Resolver').then(function (resolver) {

                return resolver.templatesFromSchema(schema, templatePaths);

            });

        }

    });

});