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
var completeList = new Array();

// Start function when DOM has completely loaded 
$(document).ready(function(){ 
	$.ajax({
		type: "get",
		url: "data/course/course.xml",
		dataType: "xml",
		success: parseXml
	});
//modules.push(modules[moduleIndex] = $('module',xml).eq(moduleIndex).find("title").first().text());
});

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
			});
			
			setTitle(courseName);
			
	}
	

function createVideoArray(xml)
	{
		
	}
	
function createMenu(xml)
	{
		
	}
	
function setTitle(courseName)
	{
		$("#contentarea").append(courseName);	
	}