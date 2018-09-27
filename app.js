let app = angular.module('contactApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('index', {
            url: '/',
            template: `
                <ul class="m-0 p-0">
                    <li class="card mb-4" ng-repeat="contact in index.contacts">
                        <div class="card-body d-flex align-items-center">
                            <div style="flex: 1 1 auto">
                                <div class="display-4 mb-4">{{ contact.name }}</div>
                                <div class="d-flex align-items-center">
                                    <div class="d-flex align-items-center mr-4">
                                        <i class="fas fa-phone mr-2 text-primary"></i>
                                        <span>{{ contact.phone }}</span>
                                    </div>

                                    <div class="d-flex align-items-center">
                                        <i class="fas fa-envelope mr-2 text-primary"></i>
                                        <span>{{ contact.email }}</span>
                                    </div>
                                </div>
                            </div>

                            <div style="flex:0 0 auto;">
                                <a ui-sref="contact({id: contact.id})" class="btn btn-primary">Details</a>
                            </div>
                        </div>
                    </li>
                </ul>
            `,
            controller: 'indexCtrl',
            controllerAs: 'index',
            resolve: {
                _data: function (dataService) {
                    return dataService.get_users().then(function (contacts) {
                        console.log(contacts);
                        return contacts;
                    });
                }
            }
        })
        .state('contact', {
            url: '/contact/:id',
            template: `
                <div class="card">
                    <div class="card-body">
                        <div class="display-4">{{ contact.data.name }}</div>

                        <ul class="list-group">
                            <li class="list-group-item">
                                <i class="text-primary fas fa-phone"></i>
                                <span>{{ contact.data.phone }}</span>
                            </li>
                            <li class="list-group-item">
                                <i class="text-primary fas fa-envelope"></i>
                                <a ng-href="mailto:{{ contact.data.email }}">{{ contact.data.email }}</a>
                            </li>
                            <li class="list-group-item">
                                <i class="text-primary fab fa-internet-explorer"></i>
                                <a ng-href="//{{contact.data.website}}">{{ contact.data.website }}</a>
                            </li>
                            <li class="list-group-item">
                                <i class="text-primary fas fa-home"></i>
                                <span>{{ contact.data.address.city }}, {{ contact.data.address.zipcode }}</span>
                            </li>
                        </ul>

                        <div class="text-center mt-5">
                            <button type="button" ng-click="$root.navigate_back()" class="btn btn-primary">Go Back</button>
                        </div>
                    </div>
                </div>
            `,
            controller: 'contactCtrl',
            controllerAs: 'contact',
            resolve: {
                _data: function (dataService, $stateParams) {
                    const id = $stateParams.id;

                    return dataService.get_user_by_id(id).then(function (contacts) {
                        return contacts[0];
                    });
                }
            }
        })
    
        $urlRouterProvider.otherwise('/');
});

app.run(function($rootScope) {
    $rootScope.navigate_back = function () {
        history.back();
    }
})

app.controller('indexCtrl', ['_data', function(_data) {
    var self = this;

    self.contacts = _data;

    
}]);

app.controller('contactCtrl', ['$stateParams', '_data', function($stateParams, _data) {
    var self = this;

    self.id = $stateParams.id;

    self.data = _data;
}]);

app.component('contact', {
    bindings: {
        name: '<',
        number: '<'
    },

    template: `
        <div>
            <h3>
                <span>{{ contact.first_name }}</span>
                <span>{{ contact.last_name }}</span>
            </h3>
            <div>{{contact.number}}</div>
        </div>
        <hr />
    `,
    
    controller: function() {
        this.$onInit = function() {
            this.first_name = this.name.split(' ')[0];
            this.last_name = this.name.split(' ')[1];
        }
    },

    controllerAs: 'contact'
});

app.factory('dataService', ['$http', '$q', function($http, $q) {
    var service = {
        get_users: get_users,
        get_user_by_id: get_user_by_id
    };

    return service;

    function get_users(options) {
        var deferred = $q.defer();

        $http.get('https://jsonplaceholder.typicode.com/users', options || {})
            .then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(new Error(error));
            });

        return deferred.promise;
    };

    function get_user_by_id(id) {
        const options = {
            params: {
                id: id
            }
        };

        return get_users(options);
    }
}]);