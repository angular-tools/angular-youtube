(function () {
    'use strict';

    angular.module('angularYoutube', ['ngDialog'])
        .factory("$youtube", ['$timeout', 'ngDialog', function ($timeout, $dialog) {
            var ytService = {};

            ytService.getEmbedCode = function (id, options) {
                options = options || {};

                var hd = options.hd !== false;
                var autoplay = typeof(options.autoplay) === 'undefined' ? false : options.autoplay;
                var showcontrols = typeof(options.showcontrols) === 'undefined' ? false : options.showcontrols;
                var src = '//www.youtube.com/embed/' + id + '?version=3&autoplay=' + autoplay + (hd ? '&hd=1&vq=hd720&quality=high' : '') + '&controls=' + showcontrols + '&rel=0&modestbranding=1&autohide=1&showinfo=0&theme=light&wmode=opaque';

                return '<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="' + src + '" frameborder="0" allowfullscreen></iframe></div>';
            };

            ytService.popup = function (id, options) {
                options = options || {autoplay: true, hd: true};

                var embedCode = ytService.getEmbedCode(id, options);
                var html = options.title ? '<h3 class="title">' + options.title + '</h3>' + embedCode : embedCode;

                $dialog.open({
                    template: '<div id="dialog">' + html + '</div>',
                    plain: true,
                    className: 'ngdialog-theme-plain custom-width'
                });
            };

            return ytService;
        }])
        .directive('youtubeVideo', ['$youtube', function ($youtube) {
            return {
                restrict: 'A',
                replace: true,
                scope: {id: '@', options: '='},
                link: function ($scope, element, attrs) {
                    element.html($youtube.getEmbedCode($scope.id, $scope.options));
                }
            }
        }])
        .directive('youtubeLink', ['$youtube', function ($youtube) {
            return {
                restrict: 'A',
                replace: true,
                scope: {id: '@', options: '='},
                link: function ($scope, element, attrs) {
                    element.click(function () {
                        if (!$scope.id && element.attr('href')) {
                            var url = element.attr('href');
                            var matches = url.match(/youtube\.com.*((?:\?|\&)v=|\/embed\/)(.{11})/);
                            $scope.id = matches.pop(0) || url;
                        }

                        $youtube.popup($scope.id, $scope.options);

                        return false;
                    })
                }
            }
        }]);
})();


