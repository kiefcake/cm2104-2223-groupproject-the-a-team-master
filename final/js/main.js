$(function(){
    var plot;


    // prepare the variables for the film description function 
    

    // document ready
    //alert("ready")

    $("#searchform").submit(function() {
        //search bar value
        var searchTearms = $("#searchterms").val();
        //calling the api function
        getApiData(searchTearms)
        //stops the page from refershing
        return false
        
    
    })
    


    function getApiData(searchTearms){
        //url to be used 

        

        var url = "https://www.omdbapi.com/?apikey=c4bea658&s=" + searchTearms;

        //use jquery json shortcut

        $.getJSON(url, function(jsondata){
            
            printJSON(jsondata)
            
            


        })
        



    }


    function printJSON (jsondata){
        //string to contain the html code to inject
        

        var hString = "";
        for (var i=0; i<10; i++){
            
            var title = jsondata.Search[i].Title;
            
            var poster = jsondata.Search[i].Poster
            
            var year = jsondata.Search[i].Year
            var jsn = getApiplot(title)
            var plot = jsn.Plot
            var id = jsn.imdbID
            var vote = jsn.imdbRating
            var voteC = jsn.imdbVotes
            var date = new Date(year).getTime()
            

            
            
            
            
        
            
            hString +="<div class='border'>"+ '<img class="tposterImage" '   + 'src = "'+ poster+ '"' +'>'
            +"<p class='title'>"+title+"</p>"+"<p class='serchdescrip'>"+plot+"</p>"+ "<p class='year'>"+ year+"</p>"+
            "<p class ='countDown' id = '"+id+"'></p>"+"<p  id ='vote'>"+'Rating '+vote+'<span>&#11088;</span>'+'<br>'+voteC+' votes'+"</p>"+"</div>"

            
            


        }
        
        


        $("#results").html(hString)

    }

    // new function to load the film descryption 

    function getApiplot(title){
        //url to be used 
        

        

        var url = "https://www.omdbapi.com/?apikey=c4bea658&t=" + title;

        //use jquery json shortcut
        var data;

        $.ajax({
            async: false, //thats the trick
            url: url,
            dataType: 'json',
            success: function(response){
               data = response;
            }
        });

        return data;
       

        
        

        
        
        

        
        
        

        
        
    
    }
    
    
    
    
   




});
