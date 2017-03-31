$(() => {
    const $locationSearch = $('#locationSearch');
    const $dropdownMenu = $('#dropdownMenu');
    const $dropdownMenuItemTemplate = $('#dropdownMenuItem');
    const $currentLocation = $('#currentLocation');
    const $currentDate = $('#currentDate');
    const $stopButton = $('#stopButton');

    const locationSearchInput$ = Rx.Observable.fromEvent($locationSearch, 'input')
    
    locationSearchInput$.subscribe(data => {
        console.log(data);
    })
});