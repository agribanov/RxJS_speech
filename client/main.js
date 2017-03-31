$(() => {
    const $locationSearch = $('#locationSearch');
    const $dropdownMenu = $('#dropdownMenu');
    const $dropdownMenuItemTemplate = $('#dropdownMenuItem');
    const $currentLocation = $('#currentLocation');
    const $currentDate = $('#currentDate');
    const $stopButton = $('#stopButton');

    const locationSearchInput$ = Rx.Observable.fromEvent($locationSearch, 'input')
        .map(event => event.target.value)
        .switchMap(fetchLocations)
    
    locationSearchInput$.subscribe(data => {
        console.log(data);
    })

    function fetchLocations(text) {
        const request =
            fetch('http://localhost:8080/locations?search=' + text)
                .then(resp => resp.json());
    
        return Rx.Observable.fromPromise(request);
    }
});