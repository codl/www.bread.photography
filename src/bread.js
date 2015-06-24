(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-54493233-2', 'auto');
ga('send', 'pageview');



var photos = [];
var started = false;
var starttime;

function acknowledgeBread(e){
    photos.push(e.data);
    if(!started){
        started = true;
        ga('send', 'timing', 'bread', 'loaded one', new Date().getTime() - startTime);
        document.body.classList.add('loaded');
        showNext();
    }
}

function getBreadPhotos(){
    var page = Math.ceil(Math.random() * 4);
    startTime = new Date().getTime();

    $.ajax({
        url: "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=0262b62c1e3dda3b26823024875e2bc1&text=bread&format=json&nojsoncallback=1&sort=relevance&content_type=1&extras=url_o,url_l&license=1,2,3,4,5,6,7&page=" + page,
        success: function(data){
            for(var i=0; i < data.photos.photo.length; i++){
                var photo = data.photos.photo[i];
                var url;
                if(photo.url_o && photo.height_o >= 600 && photo.width_o >= 800)
                    url = photo.url_o;
                else if(photo.url_l)
                    url = photo.url_l;
                else // an image for ants, skip it
                    continue;

                var link = "https://www.flickr.com/photos/" + photo.owner + "/" + photo.id;

                // preload in cache, if 200 then we can add it to the global photos array
                var img = $("<img/>");
                img.on("load", {url:url, link:link}, acknowledgeBread);
                img.attr("src", url);
            }
        },
    });
}

function randomTransform(){
    var transform = "scale(" + (1 + Math.random()*0.3 + 0.2) + ") ";
    transform += "translateX(" + (5-Math.floor(Math.random()*10)) + "%) ";
    transform += "translateY(" + (5-Math.floor(Math.random()*10)) + "%) ";
    return transform;
}

function showNext(){
    var photo = photos.pop();
    photos.unshift(photo);

    var stalebread = $(".bread");
    var newbread = $("<div class='new bread'/>");
    newbread.css("background-image", "url("+photo.url+")");
    newbread.on("transitionend", transitionend);
    stalebread.removeClass("new");
    $(document.body).append(newbread);
    stalebread.addClass("stale");
    newbread.css("transform", randomTransform());
    var _ = newbread[0].offsetTop; //trigger layout
    newbread.removeClass("new");
    newbread.css("transform", randomTransform());

    $("a#source").attr("href", photo.link);
}

function transitionend(e){
    if(e.propertyName == "opacity")
        $(e.target).remove();
    if(e.propertyName == "transform")
        showNext();
}

$(getBreadPhotos);

console.info("This website's source is public domain and is available at https://github.com/codl/www.bread.photography/");
