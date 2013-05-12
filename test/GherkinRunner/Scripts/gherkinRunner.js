/// <reference path="knockout-2.2.1.debug.js" />
define(function () {
    var _this = {};
    _this.escapeRegex = function (text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    _this.featureSets = [];
    _this.addFeatureSet = function (featureSet) {
        _this.featureSets[_this.featureSets.length] = featureSet;
    };
    _this.runTests = false;
    _this.run = function () {
        require.onError = function (error) {
            return true;
        };
        _this.runTests = _this.getURLParameter('run').toLowerCase() === 'true';
        var dfd = $.Deferred();
        $(document).ready(function () {
            _this.loadFeatureSets(_this.featureSets).then(function () {
                _this.runFeatureSets(_this.featureSets).then(function () {
                    _this.setupAndExecuteJasmine();
                    dfd.resolve();
                });
            });
        });
        return dfd.promise();
    };
    _this.loadFeatureSets = function (featureSets) {
        featureSets = featureSets || [];
        var dfd = $.Deferred();
        var featureSetCount = featureSets.length;
        if (featureSetCount == 0)
            dfd.resolve();
        else
            $.each(featureSets, function (index, featureSetName) {
                require([featureSetName], function (featureSet) {
                    featureSets[index] = featureSet;
                    _this.loadFeatureSet(featureSet).then(function () {
                        featureSetCount--;
                        if (featureSetCount == 0) {
                            dfd.resolve();
                        }
                    });
                });
            });
        return dfd.promise();
    };
    _this.loadFeatureSet = function (featureSet) {
        featureSet.features = featureSet.features || [];
        featureSet.featureSets = featureSet.featureSets || [];
        featureSet.name = featureSet.name || "Unnamed Feature Set";
        var dfd = $.Deferred();
        if (featureSet.featureSets.length == 0)
            _this.loadFeatures(featureSet.features).then(function () {
                dfd.resolve();
            });
        else
            _this.loadFeatureSets(featureSet.featureSets).then(function () {
                _this.loadFeatures(featureSet.features).then(function () {
                    dfd.resolve();
                });
            });
        return dfd.promise();
    };
    _this.loadFeatures = function (features) {
        features = features || [];
        var dfd = $.Deferred();
        var featureCount = features.length;
        if (featureCount == 0)
            dfd.resolve();
        else
            $.each(features, function (index, featureName) {
                var folders = featureName.split("/");
                var currentFolder = "";
                var libraries = [];
                $.each(folders, function (index, folder) {
                    if (index != folders.length - 1) {
                        currentFolder = currentFolder + folder + "/";
                        libraries[folders.length - 2 - index] = currentFolder + "library";
                    }
                });
                require(["Scripts/text!" + featureName + ".html"], function (featureText) {
                    require(libraries, function () {
                        features[index] = _this.loadFeature(featureText, arguments);
                        featureCount--;
                        if (featureCount == 0)
                            dfd.resolve();
                    });
                });
            });
        return dfd.promise();
    };
    _this.loadFeature = function (featureText, libraries) {
        var feature = _this.parseFeature(featureText);
        feature.libraries = libraries || [];
        return feature;
    };
    _this.runFeatureSets = function (featureSets) {
        featureSets = featureSets || [];
        var dfd = $.Deferred();
        var featureSetCount = featureSets.length;
        if (featureSetCount == 0)
            dfd.resolve();
        else
            $.each(featureSets, function (index, featureSet) {
                _this.runFeatureSet(featureSet).then(function () {
                    featureSetCount--;
                    if (featureSetCount == 0) {
                        dfd.resolve();
                    }
                });
            });
        return dfd.promise();
    };
    _this.runFeatureSet = function (featureSet) {
        featureSet.features = featureSet.features || [];
        featureSet.featureSets = featureSet.featureSets || [];
        featureSet.name = featureSet.name || "Unnamed Feature Set";
        var dfd = $.Deferred();
        describe("Feature Set: " + featureSet.name, function () {
            if (featureSet.featureSets.length == 0)
                _this.runFeatures(featureSet.features).then(function () {
                    dfd.resolve();
                });
            else
                _this.runFeatureSets(featureSet.featureSets).then(function () {
                    _this.runFeatures(featureSet.features).then(function () {
                        dfd.resolve();
                    });
                });
        });
        return dfd.promise();
    };
    _this.runFeatures = function (features) {
        features = features || [];
        var dfd = $.Deferred();
        var featureCount = features.length;
        if (featureCount == 0)
            dfd.resolve();
        else
            $.each(features, function (index, feature) {
                _this.runFeature(feature);
                featureCount--;
                if (featureCount == 0)
                    dfd.resolve();
            });
        return dfd.promise();
    };
    _this.runFeature = function (feature) {
        describe("Feature: " + feature.name, function () {
            if (feature.description) {
                $.each(feature.description, function (index, descriptionLine) {
                    it(descriptionLine, function () {
                        expect(true).toBe(true);
                    });
                });
            }
            var print = true;

            feature.state = {};
            feature.feature = feature;
            _this.runFeatureBackgrounds(feature, feature);

            var contextScenario = {};
            contextScenario.state = {};
            contextScenario.feature = feature;
            _this.runScenarioBackgrounds(feature, contextScenario, print);

            $.each(feature.scenarios, function (index, scenario) {
                _this.runScenario(feature, scenario);
            });
        });
    };
    _this.runFeatureBackgrounds = function (feature, context, print) {
        if (feature.featureBackgrounds.length > 0) {
            $.each(feature.featureBackgrounds, function (index, background) {
                _this.runBackground(feature, background, context, print);
            });
        }
    };
    _this.runScenario = function (feature, scenario) {
        describe((scenario.outline ? "Scenario Outline: " : "Scenario: ") + scenario.name, function () {
            var context = {};
            context.feature = feature;
            context.scenario = scenario;
            context.state = {};
            context.state = $.extend(true, {}, feature.state, context.state);
            _this.checkScenarioSteps(scenario, context);
            if (scenario.outline) {
                $.each(scenario.steps, function (index, step) {
                    _this.printStep(step, context);
                });
                _this.runExamples(feature, scenario, context);
            } else {
                if (_this.runTests)
                    _this.runScenarioBackgrounds(feature, context);
                $.each(scenario.steps, function (index, step) {
                    _this.runStep(step, context);
                });
            }
        });
    };
    _this.runScenarioBackgrounds = function (feature, context, print) {
        if (feature.scenarioBackgrounds.length > 0) {
            $.each(feature.scenarioBackgrounds, function (index, background) {
                _this.runBackground(feature, background, context, print);
            });
        }
    };
    _this.runBackground = function (feature, background, context, print) {
        describe((background.level == 'feature' ? 'Feature' : 'Scenario') + " Background" + (background.outline?' Outline: ':': ') + background.name, function () {
            _this.checkScenarioSteps(background, context);
            if (background.outline) {
                $.each(background.steps, function (index, step) {
                    _this.printStep(step, context);
                });
                _this.runExamples(feature, background, context);
            } else {
                $.each(background.steps, function (index, step) {
                    _this.runStep(step, context, print);
                });
            }
        });
    };
    _this.checkScenarioSteps = function (scenario, context) {
        $.each(scenario.steps, function (index, step) {
            _this.setStepMethod(step, context.feature);
            if (!step.method) {
                context.aborted = true;
            }
        });
    };
    _this.runStep = function (step, context, print) {
        if (step.method) {
            if (context.aborted || !_this.runTests)
                it("SKIPPED: " + step.name, function () { });
            else
                if (print)
                    it(step.name, function () { });
                else {
                    var name = step.name;
                    if (context.scenario && context.scenario.exampleArgColumns)
                        $.each(context.scenario.exampleArgColumns, function (index, col) {
                            if (col) {
                                name = name.replace('<' + col.trim() + '>', '"' + context.exampleArg[col.trim()] + '"')
                            }
                        });
                    it(name, function () {
                        var dfd = $.Deferred();
                        context.step = step;
                        runs(function () {
                            if (context.aborted)
                                dfd.reject();
                            try {
                                context.state = $.extend(true, {}, context.feature.state, context.state);
                                step.method(context, dfd, context.state, context.step.inlineArgs, context.step.tableArg, context.exampleArg);
                            }
                            catch (error) {
                                context.error = error;
                                dfd.reject();
                            }
                        });
                        waitsFor(function () {
                            return dfd.state() != 'pending' || context.aborted;
                        }, "Running step timeout.", 10000);
                        runs(function () {
                            if (dfd.state() != 'resolved' || context.aborted) {
                                if (!context.aborted) {
                                    if (!context.error) {
                                        throw new Error('STEP REJECTED: ' + step.name)
                                        context.aborted = true;
                                    }
                                    else {
                                        context.aborted = true;
                                        throw context.error;
                                    }
                                } else {
                                    throw new Error('STEP ABORTED: ' + step.name)
                                }
                            }
                        });
                    });
                }
        } else {
            it("MISSING: " + step.name, function () {
                expect(false).toBe(true);
            });
        }
        if (step.tableArg.length > 0)
            _this.printTableArgument(step);
    };
    _this.printTableArgument = function (step) {
        it(' | ' + step.tableArgColumns.join(' | ') + ' | ', function () { });
        $.each(step.tableArg, function (index, argsObj) {
            var dataArray = new Array;
            for (var o in argsObj) {
                dataArray.push(argsObj[o]);
            }
            it(' | ' + dataArray.join(' | ') + ' | ', function () { });
        });
    };
    _this.runExamples = function (feature, scenario, context) {
        describe("Examples:", function () {
            it(' | ' + scenario.exampleArgColumns.join(' | ') + ' | ', function () { });
            $.each(scenario.examples, function (index, exampleArg) {
                var context = {};
                context.feature = feature;
                context.exampleArg = exampleArg;
                context.scenario = scenario;
                _this.runExample(feature, scenario, context);
            });
        });
    };
    _this.runExample = function (feature, scenario, context) {
        var dataArray = new Array;
        for (var o in context.exampleArg) {
            dataArray.push(context.exampleArg[o]);
        }
        if (_this.runTests) {
            describe(' | ' + dataArray.join(' | ') + ' | ', function () {
                _this.runScenarioBackgrounds(feature, context);
                $.each(scenario.steps, function (index, step) {
                    _this.runStep(step, context);
                });
            });
        } else {
            it(' | ' + dataArray.join(' | ') + ' | ', function () { });
        }
    };
    _this.printStep = function (step, context) {
        if (step.method) {
            if (context.aborted || !_this.runTests)
                it("SKIPPED: " + step.name, function () { });
            else
                it(step.name, function () { });
        } else {
            it("MISSING: " + step.name, function () {
                expect(false).toBe(true);
            });
        }
    };
    _this.parseFeature = function (featureText) {
        var lines = featureText.split('\n');
        var featureLastRead = false;
        var scenarioOrBackground = false;
        var exampleLastRead = false;
        var descriptionCount = 0;
        var scenarioCount = 0;
        var stepCount = 0;
        var argumentLineCount = 0;
        var scenarioBackgroundCount = 0;
        var featureBackgroundCount = 0;
        var feature = {};
        $.each(lines, function (index, line) {
            line = line.trim();
            if (line.length > 0) {
                if (line.toLowerCase().indexOf("feature:") > -1) {
                    feature.name = line.substr(9, line.length - 9);
                    feature.description = [];
                    feature.scenarios = [];
                    feature.scenarioBackgrounds = [];
                    feature.featureBackgrounds = [];
                    featureLastRead = true;
                    exampleLastRead = false;
                    scenarioCount = 0;
                } else if (line.toLowerCase().indexOf("scenario:") > -1 || line.toLowerCase().indexOf("scenario outline:") > -1) {
                    var scenario = {};
                    scenario.steps = [];
                    scenario.examples = [];
                    if (line.toLowerCase().indexOf("scenario:") > -1)
                        scenario.name = line.trim().substr(10, line.length - 10);
                    else {
                        scenario.name = line.trim().substr(18, line.length - 18);
                        scenario.outline = true;
                    }
                    feature.scenarios[scenarioCount] = scenario;
                    scenarioCount++;
                    stepCount = 0;
                    argumentLineCount = 0;
                    featureLastRead = false;
                    exampleLastRead = false;
                    scenarioOrBackground = scenario;
                } else if (line.toLowerCase().indexOf("examples:") > -1) {
                    exampleLastRead = true;
                    argumentLineCount = 0;
                } else if (line.toLowerCase().indexOf("scenario background:") > -1) {
                    var background = {};
                    background.level = 'scenario';
                    background.steps = [];
                    background.examples = [];
                    background.name = line.trim().substr(20, line.length - 20);
                    feature.scenarioBackgrounds[scenarioBackgroundCount] = background;
                    scenarioBackgroundCount++;
                    stepCount = 0;
                    argumentLineCount = 0;
                    featureLastRead = false;
                    exampleLastRead = false;
                    scenarioOrBackground = background;
                } else if (line.toLowerCase().indexOf("scenario background outline:") > -1) {
                    var background = {};
                    background.level = 'scenario';
                    background.steps = [];
                    background.examples = [];
                    background.outline = true;
                    background.name = line.trim().substr(28, line.length - 28);
                    feature.scenarioBackgrounds[scenarioBackgroundCount] = background;
                    scenarioBackgroundCount++;
                    stepCount = 0;
                    argumentLineCount = 0;
                    featureLastRead = false;
                    exampleLastRead = false;
                    scenarioOrBackground = background;
                } else if (line.toLowerCase().indexOf("feature background:") > -1) {
                    var background = {};
                    background.level = 'feature';
                    background.steps = [];
                    background.examples = [];
                    background.name = line.trim().substr(19, line.length - 19);
                    feature.featureBackgrounds[featureBackgroundCount] = background;
                    featureBackgroundCount++;
                    stepCount = 0;
                    argumentLineCount = 0;
                    featureLastRead = false;
                    exampleLastRead = false;
                    scenarioOrBackground = background;
                } else if (line.toLowerCase().indexOf("feature background outline:") > -1) {
                    var background = {};
                    background.level = 'feature';
                    background.steps = [];
                    background.examples = [];
                    background.outline = true;
                    background.name = line.trim().substr(26, line.length - 26);
                    feature.featureBackgrounds[featureBackgroundCount] = background;
                    featureBackgroundCount++;
                    stepCount = 0;
                    argumentLineCount = 0;
                    featureLastRead = false;
                    exampleLastRead = false;
                    scenarioOrBackground = background;
                } else if (featureLastRead) {
                    feature.description[descriptionCount] = line;
                    descriptionCount++;
                } else if (line.toLowerCase().indexOf("given ") === 0 ||
                            line.toLowerCase().indexOf("when ") === 0 ||
                            line.toLowerCase().indexOf("then ") === 0 ||
                            line.toLowerCase().indexOf("and ") === 0 ||
                            line.toLowerCase().indexOf("but ") === 0) {
                    var step = { name: line };
                    step.tableArg = [];
                    scenarioOrBackground.steps[stepCount] = step;
                    stepCount++;
                    argumentLineCount = 0;
                } else if (line.toLowerCase().indexOf("|") === 0) {
                    var args = line.substr(1, line.length - 2).split("|");
                    $.each(args, function (i, arg) {
                        args[i] = arg.trim();
                    });
                    if (argumentLineCount != 0)
                        if (exampleLastRead) {
                            var argsObj = {};
                            $.each(scenarioOrBackground.exampleArgColumns, function (i, argName) {
                                argsObj[argName] = args[i];
                            });
                            scenarioOrBackground.examples[argumentLineCount - 1] = argsObj;
                        }
                        else {
                            var argsObj = {};
                            $.each(scenarioOrBackground.steps[stepCount - 1].tableArgColumns, function (i, argName) {
                                argsObj[argName] = args[i];
                            });
                            scenarioOrBackground.steps[stepCount - 1].tableArg[argumentLineCount - 1] = argsObj;
                        }
                    else
                        if (exampleLastRead)
                            scenarioOrBackground.exampleArgColumns = args;
                        else
                            scenarioOrBackground.steps[stepCount - 1].tableArgColumns = args;
                    argumentLineCount++;
                }
            }
        });
        return feature;
    };
    _this.setMethodName = function (step) {
        var methodName = null;
        if (step.name.toLowerCase().indexOf("given ") > -1)
            step.methodName = step.name.substr(6, step.name.length - 6);
        else if (step.name.toLowerCase().indexOf("then ") > -1)
            step.methodName = step.name.substr(5, step.name.length - 5);
        else if (step.name.toLowerCase().indexOf("and ") > -1)
            step.methodName = step.name.substr(4, step.name.length - 4);
        else if (step.name.toLowerCase().indexOf("when ") > -1)
            step.methodName = step.name.substr(5, step.name.length - 5);
    };
    _this.setStepMethod = function (step, feature) {
        _this.setMethodName(step);
        $.each(feature.libraries, function (index, library) {
            if (!step.method)
                $.each(Object.keys(library), function (index, property) {
                    if (typeof library[property] === 'function') {
                        var matcher = property;
                        if (matcher.indexOf('/') === 0) {
                            matcher = new RegExp(matcher.substring(1, matcher.length - 1));
                            if (step.methodName.match(matcher)) {
                                step.method = library[property];
                                step.inlineArgs = step.name.match(/"[^"]*"/g);
                                if (step.inlineArgs && step.inlineArgs.length > 0)
                                    $.each(step.inlineArgs, function (index, token) {
                                        if (token != null)
                                            step.inlineArgs[index] = token.substring(1, token.length - 1);
                                    });
                            }
                        } else {
                            if (step.methodName === matcher) {
                                step.method = library[property];
                                step.inlineArgs = step.name.match(/"[^"]*"/g);
                                if (step.inlineArgs && step.inlineArgs.length > 0)
                                    $.each(step.inlineArgs, function (index, token) {
                                        if (token != null)
                                            step.inlineArgs[index] = token.substring(1, token.length - 1);
                                    });
                            }
                        }

                    }
                });
        });
    };
    _this.getURLParameter = function (name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    };
    _this.setupAndExecuteJasmine = function () {

        var ui = $('#gherkin-ui')[0];
        if (!ui) {
            ui = $('<div id="gherkin-ui"></div>');
            ui = $('body').append(ui);
        }

        var urlParams = window.location.toString().indexOf('?') > 0;
        var hash = window.location.toString().indexOf('#');

        var runUrl = window.location.toString();
        if (runUrl.indexOf('run=false') > 0)
            runUrl = runUrl.replace('run=false', 'run=true');
        else
            runUrl = runUrl.replace('#', '') + (urlParams ? '&run=true' : '?run=true');

        var docUrl = window.location.toString();
        if (docUrl.indexOf('run=true') > 0)
            docUrl = docUrl.replace('run=true', 'run=false');
        else
            docUrl = docUrl.replace('#', '') + (urlParams ? '&run=false' : '?run=false');

        if (!_this.runTests)
            ui.append($('<a href="' + runUrl + '">Run<a/>'));
        else
            ui.append($('<a href="' + docUrl + '">View Without Running<a/>'));

        ko.applyBindings(_this, ui[0]);

        var jasmineEnv = jasmine.getEnv();
        jasmineEnv.updateInterval = 1000;

        var htmlReporter = new jasmine.HtmlReporter();

        jasmineEnv.addReporter(htmlReporter);

        jasmineEnv.specFilter = function (spec) {
            return htmlReporter.specFilter(spec);
        };

        jasmineEnv.execute();
    };
    return _this;
});