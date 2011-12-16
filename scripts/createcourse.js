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
var completedList = new Array();
var modules = new Array();
var sections = new Array();
var parts = new Array();


// Start function when DOM has completely loaded 
$(document).ready(function(){ 
	$.ajax({
		type: "get",
		url: "data/course/course.xml",
		dataType: "xml",
		success: parseXml
		
	
		
	});
	
	$(function() {
			$( "#console" ).draggable();
	});
	
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
		var courseList;
		var moduleCount = $('module',xml).length;
		var moduleIndexA = 0;
		moduleIndexB = 0;
		//var modules = new Array();
		var moduleString = '';
		
		while(moduleIndexA < moduleCount)
			{
				moduleString += $('module',xml).eq(moduleIndexA).find("title").first().text()+",";
				moduleIndexA = moduleIndexA + 1;
			}
		
		
		
		moduleString = moduleString.slice(0,moduleString.length-1);
		modules = moduleString.split(",");
		
		addToConsole(modules.join());	
		
		
		while(moduleIndexB < modules.length)
			{
				currentModuleLength = $(xml).find('module').eq(moduleIndexB).children().length;
				//addToConsole($(xml).find('module').eq(1).children().length);
				if(currentModuleLength > 2)
					{
						addToConsole(moduleIndexB);
							
					}
				else
					{
							completedList.push($(xml).find('module').eq(moduleIndexB).find('title').text());
					}
					
					moduleIndexB = moduleIndexB +1;
			}
		
		
		//getSections(xml, modules);
	}
	
	
function getSections(xml, modules)
	{
		
		moduleIndex = 0;
		
		
		
		while(moduleIndex < modules.length)
			{
				currentModuleLength = $(xml).find('module').eq(moduleIndex).children().length;
				//addToConsole($(xml).find('module').eq(1).children().length);
				if(currentModuleLength > 2)
					{
						addToConsole(moduleIndex);
							
					}
				else
					{
							completedList.push($(xml).find('module').eq(moduleIndex).find('title').text());
					}
					
					moduleIndex = moduleIndex +1;
			}
		
		
		
		//addToConsole(test);
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