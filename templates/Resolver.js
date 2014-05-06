define(['altair/facades/declare',
    'altair/mixins/_DeferredMixin',
    'altair/plugins/node!fs',
    'altair/plugins/node!path',
    'altair/facades/all',
    'lodash'
], function (declare, _DeferredMixin, fs, pathUtil, all, _) {

    return declare([_DeferredMixin], {

        /**
         * Finds you the templates that should be used for every property on as shema.
         * @param schema
         * @param templatePaths
         * @returns {altair.Deferred}
         */
        templatesFromSchema: function (schema, templatePaths) {

            var candidates = {},
                properties = schema.properties();

            _.each(properties, function (prop, name) {

                var _candidates = [];

                _.each(templatePaths, function (path) {

                    _candidates = _candidates.concat([
                        pathUtil.join(path, 'types', prop.type + '.ejs'),
                        pathUtil.join(path, 'property.ejs')
                    ]);

                });

                candidates[name] = this.resolveCandidates(_candidates);

            }, this);


            return all(candidates);

        },

        resolveCandidates: function (candidates) {

            var d           = new this.Deferred(),
                _candidates = _.clone(candidates),
                checkNext   = this.hitch(function (template) {


                    this.promise(fs, 'stat', template).then(function (stat) {

                        d.resolve(template);

                    }).otherwise(function () {

                        checkNext(_candidates.pop());

                    });


                });

            checkNext(_candidates.shift());


            return d;

        }

    });

});