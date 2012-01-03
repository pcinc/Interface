// File: createcourse.js

var courseName;
var language;
var lockstepping;
var introduction;
var theme;
var offline;
var studyguide;
var glossary;
var group;
var debugconsole;
var courseLength;
var completedList = new Array();
var videos = new Array();
var menuShown = 'true';
var pageIndex;
var lesson_location = '0';
var currentLessonName = '';
var clickIndex = 0;

// Start function when DOM has completely loaded 
$(document).ready(function(){ 
	
	$.ajax({
		type: "get",
		url: "data/course/course.xml",
		dataType: "xml",
		success: parseXml	
		
	});
	
	$('#navhandle').click(function(){
		if(menuShown === 'true')
			{
				menuShown = 'false';
				
				$("#navhandle").css("background-image", "url(images/tabout.png)");
				
				$("#navmenu").animate({width:"0px"}, 500 );
				
				$("#contentright").animate({width:"20px"}, 500 );
				
				$("#contentleft").show("normal").animate({width:"930px"}, 500);
				
				$("#player").animate({marginLeft: "145px"},500);
				
			}
		else
			{
				menuShown = 'true';
				
				$("#navmenu").animate({width:"180px"}, 500 );
				
				$("#contentright").animate({width:"200px"}, 500 );
				
				$("#contentleft").show("normal").animate({width:"750px"}, 500);
				
				$("#player").animate({marginLeft: "55px"},500);
				
				$("#navhandle").css("background-image", "url(images/tabin.png)");
				
			}
	});
	
	
	$("#menuup").click(function(){
		
		if( clickIndex > 0)
			{	
				var moveValue = ""+(-(100*clickIndex))+"px";
				
				clickIndex --;
		
				$("#menu").animate({marginTop: moveValue}, 1000);
			}
	});
	
	
	$("#menudown").click(function(){
		
		if(clickIndex < videos.length-3)
			{	
				var moveValue = ""+(-(100*clickIndex))+"px";
				
				clickIndex ++;
			
				$("#menu").animate({marginTop: moveValue}, 1000);
			}
	});	
});




function parseXml(xml)
	{
		setAttributes(xml);
		createVideoArray(xml);
		createMenu(xml);
		setLocation(lesson_location);
		loadStyle(theme);
	}
 


function setAttributes(xml)
	{
		$(xml).find("course").each(function()
			{
				courseName = $(this).attr("coursename");
				
				language = $(this).attr("language");
				
				lockstepping = $(this).attr("lockstepping");
				
				introduction = $(this).attr("introduction");
				
				theme = $(this).attr("theme");
				
				offline = $(this).attr("offline");
				
				studyguide = $(this).attr("studyguide");
				
				glossary = $(this).attr("glossary");
				
				group = $(this).attr("group");
				
				debugconsole = $(this).attr("console");
			});
			
			setTitle(courseName);
			
		$(function(){
			if(debugconsole == 'true')
				{
					$('body').append("<div id='console'></div>");
					$( "#console" ).draggable();
				}
			else
				{
					
				}
		});
			
			
		document.title= courseName;
		
		addToConsole("<span style='font-weight: bold'>Course Data</span>");
		
		addToConsole("--------------------------------------------");
		
		addToConsole("Course Name: "+courseName);
		
		addToConsole("<span id='courseLength'>Course Length: </span>");
		
		addToConsole("Language: "+language);
		
		addToConsole("Lockstepping: "+lockstepping);
		
		addToConsole("Introduction: "+introduction);
		
		addToConsole("Theme: "+theme);
		
		addToConsole("Offline Status: "+offline);
		
		addToConsole("Study Guide: "+studyguide);
		
		addToConsole("Glossary: "+glossary);
		
		addToConsole("Group: "+group);
		
		addToConsole("Console: "+console);
		
		addToConsole("--------------------------------------------");
		
	}
	

