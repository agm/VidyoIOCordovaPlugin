#!/usr/bin/env node

module.exports = function (context) {
    var IosSDKVersion = "VidyoClient-iOSSDK";
    var downloadFile = require('./downloadFile.js'),
        exec = require('./exec/exec.js'),
        Q = context.requireCordovaModule('q'),
        deferral = new Q.defer();
    console.log('Downloading VidyoClient iOS SDK');
    downloadFile('https://static.vidyo.io/latest/package/' + IosSDKVersion + '.zip',
        './' + IosSDKVersion + '.zip', function (err) {
            if (!err) {
                console.log('downloaded');
                exec('unzip ./' + IosSDKVersion + '.zip', function (err, out, code) {
                    console.log('expanded');
                    var frameworkDir = context.opts.plugin.dir + '/src/ios/lib/';
                    exec('mkdir -p '+ frameworkDir +'; mv ./' + IosSDKVersion + '/lib/ios/VidyoClientIOS.framework ' + frameworkDir, function (err, out, code) {
                        console.log('moved VidyoClientIOS.framework into ' + frameworkDir);
                        exec('rm -r ./' + IosSDKVersion, function (err, out, code) {
                            console.log('Removed extracted dir');
                            exec('rm ./' + IosSDKVersion + '.zip', function (err, out, code) {
                                console.log('Removed downloaded SDK');
                                deferral.resolve();
                            });
                        });
                    });
                });
            }
        });
    return deferral.promise;
};
