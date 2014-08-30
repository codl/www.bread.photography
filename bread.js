var photos = [];

function getBreadPhotos(){
    $.ajax({
        url: "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9a845e09c486efec8e2259c05e034254&text=bread&format=json&nojsoncallback=1&sort=relevance&content_type=1",
        success: function(data){
            for(var i=0; i < data.photos.photo.length; i++){
                var photo = data.photos.photo[i];
                url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
                // preload in cache, if 200 then we can add it to the global photos array
                var img = $("<img/>");
                img.on("load", {url:url}, function(e){
                    console.log("i load");
                    var url = e.data.url;
                    console.log(url);
                    photos.push(url);
                    if(photos.length == 1){
                        $(".bread").css("background-image", "url("+url+")");
                        window.setTimeout(showNext, 5 * 1000);
                    }
                });
                img.attr("src", url);
            }
        },
    });
}

function showNext(){
    var photo = photos.shift();
    photos.push(photo);

    var stalebread = $(".bread");
    var newbread = $("<div class='new bread'/>");
    newbread.css("background-image", "url("+photo+")");
    stalebread.removeClass("new");
    $(document.body).append(newbread);
    stalebread.on("transitionend", destroyBread);
    stalebread.addClass("stale");
}

function destroyBread(e){
    $(e.target).remove();
    window.setTimeout(showNext, 5 * 1000);
}

$(getBreadPhotos);
