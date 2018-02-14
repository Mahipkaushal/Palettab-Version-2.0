var localStorageORM = (function() {

	function checkLocalStorage() {
		if (typeof(Storage) !== 'undefined') {
			return true;
		} else {
			return false;
		}	
	}

	function saveData($palettabData) {
		if(checkLocalStorage() === true) {
			$data = getData();
			if($data === false) {
				$data = [];
			}

			if($data.length == 0) {
				$data.push($palettabData);
			} else {
				for(i=0; i<$data.length; i++) {
					$palettab = $data[i];
					if($palettab.id.toLowerCase() == $palettabData.id.toLowerCase()) {
						$data.splice(i, 1);
						break;
					}
				}
				$data.push($palettabData);
			}

			localStorage.setItem('palettab', JSON.stringify($data));
		}
	}

	function getData() {
		if(checkLocalStorage() === true) {
			if (localStorage.getItem('palettab') !== null) {
				return JSON.parse(localStorage.getItem('palettab'));
			} else {
				return false;	
			}
		} else {
			return false;
		}
	}

	function getDataById(id) {
		if(checkLocalStorage() === true) {
			if (localStorage.getItem('palettab') !== null) {
				$data = getData();
				for(i=0; i<$data.length; i++) {
					$palettab = $data[i];
					if($palettab.id.toLowerCase() == id.toLowerCase()) {
						return $data[i];
						break;
					}
				}
				return false;
			} else {
				return false;	
			}
		} else {
			return false;
		}
	}

	function deleteAllData() {
		if(checkLocalStorage() === true) {
			if (localStorage.getItem('palettab') !== null) {
				localStorage.removeItem('palettab');
			}
		}
	}

	function deleteDataById(id) {
		if(checkLocalStorage() === true) {
			$data = getData();
			if($data !== false && $data.length > 0) {
				for(i=0; i<$data.length; i++) {
					$palettab = $data[i];
					if($palettab.id.toLowerCase() == id.toLowerCase()) {
						$data.splice(i, 1);
						break;
					}
				}
			}

			localStorage.setItem('palettab', JSON.stringify($data));
		}
	}

	return {
		checkLocalStorage: checkLocalStorage,
		saveData: saveData,
		getData: getData,
		clearData: deleteAllData,
		getDataById: getDataById,
		deleteDataById: deleteDataById
	}
})();