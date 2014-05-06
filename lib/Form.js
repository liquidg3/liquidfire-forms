define(['altair/facades/declare',
    'altair/mixins/_DeferredMixin',
    'apollo/_HasSchemaMixin'
], function (declare, _DeferredMixin, _HasSchemaMixin) {

    return declare([_DeferredMixin, _HasSchemaMixin], {

        constructor: function (schema, values) {


        },


        renderableProperties: function () {


        }

    });

});