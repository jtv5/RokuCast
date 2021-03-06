"use strict";
angular.module("vget.AppDev", ["ngRoute", "vget.ui", "vget.defaultDetector","w69b.ui.randomChild"])
    .config(function (a) {
        a.when("/", {
                templateUrl: "views/main.html"
                , controller: "MainCtrl"
            })
            .otherwise({
                redirectTo: "/"
            })
    }), angular.module("vget.App", ["templates", "vget.AppDev"]), angular.module("vget.AppE2E", ["vget.AppDev", "w69b.chromeExt.mocks"]), angular.module("views/main.html", [])
    .run(["$templateCache", function (a) {
        a.put("views/main.html", '<div class="main">    <div data-ng-show="vcastMissing">        The <a href="https://chrome.google.com/webstore/detail/vget-cast-dlna-controller/ekdjofnchpbfmnfbedalmbdlhbabiapi"           data-new-tab>vGet Cast App</a> is not installed. Install it to cast        videos to your Smart TV.    </div>    <ul class="videoList">        <li class="video" data-ng-repeat="video in detectedVideos"            data-ng-mouseenter="highlight(video, true)"            data-ng-mouseleave="highlight(video, false)"                >            <div data-ng-show="video.isYoutube">                <div class="videoType">                    Youtube Video                </div>                Not allowed due to TOS restrictions, sorry.            </div>            <div data-ng-hide="video.isYoutube">                <div data-ng-show="video.type == \'html5\'" class="videoType">                    HTML5 Video                </div>                <div data-ng-show="video.type == \'flash\'" class="videoType">                    Flash Video                </div>                <div data-ng-show="video.type == \'unsupported\'"                     class="videoType">                    Unsupported Flash Video                </div>                <div class="sourceItem" data-ng-repeat="src in video.sources">                    {{src|guessFilename}}                    <button class="btn-icon download"                            title="Download {{src.url}}"                            data-ng-click="download(video, src)">                    </button>                    <button class="btn-icon cast" title="Cast video"                            data-ng-click="cast(video, src)">                    </button>                </div>            </div>        </li>    </ul>    <div data-ng-hide="detectedVideos.length" class="noVideo">        No Video detected on this page. <br>        If there is a video, start playback and try again.    </div></div>')
    }]), angular.module("templates", ["views/main.html"])
    , function (a, b) {
    }(window, document), angular.module("w69b.chromeExt", [])
    .factory("chromeTabs", ["$window", "$rootScope", function (a, b) {
        function c(a) {
            i.tabs.query({
                active: !0
                , windowId: i.windows.WINDOW_ID_CURRENT
            }, function (c) {
                a(c.length ? c[0] : null), b.$$phase || b.$digest()
            })
        }

        function d(a) {
            i.tabs.create({
                url: a
            })
        }

        function e(a, b) {
            return i.tabs.connect(a, b)
        }

        function f(a) {
            i.tabs.executeScript(null, a)
        }

        function g(a) {
            i.tabs.insertCSS(null, a)
        }

        function h(a, b) {
            c(function (c) {
                i.tabs.sendMessage(c.id, a, b)
            })
        }
        if (!a.chrome || !a.chrome.tabs) return null;
        var i = a.chrome;
        return {
            getActiveTab: c
            , executeScript: f
            , insertCSS: g
            , sendMessageActive: h
            , create: d
            , connect: e
        }
    }])
    .directive("newTab", ["chromeTabs", function (a) {
        return {
            restrict: "A"
            , link: function (b, c, d) {
                c.bind("click", function (b) {
                    b.preventDefault(), a.create(d.href)
                })
            }
        }
    }]), angular.module("w69b.ui.randomChild", [])
    .directive("randomChild", [function () {
        return {
            restrict: "EA"
            , link: function (a, b) {
                var c = b.children();
                if (!(c.length < 2)) {
                    var d = [];
                    angular.forEach(c, function (a) {
                        a = angular.element(a);
                        var b = Number(a.attr("data-weight") || a.attr("weight") || 1);
                        d.length && (b += d[d.length - 1]), d.push(b)
                    });
                    var e, f = Math.random() * d[d.length - 1];
                    for (e = 0; e < d.length && !(f < d[e]); ++e);
                    angular.forEach(c, function (a, b) {
                        b != e && angular.element(a)
                            .remove()
                    })
                }
            }
        }
    }]), angular.module("vget.videoutils", [])
    .factory("videoutils", function () {
        var a = {}
            , b = ["3g2", "3gp", "3gp2", "3gpp", "amv", "asf", "avi", "divx", "drc", "dv", "f4v", "flv", "gvi", "gxf", "iso", "m1v", "m2v", "m2t", "m2ts", "m3u8", "mkv", "mov", "mp2", "mp2v", "mp4", "mp4v", "mpe", "mpeg", "mpeg1", "mpeg2", "mpeg4", "mpg", "mpv1", "mts", "mtv", "mxf", "mxg", "nsv", "nuv", "ogm", "ogv", "ogx", "ps", "rec", "rm", "rmvb", "tod", "ts", "tts", "vob", "vro", "webm", "wm", "wmv", "wtv", "xesc", "ogg", "m4v"]
            , c = new RegExp(/^(.*)\.([^\.]{2,5})$/);
        return a.guessFilename = function (c) {
            var d;
            d = c.label ? c.label : c.url;
            var e = d.lastIndexOf("/");
            e >= 0 && (d = d.substr(e + 1)), d.length > 20 && (d = d.substr(-20));
            var f = a.splitFilename(d)
                , g = f[0]
                , h = f[1];
            return (!h || b.indexOf(h) < 0) && (h && (g += "." + h), h = "mp4"), [g, h].join(".")
        }, a.getFileExtension = function (b) {
            return a.splitFilename(b)[1]
        }, a.splitFilename = function (a) {
            var b = a.match(c);
            return b ? [b[1], b[2]] : [a, ""]
        }, a.isYoutube = function (a) {
            var b = angular.element("<a></a>")[0];
            return false
        }, a
    }), angular.module("vget.defaultDetector", ["w69b.chromeExt"])
    .factory("defaultDetector", ["chromeTabs", "$rootScope", function (a, b) {
        function c(b) {
            a.executeScript({
                file: b
                , allFrames: !0
                , runAt: "document_end"
            })
        }

        function d() {
            c("components/libvget/libvget.js"), c("scripts/contentScript.js"), a.insertCSS({
                file: "styles/contentScript.css"
                , allFrames: !0
                , runAt: "document_end"
            })
        }

        function e(a) {
            b.detectedVideos.push(a), b.$digest()
        }

        function f(a) {
            console.log("unloading " + a), m.hasOwnProperty(a) && delete m[a]
        }

        function g(a) {
            m[a] = !0
        }

        function h(a) {
            var b = a.type
                , c = a.data;
            switch (b) {
            case "videoDetected":
                e(c);
                break;
            case "videoList":
                k(c);
                break;
            case "register":
                g(c);
                break;
            case "unload":
                f(c)
            }
        }

        function i(b, c, d) {
            var e = {
                url: c.url
                , frameId: b.frameId
            };
            e.forceOnTop = !m.hasOwnProperty(b.frameId), d && (e.name = d), a.sendMessageActive({
                type: "download"
                , data: e
            })
        }

        function j(b, c) {
            b ? a.sendMessageActive({
                type: "highlight"
                , data: {
                    frameId: b.frameId
                    , id: b.id
                    , isUnsupported: "unsupported" == b.type
                    , enable: c
                }
            }) : a.sendMessageActive({
                type: "highlight"
                , data: {
                    enable: !1
                }
            })
        }

        function k(a) {
            b.detectedVideos.push.apply(b.detectedVideos, a), b.$apply()
        }

        function l() {
            d(), a.sendMessageActive({
                type: "init"
            })
        }
        b.detectedVideos = [];
        var m = {};
        return chrome.runtime.onMessage.addListener(h), {
            start: l
            , highlight: j
            , download: i
        }
    }]), angular.module("vget.ui", ["vget.defaultDetector", "w69b.chromeExt", "vget.videoutils"])
    .controller("MainCtrl", ["$scope", "defaultDetector", "videoutils", "$window", "$timeout", function (a, b, c, d, e) {
        function g() {
            a.$destroy(), e(function () {
                d.close()
            }, 200)
        }
        b.start(), a.vcastMissing = !1, a.download = function (a, d) {
            b.download(a, d, c.guessFilename(d)), g()
        }, a.highlight = function (a, c) {
            b.highlight(a, c)
        }, e(function () {
            function b(a) {
                return "unsupported" === a.type
            }

            function c(a) {
                return a.isYoutube
            }
        }, 1e3), a.cast = function (b, c) {
        	chrome.runtime.sendMessage({type:"open", sentLink: c.url, sentTitle : "", sentImg : "" });
        }, a.$on("$destroy", function () {
            b.highlight(null, !1)
        })
    }])
    .filter("guessFilename", ["videoutils", function (a) {
        return function (b) {
            return a.guessFilename(b)
        }
    }]), angular.module("vget.AppDev", ["ngRoute", "vget.ui", "vget.defaultDetector", "w69b.ui.randomChild"])
    .config(["$routeProvider", function (a) {
        a.when("/", {
                templateUrl: "views/main.html"
                , controller: "MainCtrl"
            })
            .otherwise({
                redirectTo: "/"
            })
    }]), angular.module("vget.App", ["templates", "vget.AppDev"]),
    angular.module("vget.AppE2E", ["vget.AppDev", "w69b.chromeExt.mocks"]);
