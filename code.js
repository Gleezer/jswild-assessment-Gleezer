// To run this assignment, right click on index.html in the Visual Studio file explorer to the left
// and select "Open with Live Server"

// Your Code Here.
///Followed Code along from demo recoding by Seva

class FlickGallery {
    constructor(location) {
        this.term = 'funny'
        this.location = location
        this.container = document.getElementById('photoHolder')
        this.page = 1
        this.perPage = 5
        this.currentPhotoIndex = 0
        this.photos = []
        this.isLoading = false

        document.getElementById('nextPhotoButton').addEventListener('click', this.displayNextPhoto.bind(this))
    }

    startSlideShow() {
        setInterval(this.displayNextPhoto.bind(this), 1000)
    }

    displayNextPhoto() {
        if (this.isLoading) {
            return;
        }
   
        this.currentPhotoIndex += 1

        if (this.currentPhotoIndex < this.photos.length) {
            let photoObject = this.photos[this.currentPhotoIndex]
            this.displayPhotoObject(photoObject)
        } else {
            this.page += 1
            this.currentPhotoIndex = 0
            this.fetchDataFromFlickr()
        }
    }

    displayPhotoObject(photoObj) {
        let imageUrl = this.constructImageURL(photoObj);
        let img = document.createElement('img')
        img.src = imageUrl
        this.container.innerHTML = ''
        this.container.append(img)
    }

    processFlickrResponse(parsedResponse) {
        this.setLoading(false)
        console.log(parsedResponse)
        this.photos = parsedResponse.photos.photo
        if (this.photos.length > 0) {
            let firstPhotoObject = this.photos[this.currentPhotoIndex]
            this.displayPhotoObject(firstPhotoObject)
        } else {
            this.container.innerHTML = 'No More Pictures to See'
        }
    }

    setLoading(isLoading) {
        let loadingSpan = document.getElementById('loading')
        if (isLoading) {
            this.isLoading = true
            loadingSpan.innerHTML = 'Loading Photos For You!'
        } else {
            this.isLoading = false
            loadingSpan.innerHTML = ''
        }

    }

    fetchDataFromFlickr() {
        let url = this.generateApiUrl();
        let fetchPromise = fetch(url)
        this.setLoading(true)
        fetchPromise
            .then(response => response.json())
            .then(parsedResponse => this.processFlickrResponse(parsedResponse))
            console.log(url)
    }

    generateApiUrl() {
        return 'https://shrouded-mountain-15003.herokuapp.com/https://flickr.com/services/rest/' +
            '?api_key=3a5fdd42c3a2c64ad46e4e667de0622e' +
            '&format=json' +
            '&nojsoncallback=1' +
            '&method=flickr.photos.search' + 
            '&safe_search=1' +
            '&per_page=' + this.perPage +
            '&page=' + this.page +
            '&text=' + this.term +
            '&lat=' + this.location.latitude +
            '&lon=' + this.location.longitude;
    }

    constructImageURL(photoObj) {
        return "https://farm" + photoObj.farm +
                ".staticflickr.com/" + photoObj.server +
                "/" + photoObj.id + "_" + photoObj.secret + ".jpg";
    }
}

function onGeolocationSuccess(data) {
    let location = data.coords;
    let gallery = new FlickGallery(location)
    gallery.fetchDataFromFlickr() 
}

function onGeolocationError() {
    //should be Nashville, Tennesee
    const fallbackLocation = {latitude: 36.174465, longitude: -86.767960} 
    let gallery = new FlickGallery(fallbackLocation)
    gallery.fetchDataFromFlickr() 
}

navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError)