function createVideoArray(xml)
	{
		var courseList;
		var moduleCount = $('module',xml).length;
		var moduleIndex = 0;
		var videoString = '';
		
		while(moduleIndex < moduleCount)
			{
				var currentModuleLength = $(xml).find('module').eq(moduleIndex).children('section').length;
				
				if(currentModuleLength > 0)
					{
						videoString += getSections(xml,moduleIndex);
					}
				else
					{
						videoString += $('module',xml).eq(moduleIndex).find("title").first().text()+",";
					}
				
				moduleIndex = moduleIndex + 1;
			}
		
		
		
		videoString = videoString.slice(0,videoString.length-1);
		
		videos = videoString.split(",");
		
		courseLength = videos.length;
		
		$('#courseLength').append(courseLength);
		
		addToConsole("<span style='font-weight: bold'>Video List</span>");
		
		addToConsole("--------------------------------------------");
		
		$(videos).each(function()
			{
				addToConsole(this);	
			});
		
		addToConsole("--------------------------------------------");	
		
	}
	
	
function getSections(xml, moduleIndex)
	{
		var sectionTitle = "";
		var sectionIndex = 0;
		var sectionCount = $(xml).find('module').eq(moduleIndex).children('section').length;
		
		while(sectionIndex < sectionCount)
			{
				var currentSectionLength = $(xml).find('module').eq(moduleIndex).children('section').eq(sectionIndex).children('part').length;
				
				if(currentSectionLength > 0)
					{
						sectionTitle += getParts(xml, moduleIndex, sectionIndex);		
					}
				else
					{
						sectionTitle += $('module',xml).eq(moduleIndex).children('section').eq(sectionIndex).find("title").text()+",";
					}
				
				sectionIndex = sectionIndex +1;
				
			}
		
		
		return sectionTitle;
	}
	
function getParts(xml, moduleIndex, sectionIndex)
	{
		var partTitle = "";
		var partIndex = 0;
		var partCount = $(xml).find('module').eq(moduleIndex).children('section').eq(sectionIndex).children('part').length;
		
		while(partIndex < partCount)
			{
				partTitle += $(xml).find('module').eq(moduleIndex).children('section').eq(sectionIndex).children('part').eq(partIndex).text()+",";
				
				partIndex = partIndex +1;
			}
		
		return partTitle;
		
	}
	
function createMenu(xml)
	{
		var menuIndex = 0;
		
		while(menuIndex < $(videos).length)
			{
				$("#menu").append('<li onclick="createLesson('+menuIndex+')"><div id="sectionname">Module 1:</div><div id="sectiontitle">'+ videos[menuIndex]+'</div></li>');
				
				menuIndex = menuIndex +1;
			}
		}
	
function setTitle(courseName)
	{
		$("#coursetitle").append(courseName);	
	}
	
	
function addToConsole(message)
	{
		
		$("#console").append(message+"<br />");
	
	}

function setLocation(location)
	{
		if(location === '0')
			{
				pageIndex = '0';
			}
		else
			{
				pageIndex = location;
			}	
		
		createLesson(pageIndex);
	}

function createLesson(pageIndex)
	{	
		$("#test").empty();
		$("#test").append('<video id="lessonplayer" class="video-js" width="640" height="360" controls="controls" preload="auto"><source src="videos/'+pageIndex+'.mov" type=\'video/mp4; codecs="avc1.42E01E, mp4a.40.2"\' /><object id="flash_fallback_1" class="vjs-flash-fallback" width="640" height="360" type="application/x-shockwave-flash" data="scripts/flowplayer-3.2.7.swf"><param name="movie" value="scripts/flowplayer-3.2.7.swf" /><param name="allowfullscreen" value="false" /><param name="flashvars" value=\'config={"playlist":[ {"url": "videos/'+pageIndex+'.mov","autoPlay":false,"autoBuffering":true}]}\' /></object></video>');
		$('lessonplayer').VideoJS();
		VideoJS.setup('lessonplayer');
		
		currentLessonName = videos[pageIndex];
		
		setLessonName(currentLessonName);
			
	}

function setLessonName(currentLessonName)
	{
		$("#lessonname").empty();
		$("#lessonname").append(currentLessonName);
			
	}

function loadStyle(theme)
	{
		var fileref=document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", "styles/"+theme+".css")
		document.getElementsByTagName("head")[0].appendChild(fileref);
		//addToConsole("styles/"+theme+".css");
	}