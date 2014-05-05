/**
 * Angular group controller file.
 */
function GroupsListController($scope, $http) {

	$http.get('/json/groups.json').success(function(data) {
		$scope.artists = data;
		$scope.artistOrder = 'reknown';
	});
}