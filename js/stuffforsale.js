var app = angular.module("stuffForSale", [ "ui.bootstrap", "dialogs" ]);

app.controller("mainController", function ($scope, $http, $dialogs) {
    $scope.listing = [];

    $scope.newItemName = "";
    $scope.newItemPrice = undefined;

    $scope.renameItem = (itemId) => {

        var dlg = null;

        var oldItemName = $scope.listing.find(i => i.id === itemId).name;

        dlg = $dialogs.create('/dialogs/prompt-name.html','promptNameCtrl', { itemName: oldItemName }, { key: false, back: 'static' });
        
        dlg.result.then(function(itemName) {
            // POST the new name;
            console.log("Name Prompt returned: " + itemName);
            if (itemName === oldItemName) {
                console.log("Item name did not change");
            }
            else {
                $scope.postNewItemName(itemId, itemName);            
            }
        }, function () {
            // canceled
            console.log("Name prompt canceled");
        });
    }

    $scope.updatePrice = (itemId) => {

        var dlg = null;

        var oldItemPrice = 0;
        oldItemPrice = $scope.listing.find(i => i.id === itemId).price;

        dlg = $dialogs.create('/dialogs/prompt-price.html','promptPriceCtrl', { price: oldItemPrice }, { key: false, back: 'static' });
        
        dlg.result.then(function(price) {
            // POST the new price;
            console.log("Price Prompt returned: " + price);
            if (Number(price) == oldItemPrice) {
                console.log("Price did not change");
            }
            else {
                $scope.postNewPrice(itemId, price);            
            }
        }, function () {
            // canceled
            console.log("Price prompt canceled");
        });
    }

    $scope.addItem = () => {

        // check new item name
        if (!$scope.newItemName) {
            alert("New item name is required");
            return;
        }

        // check new item price

        if ($scope.newItemPrice == undefined) {
            $scope.newItemPrice = 0.0;
        }
        
        if (isNaN($scope.newItemPrice) || $scope.newItemPrice <= 0) {
            alert("Invalid new item price: " + $scope.newItemPrice);
            return;
        }

        $scope.putNewItem();
    }

    // GET list of items
    // format example: http://localhost:3000/getlist
    $scope.retrieveItemList = () => {
        console.log("$scope.retrieveItemList() called");

        $http.get("http://localhost:3000/getlist")
            .then((response) => {
                console.log(response.data);
                $scope.listing = response.data;
                console.log("Server sent a successful response for retrieveItemList")
            })
            .catch((error) => {
                if (error.status != -1) {
                    console.log("Server responsed with an error: " + error.status + " : " + error.data);
                    alert("Server responsed with an error: " + error.status + " : " + error.data);
                }
            });
    };

    // PUT a new item
    // format example: http://localhost:3000/newItem?newItemName="Orange"&neItemPrice=12.56

    $scope.putNewItem = () => {
        console.log("$scope.putNewItem(" + $scope.newItemName + ", " + $scope.newItemPrice + " called");

        $http.put("http://localhost:3000/newItem?newItemName=" + $scope.newItemName + "&newItemPrice=" + $scope.newItemPrice)
            .then((response) => {
                console.log("Server sent a successful response for putNewItem");
                $scope.newItemName = "";
                $scope.newItemPrice = undefined;
                $scope.retrieveItemList();
            })
            .catch((error) => {
                if (error.status != -1) {
                    console.log("Server responsed with an error: " + error.status + " : " + error.data);
                    alert("Server responsed with an error: " + error.status + " : " + error.data);
                }
            });
    };

    // POST a new item name
    // format example: http://localhost:3000/updateItemName?id=2022-12-19T23:56:08.591Z&newItemName="Orange"
    $scope.postNewItemName = (itemId, newItemName) => {
        console.log("$scope.postNewItemName(" + itemId + ", " + newItemName + " called");

        $http.post("http://localhost:3000/updateName?id=" + itemId + "&newItemName=" + newItemName)
            .then((response) => {
                console.log("Server sent a successful response for postNewItemName");
                $scope.retrieveItemList();
            })
            .catch((error) => {
                if (error.status != -1) {
                    console.log("Server responsed with an error: " + error.status + " : " + error.data);
                    alert("Server responsed with an error: " + error.status + " : " + error.data);
                }
            });
    };

    // POST a new item price
    // format example: http://localhost:3000/updateItemName?id=2022-12-19T23:56:08.591Z&newPrice=13.80
    $scope.postNewPrice = (itemId, newPrice) => {
        console.log("$scope.postNewItemName(" + itemId + ", " + newPrice + " called");

        $http.post("http://localhost:3000/updatePrice?id=" + itemId + "&newPrice=" + newPrice)
            .then((response) => {
                console.log("Server sent a successful response for postNewPrice");
                $scope.retrieveItemList();
            })
            .catch((error) => {
                if (error.status != -1) {
                    console.log("Server responsed with an error: " + error.status + " : " + error.data);
                    alert("Server responsed with an error: " + error.status + " : " + error.data);
                }
            });
    };

    // DELETE an item
    // format example: http://localhost:3000/deleteItem?id="2022-12-19T23:56:08.591Z"
    $scope.deleteItem = (itemId) => {

        if (!confirm("Are you sure you want to delete item \"" + $scope.listing.find(i => i.id === itemId).name + "\"")) {
            return;
        }

        console.log("$scope.deleteItem(" + itemId + ") called");

        $http.delete("http://localhost:3000/deleteItem?id=" + itemId)
            .then((response) => {
                console.log("Server sent a successful response for deleteItem");
                $scope.retrieveItemList();
            })
            .catch((error) => {
                if (error.status != -1) {
                    console.log("Server responsed with an error: " + error.status + " : " + error.data);
                    alert("Server responsed with an error: " + error.status + " : " + error.data);
                }
            });

    };
    
    $scope.retrieveItemList();
    setInterval($scope.retrieveItemList, 5000);
})
.controller('promptNameCtrl', function($scope, $modalInstance, data) {

    $scope.data = { newItemName: data.itemName };

    $scope.cancel = function () {
        $modalInstance.dismiss('canceled');
    }; // end cancel

    $scope.save = function () {
        $modalInstance.close($scope.data.newItemName);
    }; // end save

    $scope.hitEnter = function (evt) {
        if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.newItemName, null) || angular.equals($scope.newItemName, '')))
            $scope.save();
    }; // end hitEnter
    
})
.run(['$templateCache', function ($templateCache) {
    $templateCache.put('/dialogs/prompt-name.html',
     '<div class="modal-content half-width"><div class="modal-header"><h4 class="modal-title">Rename Item</h4></div><div class="modal-body"><ng-form name="itemNameDialog" novalidate="" role="form" class="ng-pristine ng-invalid ng-invalid-required"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[itemNameDialog.itemName.$dirty &amp;&amp; itemNameDialog.itemName.$invalid]"><label class="control-label" for="newItemName">Name:</label><input type="text" class="form-control ng-pristine ng-invalid ng-invalid-required" name="newItemName" id="newItemName" ng-model="data.newItemName" ng-keyup="hitEnter($event)" required=""><span class="help-block">Enter the item\'s new name</span></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(itemNameDialog.$dirty &amp;&amp; itemNameDialog.$invalid) || itemNameDialog.$pristine" disabled="disabled">OK</button></div></div>');
}])
.controller('promptPriceCtrl', function($scope, $modalInstance, data) {

    $scope.data = { newPrice: data.price };

    $scope.cancel = function () {
        $modalInstance.dismiss('canceled');
    }; // end cancel

    $scope.save = function () {
        $modalInstance.close($scope.data.newPrice);
    }; // end save

    $scope.hitEnter = function (evt) {
        if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.newItemName, null) || angular.equals($scope.newItemName, '')))
            $scope.save();
    }; // end hitEnter
    
})
.run(['$templateCache', function ($templateCache) {
    $templateCache.put('/dialogs/prompt-price.html',
     '<div class="modal-content half-width"><div class="modal-header"><h4 class="modal-title">Update price</h4></div><div class="modal-body"><ng-form name="priceDialog" novalidate="" role="form" class="ng-pristine ng-invalid ng-invalid-required"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[priceDialog.newPrice.$dirty &amp;&amp; priceDialog.newPrice.$invalid]"><label class="control-label" for="newPrice">Price:</label><input type="currency" class="form-control ng-pristine ng-invalid ng-invalid-required" name="newPrice" id="newPrice" ng-model="data.newPrice" ng-keyup="hitEnter($event)" required=""><span class="help-block">Enter the item\'s new price</span></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(priceDialog.$dirty &amp;&amp; priceDialog.$invalid) || priceDialog.$pristine" disabled="disabled">OK</button></div></div>');
}])
;

