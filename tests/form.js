/**
 * Allow us to run some nexus tests
 */

define(['doh/runner',
    'core/tests/support/boot',
    'altair/plugins/node!path'],

    function (doh, boot, pathUtil) {


        var cartridges = [
                {
                    path:    'altair/cartridges/apollo/Apollo',
                    options: {
                    }
                },
                {
                    path:    'altair/cartridges/nexus/Nexus',
                    options: {
                    }
                },
                {
                    path:    'altair/cartridges/database/Database',
                    options: {
                    }
                },
                {
                    path:    'altair/cartridges/module/Module',
                    options: {
                        modules:       [
                            'liquidfire:Forms',
                            'liquidfire:Onyx',
                            'titan:Alfred',
                            'altair:CommandCentral',
                            'altair:Adapters',
                            'altair:Events'
                        ],
                        moduleOptions: {
                            'altair:CommandCentral': {
                                'autostart': 0
                            }
                        }
                    }
                },
                {
                    path:    'altair/cartridges/extension/Extension',
                    options: {
                        extensions: [
                            'altair/cartridges/extension/extensions/Paths',
                            'altair/cartridges/extension/extensions/Config',
                            'altair/cartridges/extension/extensions/Package',
                            'altair/cartridges/extension/extensions/Deferred',
                            'altair/cartridges/extension/extensions/Apollo',
                            'altair/cartridges/extension/extensions/Log',
                            'altair/cartridges/extension/extensions/Nexus',
                            'altair/cartridges/extension/extensions/Events',
                            'altair/cartridges/extension/extensions/Foundry'
                        ]
                    }
                }
            ],
            altairOptions = {
                paths: [
                    'app',
                    'community',
                    'core'
                ]
            },
            formSchema = {
                properties: {
                    firstName: {
                        type:    'string',
                        options: {
                            label:     'First Name',
                            'default': 'Taylor'
                        }
                    }
                }
            };


        doh.register('forms', {

            'test creating form and setting values': function (t) {

                return boot.nexus(cartridges, altairOptions).then(function (nexus) {

                    var forms = nexus('liquidfire:Forms');

                    return forms.formForSchema(formSchema);


                }).then(function (form) {

                    t.is('Taylor', form.get('firstName'), 'Form schema set wrong');

                    form.set('firstName', 'becca');

                    t.is('becca', form.get('firstName'), 'Form set() not working');

                });

            },

            'test creating form and generate templates': function (t) {

                return boot.nexus(cartridges, altairOptions).then(function (nexus) {

                    var forms = nexus('liquidfire:Forms');

                    return forms.form(formSchema);


                }).then(function (form) {

                    return form.templates();

                });

            }


        });


    });