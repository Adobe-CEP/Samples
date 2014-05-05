QUERY = "%23test";

var tweets = [];
var tweetIndex = 0;
var count1= 0;
var count2= 0;

var incrementCount1 = function() {
  count1++;
  document.getElementById("count1").innerHTML = count1;
  csInterface.evalScript("moveLayerUp('A')");
}

var incrementCount2 = function() {
  count2++;
  document.getElementById("count2").innerHTML = count2;
  csInterface.evalScript("moveLayerUp('M')");
}

var displayCurrentTweet = function() {
  var tweet = tweets[tweetIndex];
  document.getElementById("lastTweet").innerHTML = "@" + tweet.from_user + " - " + tweet.text;
}

var cycleThroughTweets = function() {
  tweetIndex--;
  if (tweetIndex === -1) {
    tweetIndex = tweets.length - 1;
  }
  displayCurrentTweet();
};

var csInterface = new CSInterface();
var psdPath = csInterface.getSystemPath(SystemPath.EXTENSION) + "/resources/MAX.ai";
csInterface.evalScript("openDocument('" + psdPath + "')");

$.get("http://search.twitter.com/search.json?q=" + QUERY, function(data) {
  var since_id = (data.results.length > 0) ? data.results[0].id_str : "";
  setInterval(function() {
    $.get("http://search.twitter.com/search.json?q=" + QUERY + "&since_id=" + since_id, function(data) {
      for (var i = data.results.length - 1; i >= 0; i--) {
        var tweet = data.results[i];
        tweets.push(tweet);
        tweetIndex = tweets.length - 1;
        displayCurrentTweet();
        if (tweet.from_user.toUpperCase().charCodeAt(0) >= 65 && tweet.from_user.toUpperCase().charCodeAt(0) <= 76) {
          incrementCount1();
        } else {
          incrementCount2();
        }
        since_id = tweet.id_str;
      }
    });
  }, 1500);
});