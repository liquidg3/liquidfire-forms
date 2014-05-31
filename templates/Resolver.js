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
         * @param fallbackPath
         * @returns {altair.Promise}
         */
        templatesFromSchema: function (schema, templatePaths, fallbackPath) {

            var candidates = {},
                properties = schema.properties(),
                apollo     = this.nexus('cartridges/Apollo');

            if(!fallbackPath) {
                throw new Error('You must pass a fallbackPath to you template resolver.');
            }

            _.each(properties, function (prop, name) {

                var _candidates = [],
                    template    = (prop.form) ? prop.form.template : false,
                    type        = apollo.propertyType(prop.type);

                //fallback goes in first (last in, first out)
                _candidates = _candidates.concat([
                    pathUtil.join(fallbackPath, 'property'),
                    pathUtil.join(fallbackPath, 'types', prop.type)
                ]);

                if(template && template.search(':') === -1) {

                    //they may be pointing to a view that is inside the fallbackPath
                    _candidates.push(pathUtil.join(fallbackPath, template));

                    //default paths (property.ejs, types/string.ejs)
                    _.each(templatePaths, function (path) {

                        //did they pass a template as prop.form.template and it's NOT a nexus id
                        _candidates.push(pathUtil.join(path, template));

                    });

                }

                //does this prop have a template()?
                if(type.template) {
                    _candidates = _candidates.concat(type.template(prop.options));
                }


                //is there a form.template specified in the schema?
                if(template && template.search(':') > 0) {

                    //set both absolute and relative paths
                    _candidates.push(this.resolvePath(template));

                }


                candidates[name] = this.nexus('liquidfire:Onyx').resolveCandidates(_candidates);

            }, this);


            return all(candidates);

        }



    });

});