define(['altair/facades/declare',
    'altair/mixins/_DeferredMixin',
    'altair/plugins/node!path',
    'altair/facades/all',
    'lodash'
], function (declare,
             _DeferredMixin,
             pathUtil,
             all,
             _) {

    return declare([_DeferredMixin], {

        /**
         * Finds you the templates that should be used for every property on as schema.
         *
         * @param schema
         * @param templatePaths
         * @returns {altair.Deferred}
         */
        templatesFromSchema: function (schema, templatePaths) {

            var candidates = {},
                properties = schema.properties(),
                apollo     = this.nexus('cartridges/Apollo');

            _.each(properties, function (prop, name) {

                var _candidates = [],
                    type        = apollo.propertyType(prop.type);

                _.each(templatePaths, function (path) {

                    _candidates = _candidates.concat([
                        pathUtil.join(path, 'property'),
                        pathUtil.join(path, 'types', prop.type)
                    ]);

                });

                //does this prop have a template?
                if(type.template) {
                    _candidates = _candidates.concat(type.template(prop.options));
                }

                candidates[name] = this.nexus('liquidfire:Onyx').resolveCandidates(_candidates);

            }, this);


            return all(candidates);

        }



    });

});