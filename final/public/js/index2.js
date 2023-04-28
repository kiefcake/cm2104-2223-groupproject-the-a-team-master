$(function(){

    //setting the url to get the poster by attaching the poster location variable to this url
    var pageNum;
    const getPoster = 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2'
    getApiData(1)
    // ijnitiating the function
    $("#getfotm").submit(function() {
        //search bar value
        var pageNum = $("#pageNum").val();
        //calling the api function
        getApiData(pageNum)
        //stops the page from refershing
        return false
        
    
    })

   
    

    function getApiData(pageNum){
        //url for themovieDatabase 
        
        var page = "page=" + pageNum

        var url = "https://api.themoviedb.org/3/movie/upcoming?api_key=3769b2b9e06f3f0431a9bd6b7d46575e&language=en-US&" + page;

        //use jquery json shortcut

        $.getJSON(url, function(jsondata){
            
            printJSON(jsondata)
            


        })
       
        



    }


    function printJSON (jsondata){
        //string to contain the html code to inject
        pageNum = "The amount of pages is "+ jsondata.total_pages + ' enter the desired page number.'
        $("#amount").html(pageNum)

        var hString = "";
        for (var i=0; i<20; i++){
            var title = jsondata.results[i].original_title;
            var poster = jsondata.results[i].poster_path
            
            var year = jsondata.results[i].release_date
            var id = jsondata.results[i].id
            var overview = jsondata.results[i].overview
            var date = new Date(year).getTime()
            var vote  = jsondata.results[i].vote_average
            var voteC  = jsondata.results[i].vote_count
            var newTitle = undefined(title)
            var newImage = nullImage(poster)
           
            
            countDown(date, id)
            
    
            
            hString +="<div class = 'resultM'>"+ '<img class = "posterImage" alt="poster" ' + 'src = "'+newImage+ '"' +'>'
            +"<p class = 'title'>"+newTitle+"</p>"+ '<p class = "mDesc">'+overview+'</p>'+"<p class ='countDown' id = '"+id+"'></p>"+"<p  id ='vote'>"+'Rating '+vote+'<span>&#11088;</span>'+'<br>'+voteC+' votes'+"</p>"+"</div>"
            


            

            

            }
        
        


        $("#resultsbox").html(hString)
    }
    function countDown(date, id){
        // Set the date we're counting down to
        var countDownDate = date ;

        // Update the count down every 1 second
        var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;
        // console.log(countDownDate)
        // console.log(now)
        

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        

        // Display the result in the element with id="demo"
        document.getElementById(id).innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById(id).innerHTML = "The Film is Out";
        }
        }, 1000);
        

        



    }
    function undefined(title){
        if (typeof title === 'undefined'){
            return "No Title"
        }else{return title}

    




    }
    function undefined(title){
        if (typeof title === 'undefined'){
            return "No Title"
        }else{return title}

    




    }

    function nullImage(poster){
        if (poster == null){
            return "pexels-photo-7234378.jpeg"
        }else{
            return getPoster+poster
        }}
   




});