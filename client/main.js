$(() => {
    const $locationSearch = $('#locationSearch');
    const $dropdownMenu = $('#dropdownMenu');
    const $dropdownMenuItemTemplate = $('#dropdownMenuItem');
    const $currentLocation = $('#currentLocation');
    const $currentDate = $('#currentDate');
    const $stopButton = $('#stopButton');

    const locationSearchInput$ = Rx.Observable.fromEvent($locationSearch, 'input')
        .debounceTime(300)
        .map(event => event.target.value)
        .switchMap(fetchLocations);
    const dropdownMenuClick$ = Rx.Observable.fromEvent($dropdownMenu, 'click')
        .filter(event => event.target.tagName === 'A')
        .share();
    const stopButtonClick$ = Rx.Observable.fromEvent($stopButton, 'click');
    const locationDates$ = dropdownMenuClick$
        .map(event => ({
            name: event.target.innerText,
            offset: event.target.getAttribute('offset')
        }))
        .switchMap((locationData) => {
            return Rx.Observable.interval(1000)
                .startWith(getCurrentDate(locationData))
                .map(() => getCurrentDate(locationData))
                .takeUntil(stopButtonClick$);
        });

    locationSearchInput$.subscribe(renderMenu);
    dropdownMenuClick$.subscribe(clearSearch);
    locationDates$.subscribe((data) => {
        $currentLocation.text(data.name);
        $currentDate.text(formatDate(data.date));
    });

    function getCurrentDate(locationData) {
        return {
            name: locationData.name,
            date: new Date(Date.now() + 3600000 * locationData.offset)
        }
    }

    function formatDate(date) {
        return date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
    }

    function renderMenu(data) {
        $dropdownMenu.empty();

        if (!data.length) {
            $dropdownMenu.hide();
        } else {
            data.forEach(location => {
                $dropdownMenu.append($dropdownMenuItemTemplate.html()
                    .replace('{{name}}', location.name)
                    .replace('{{offset}}', location.offset));
            });
            $dropdownMenu.show();
        }
    }

    function clearSearch() {
        $locationSearch.val('');
        $dropdownMenu.hide();
    }

    function fetchLocations(text) {
        const request =
            fetch('http://localhost:8080/locations?search=' + text)
                .then(resp => resp.json());

        return Rx.Observable.fromPromise(request);
    }
});