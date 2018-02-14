var savePalettab = (function() {

	var $palettab = new Object();
	var $savePalettabBtn;
	var $openPalettabBtn;
	var $openSaveTool, $openSaveToolIcon, $openSaveToolContainer, $savedPalettabsContainer;
	var $closeSavedPalettabsContainerBtn;
	var $rotation = 0;
	$palettab.colors = [];
	$palettab.fonts = [];

	function init() {
		if(localStorageORM.checkLocalStorage() == true) {
			$openSaveTool = document.querySelector('.save-palettab');
			$openSaveToolIcon = $openSaveTool.querySelector('img');
			$openSaveToolContainer = document.getElementById('options');

			$savePalettabBtn = $openSaveToolContainer.querySelector('.save-option');
			$openPalettabBtn = $openSaveToolContainer.querySelector('.open-option');

			$savedPalettabsContainer = document.querySelector('.saved-palettabs-container');
			$closeSavedPalettabsContainerBtn = $savedPalettabsContainer.querySelector('.close');

			$openSaveTool.addEventListener('click', function() { openSaveTool() });
			$savePalettabBtn.addEventListener('click', function() { save() });
			$openPalettabBtn.addEventListener('click', function() { getPalettab() });
			$closeSavedPalettabsContainerBtn.addEventListener('click', function() { closeSavedPalettabsContainer() });
		}
	}

	function openSaveTool() {
		if($rotation == 0) {
			$rotation -= 140;
			$openSaveToolContainer.classList.add('active');
		} else {
			$rotation = 0;
			$openSaveToolContainer.classList.remove('active');
		}
	    $openSaveToolIcon.style.webkitTransform = 'translateZ(0px) rotateZ( ' + $rotation + 'deg )';
	}

	function setColor($colors) {
		$palettab.colors = $colors;
	}

	function setFont($fonts) {
		$palettab.fonts = $fonts;
	}

	var removePalettab = function(event) {
		event.stopPropagation();
		event.preventDefault();

		$id = this.getAttribute('data-id');
		localStorageORM.deleteDataById($id);
		
		$removedPalettab = document.getElementById($id);
		$removedPalettab.classList.add('removed');

		setTimeout(function() {
			$removedPalettab.remove();

			$savedPalettabs = localStorageORM.getData();
			if($savedPalettabs == false || $savedPalettabs.length == 0) {
				$savedPalettabsContainer.classList.remove('active');
			}
		}, 400);

		return false;
	}

	function showSavedPaltetabs() {
		$id = this.getAttribute('data-id');

		$savedPalettab = localStorageORM.getDataById($id);

		if($savedPalettab !== false) {
			Palettab.setSavedColors($savedPalettab.colors);
			Palettab.setSavedFonts($savedPalettab.fonts);
			Palettab.reload();
		}
	}

	function getPalettab() {
		$savedPalettabs = localStorageORM.getData();

		if($savedPalettabs !== false) {
			$savedPalettabsWrapper = $savedPalettabsContainer.querySelector('.saved-palettabs');
			$savedPalettabsWrapper.innerHTML = '';

			if($savedPalettabs.length > 0) {
				for($i=0; $i<$savedPalettabs.length; $i++) {
					$savedPalettab = $savedPalettabs[$i];

					$palettabs = document.createElement('div');
					$palettabs.className = 'saved-palettab';
					$palettabs.setAttribute('id', $savedPalettab.id);
					$palettabs.setAttribute('data-id', $savedPalettab.id);

					$savedPalettabsWrapper.appendChild($palettabs);

					for($c=0; $c<$savedPalettab.colors.colors.length; $c++) {
						$colorBars = document.createElement('div');
						$colorBars.className = 'color-bars';
						$colorBars.style.backgroundColor = '#' + $savedPalettab.colors.colors[$c];
						
						$palettabs.appendChild($colorBars);
					}

					$removePalettab = document.createElement('div');
					$removePalettab.className = 'remove-palettab';
					$removePalettab.setAttribute('data-id', $savedPalettab.id);
					$palettabs.appendChild($removePalettab);

					$removePalettab.addEventListener("click", removePalettab, true);

					$palettabDetail = document.createElement('div');
					$palettabDetail.className = 'palettab-detail';
					$palettabDetail.textContent = timeConverter($savedPalettab.timeStamp);
					$palettabs.appendChild($palettabDetail);

					$palettabs.addEventListener('click', showSavedPaltetabs, true);
				}

				$savedPalettabsContainer.classList.add('active');
			}
		}
		openSaveTool();
	}

	function save() {
		if($palettab.colors.colors.length > 0) {
			$palettabID = $palettab.colors.colors.join('-');
			$palettab.id = $palettabID;
			$palettab.timeStamp = Date.now();
			localStorageORM.saveData($palettab);
		
			saveAnimationStart();
	    }
	}

	function saveAnimationStart() {
        var $elem = document.createElement('div');
		$elem.className = 'ripple-effect';
		$savePalettabBtn.appendChild($elem);

		$elem.addEventListener( "webkitAnimationEnd", saveAnimationEnd, false);

		setTimeout( function() {
            $elem.classList.add('active');
        }, 1);
    }

	function saveAnimationEnd(event) {
        $savePalettabBtn.removeChild(this);
    }

    function closeSavedPalettabsContainer() {
    	$savedPalettabsContainer.classList.remove('active');
    }

	function deleteAll() {
		localStorageORM.clearData();
	}

	function timeConverter(UNIX_timestamp){
		var a = new Date(UNIX_timestamp);
		return a.toDateString();
	}

	return {
		init: init,
		setColor: setColor,
		setFont: setFont
	}

})();
