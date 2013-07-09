var Chat = {
  Templates: {
    userItem: Handlebars.compile('<li><div class="btn-group userFriendButton" data-toggle="buttons-checkbox"><button id="users{{key}}" class="btn users">{{key}}</button><button id="{{key}}" class="btn toggle friend">friend</button></div></li>'),
    roomItem: Handlebars.compile('<li class="button" id="rooms{{key}}"><a href=# class="btn btn-mini rooms">{{key}}</a></li>'),
    messageItem: Handlebars.compile('<tr class="tweets" id="{{objectKey}}"><td>{{userName}}</td><td>{{message}}</td><td>{{createdAt}}</td></tr>')
  }
};

//defaults
var selectedUser = "everyone";
var selectedRoom = "messages";
var myUserName;
var myFriends = [];


if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }
  myUserName = (prompt('What is your name?') || 'anonymous');
  newSearch += 'username=' + myUserName;
  window.location.search = newSearch;
}

// Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
$.ajaxPrefilter(function(settings, _, jqXHR) {
  jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
  jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
});
var populateUsersSideBar = function(data){
  var uniqueUsers = {};
  _.each(data, function(value){
    uniqueUsers[value.username] = true;
  });
  _.each(uniqueUsers, function(value, key){
    if (key !== 'undefined'){
      $('.userNav').append(Chat.Templates.userItem({
        key: key
      }));
    } else {
      $('.userNav').append(Chat.Templates.userItem({
        key: anonymous
      }));
    }
  });
};
var populateStream = function(data){
  _.each(data , function(value){
    if (value.username === undefined){ value.username = "anonymous";}
    if (value.text === undefined){ value.text = '';}
    if ((value.username === selectedUser || selectedUser === 'everyone')){
      $('#tweets').append(Chat.Templates.messageItem({
        objectKey: value.objectKey,
        userName: value.username,
        message: value.text.slice(value.text.indexOf(':') + 1),
        createdAt :moment(value.createdAt).fromNow()
      }));
    }
  });
};
var submitTweet = function(message, callBack){
  $.ajax({
    contentType: 'application/json',
    url: 'https://api.parse.com/1/classes/' + selectedRoom + '/',
    type: "POST",
    data: JSON.stringify({username: myUserName, text: message}),
    success: callBack
  });
};
var updatePage = function(){
  // get all of the data
  $.ajax('https://api.parse.com/1/classes/' + selectedRoom + '/', {
  // $.ajax('https://api.parse.com/1/classes/messages/?order=-', {
    contentType: 'application/json',
    type: 'GET',
    data: {order: '-createdAt', limit: 100 },
    success: function(data){
      $('.userNav .userFriendButton').remove();
      $('#tweets tr').remove();
      populateStream(data.results);
      populateUsersSideBar(data.results);
      toggleCorrectFriends();
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });
};
updatePage();

$('body')
.on('click', '.users', function (event) {
  selectedUser = $(this).text();
  updatePage();
});
$('body')
.on('click', '.rooms', function (event) {
  selectedRoom = $(this).text();
  updatePage();
});
$('body')
.on('click', '.rooms', function (event) {
  selectedRoom = $(this).text();
  updatePage();
});
$('body')
.on('click', '#submitMsg', function (event) {
  var msg = ' ' + $('#msgInput').val();
  $('#msgInput').val('');
  submitTweet(msg, updatePage);
  event.preventDefault();
});
$('body') // add a room
.on('click', '#addRoom', function (event) {
  makeNewRoomButton($('#inputRoom').val());
  $('#inputRoom').val('');
  event.preventDefault();
});
var makeNewRoomButton = function(key){
  $('.roomNav').append(Chat.Templates.roomItem({
    key: key
  }));
  event.preventDefault();
};
$('body')
.on('click', '.friend', function (event) {
  myFriends.push($(this).attr('id'));
  $('tr.tweets:contains(' + $(this).attr('id') + ')').addClass("info");
  event.preventDefault();
});
$('body')
.on('click', '.toggle.active', function (event) {
  myFriends.splice(myFriends.lastIndexOf($(this).attr('id')), 1);
  $('tr.tweets:contains(' + $(this).attr('id') + ')').removeClass("info");
  event.preventDefault();
});
var toggleCorrectFriends = function(){
  var userButtons = $('.toggle');
  for (var i=0; i<myFriends.length; i++){
    for (var j = 0; j < userButtons.length; j++){
      if ( $userButtons[j].attr('id') ===  myFriends[i]){
        userButtons[j].addClass('active');
      }
    }
  }
};











