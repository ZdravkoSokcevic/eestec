let searchInput = document.getElementsByClassName('search-input')[0];
if(searchInput) {
	searchInput.addEventListener('click', (e) => {
		let fields = document.forms['search-form'].elements;
		if(document.forms['search-form'].checkValidity()) {
			document.forms['search-form'].submit();
		}
		// console.log(fields);
		// document.forms['search-form'].submit();
	})
}