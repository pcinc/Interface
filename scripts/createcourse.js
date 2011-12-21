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
				$("#vidPlayer").animate({marginLeft: "145px"},500);
				
			}
		else
			{
				$("#navmenu").animate({width:"180px"}, 500 );
				$("#contentright").animate({width:"200px"}, 500 );
				$("#contentleft").show("normal").animate({width:"750px"}, 500);
				$("#vidPlayer").animate({marginLeft: "55px"},500);
				$("#navhandle").css("background-image", "url(images/tabin.png)");
				menuShown = 'true';
			}
	});
	
	
	setLocation(lesson_location);
	
	
	
});


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

function createLesson(pageIndex){
	
	$("#test").empty();
    $("#test").append('<video id="lessonplayer" class="video-js" width="640" height="360" controls="controls" preload="auto" poster=""><source src="videos/'+pageIndex+'.mov" type=\'video/mp4; codecs="avc1.42E01E, mp4a.40.2"\' /><object id="flash_fallback_1" class="vjs-flash-fallback" width="640" height="360" type="application/x-shockwave-flash" data="scripts/flowplayer-3.2.7.swf"><param name="movie" value="scripts/flowplayer-3.2.7.swf" /><param name="allowfullscreen" value="false" /><param name="flashvars" value=\'config={"playlist":[ {"url": "videos/'+pageIndex+'.mov","autoPlay":false,"autoBuffering":true}]}\' /></object></video>');
	$('lessonplayer').VideoJS();
	VideoJS.setup('lessonplayer');
		
		
		
}

function parseXml(xml)
	{
		setAttributes(xml);
		createVideoArray(xml);
		createMenu(xml);
	
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
				//addToConsole(currentModuleLength);
				if(currentModuleLength > 0)
					{
						videoString += getSections(xml,moduleIndex);
					}
				else
					{
						//addToConsole(currentModuleLength);
						videoString += $('module',xml).eq(moduleIndex).find("title").first().text()+",";
					}
				
				
				//videoString += $('module',xml).eq(moduleIndex).find("title").first().text()+",";
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
				//addToConsole(currentSectionLength);
				if(currentSectionLength > 0)
					{
						
						sectionTitle += getParts(xml, moduleIndex, sectionIndex);
						
						//sectionTitle += $(xml).find('module').eq(moduleIndex).children('section').eq(sectionIndex).children('part').text();
						
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
		//addToConsole(partCount);
		while(partIndex < partCount)
			{
				partTitle += $(xml).find('module').eq(moduleIndex).children('section').eq(sectionIndex).children('part').eq(partIndex).text()+",";
				
				//addToConsole(partTitle);
				partIndex = partIndex +1;
			}
		
		return partTitle;
		
	}
	
function createMenu(xml)
	{
		
		
		
	}
	
function setTitle(courseName)
	{
		$("#coursetitle").append(courseName);	
	}
	
	
function addToConsole(message)
	{
		
				$("#console").append(message+"<br />");
	
	}
	
