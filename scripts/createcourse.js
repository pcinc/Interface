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
var debugConsole;
var courseLength;
var completedList = new Array();
var videos = new Array();
var menuShown = 'true';
var currentLocation = 0;
var currentLessonName = '';
var clickIndex = 0;
var locations = new Array();
var location;
var console;
var completedList = new Array;

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
				clickIndex --;
				var moveValue = ""+(-(100*clickIndex))+"px";
				
				
		
				$("#menu").animate({marginTop: moveValue}, 1000);
			}
	});
	
	
	$("#menudown").click(function(){
		
		if(clickIndex < videos.length-3)
			{	
				clickIndex ++;
				var moveValue = ""+(-(100*clickIndex))+"px";
				
				
			
				$("#menu").animate({marginTop: moveValue}, 1000);
			}
	});	
	
	
	$("#navmenu").bind("mousewheel",function(ev, delta) {
    var scrollTop = $(this).scrollTop();
    $(this).scrollTop(scrollTop-Math.round(delta));
});
});




function parseXml(xml)
	{
		setAttributes(xml);
		createVideoArray(xml);
		setLocation(currentLocation,xml);
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
				
				debugConsole = $(this).attr("console");
			});
			
			setTitle(courseName);
			
		$(function(){
			if(debugConsole == 'true')
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
		
		addToConsole("Console: "+debugConsole);
		
		addToConsole("--------------------------------------------");
		
	}
	

function createVideoArray(xml)
	{
		var courseList;
		var moduleCount = $('module',xml).length;
		var moduleIndex = 0;
		var videoString = '';
		var locationsString = '';
		
		while(moduleIndex < moduleCount)
			{
				var currentModuleLength = $(xml).find('module').eq(moduleIndex).children('section').length;
				
				if(currentModuleLength > 0)
					{
						
						videoString += getSections(xml,moduleIndex);
						
					}
				else
					{
						videoString += "m"+moduleIndex+"/@"+$('module',xml).eq(moduleIndex).find("title").first().text()+",";
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
						sectionTitle += "m"+moduleIndex+"s"+(sectionIndex+1)+"/@"+$('module',xml).eq(moduleIndex).children('section').eq(sectionIndex).find("title").text()+",";
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
				partTitle += "m"+moduleIndex+"s"+(sectionIndex+1)+"p"+(partIndex+1)+"/@"+$(xml).find('module').eq(moduleIndex).children('section').eq(sectionIndex).children('part').eq(partIndex).text()+",";
				
				partIndex = partIndex +1;
			}
		
		return partTitle;
		
	}
	
function createMenu(xml)
	{
		
		$("#menu").empty;
		var menuIndex = 0;
		
		var str = '';
		//str = '<li id="modulebreak" style="width: 176px; height: 16px; background-image:url(\'images/menubreak.png\');"><div></div></li><li onclick="createLesson('+menuIndex+')"><div id="sectionname">'+getLocation(menuIndex,itemName[0], xml)+'</div><div id="sectiontitle">'+ itemName[1]+'</div></li>';
		
		$(videos).each(function(){
		
		var itemName = videos[menuIndex].split('/@');				
					
		str = createMenuItem(xml, menuIndex, itemName[1],itemName[0]);
		
		menuIndex ++;
		
		$("#menu").append(str);
		
		
			});
	}
	
	
function createMenuItem(xml, menuIndex, itemName, itemLocation)
	{
		var menuItemString = '';
		//addToConsole(menuIndex);
		if(group == 'tech')
			{
				if(introduction == 'true' )
					{
						if(itemLocation.indexOf('m0') != -1)
							{				
								menuItemString = '<li id="modulebreak" style="width: 176px; height: 16px; "><div id="breaktitle"><span>'+langCheck('introduction',itemLocation.split('m')[1])+'</span><div id="menudeco"></div></div></li><li id="menuItem" onclick="createLesson('+menuIndex+')"><div id="sectionname">'+getLocation(menuIndex,itemLocation, xml)+'</div><div id="sectiontitle">'+ itemName+'</div></li>';
							}
						else if(itemLocation.indexOf('m') != -1 &&itemLocation.length < 3)
							{
								
								if(itemLocation === 'm'+($(xml).find('module').length - 1) )
									{
										menuItemString = '<li id="modulebreak" style="width: 176px; height: 16px; "><div id="breaktitle"><span>'+langCheck('conclusion',itemLocation.split('m')[1])+'</span><div id="menudeco"></div></div></li><li id="menuItem" onclick="createLesson('+menuIndex+')"><div id="sectionname">'+getLocation(menuIndex,itemLocation, xml)+'</div><div id="sectiontitle">'+ itemName+'</div></li>';			
									}
								else
									{
										menuItemString = '<li id="modulebreak" style="width: 176px; height: 16px; "><div id="breaktitle"><span>'+langCheck('module',itemLocation.split('m')[1])+'</span><div id="menudeco"></div></div></li><li id="menuItem" onclick="createLesson('+menuIndex+')"><div id="sectionname">'+getLocation(menuIndex,itemLocation, xml)+'</div><div id="sectiontitle">'+ itemName+'</div></li>';
									}
							}
						else if(itemLocation.indexOf('s1') != -1)
							{
								menuItemString = '<li id="modulebreak" style="width: 176px; height: 16px;"><div id="breaktitle"><span>'+langCheck('section',itemLocation.split('m')[1].split('s')[0])+'</span><div id="menudeco"></div></div></li><li id="menuItem" onclick="createLesson('+menuIndex+')"><div id="sectionname">'+getLocation(menuIndex,itemLocation, xml)+'</div><div id="sectiontitle">'+ itemName+'</div></li>';
							}
						else if(itemLocation.indexOf('p1') != -1)
							{
								menuItemString = '<li id="modulebreak" style="width: 162px; height: 16px; margin: 10px 0px 0px 10px;"><div id="breaktitle"><span>'+langCheck('part',itemLocation.split('m')[1].split('s')[1].split('p')[0])+'</span><div id="menudeco"></div></div></li><li id="menuItem" onclick="createLesson('+menuIndex+')" style="width: 142px; height: 80px; margin-left: 28px;"><div id="sectionname" style=" width: 142px; font-size:6pt;">'+getLocation(menuIndex,itemLocation, xml)+'</div><div id="sectiontitle" style="width:142px;font-size:8pt;">'+ itemName+'</div></li>';
							}
						else
							{
								if(itemLocation.indexOf('p') != -1)
									{
										menuItemString = '<li id="menuItem" onclick="createLesson('+menuIndex+')" style="width: 142px; height: 80px; margin-left: 28px;"><div id="sectionname" style=" width: 142px;font-size:6pt;">'+getLocation(menuIndex,itemLocation, xml)+'</div><div id="sectiontitle" style="width:142px;font-size:8pt;">'+ itemName+'</div></li>';
									}
								else
									{
										menuItemString = '<li id="menuItem" onclick="createLesson('+menuIndex+')"><div id="sectionname">'+getLocation(menuIndex,itemLocation, xml)+'</div><div id="sectiontitle">'+ itemName+'</div></li>';
									}
							}
					}
			
			else
				{
				}
			}
		else if(group == "sales")
			{
				if(introduction == 'true' )
					{
						if(itemLocation.indexOf('m0') != -1)
							{				
								menuItemString = '<li id="menuItem" onclick="createLesson('+menuIndex+')"><div id="sectionname">'+getLocation(menuIndex,itemLocation, xml)+'</div><div id="sectiontitle">'+ itemName+'</div></li>';
							}
						else
							{
								if(itemLocation === 'm'+($(xml).find('module').length - 1) )
									{
										menuItemString = '<li id="menuItem" onclick="createLesson('+menuIndex+')"><div id="sectionname">'+getLocation(menuIndex,itemLocation, xml)+'</div><div id="sectiontitle">'+ itemName+'</div></li>';			
									}
								else
									{
										menuItemString = '<li id="menuItem" onclick="createLesson('+menuIndex+')"><div id="sectionname">'+getLocation(menuIndex,itemLocation, xml)+'</div><div id="sectiontitle">'+ itemName+'</div></li>';
									}
							}
					}
				else
			{
				
			}
					
			}
		else
			{
			}
		
		//menuItemString = '<li id="modulebreak" style="width: 176px; height: 16px; background-image:url(\'images/menubreak.png\');"><div></div></li><li onclick="createLesson('+menuIndex+')"><div id="sectionname">'+getLocation(menuIndex,itemName[0], xml)+'</div><div id="sectiontitle">'+ itemName[1]+'</div></li>';
		
		return menuItemString;
	}
	
	
	
	function langCheck(type, location)
		{
			
			correctLange = '';
						
			if(language == 'sp')
				{
					
					
				if(type == 'module')
						{
							correctLang = 'Módulo '+ location;
						}
					else if(type == 'section')
						{
							correctLang = 'Módulo '+ location;
						}
					else if(type == 'part')
						{
							correctLang = 'Sección '+ location;
						}
					else if(type == 'introduction')
						{
							correctLang = 'Introducción ';
						}
					else if(type == 'conclusion')
						{
							correctLang = 'Conclusión ';
						}	
					
				}
			else if(language == 'fr')
				{
					
					if(type == 'module')
						{
							correctLang = 'Module '+ location;
						}
					else if(type == 'section')
						{
							correctLang = 'Module '+ location;
						}
					else if(type == 'part')
						{
							correctLang = 'Section '+ location;
						}
					else if(type == 'introduction')
						{
							correctLang = 'Présentation ';
						}
					else if(type == 'conclusion')
						{
							correctLang = 'Conclusion ';
						}	
				}
			else if(language == 'pr')
				{
					
					
					if(type == 'module')
						{
							correctLang = 'Módulo '+ location;
						}
					else if(type == 'section')
						{
							correctLang = 'Módulo '+ location;
						}
					else if(type == 'part')
						{
							correctLang = 'Seção '+ location;
						}
					else if(type == 'introduction')
						{
							correctLang = 'Apresentação ';
						}
					else if(type == 'conclusion')
						{
							correctLang = 'Conclusão ';
						}	
				}
			else
				{
					if(type == 'module')
						{
							correctLang = 'Module '+ location;
						}
					else if(type == 'section')
						{
							correctLang = 'Module '+ location;
						}
					else if(type == 'part')
						{
							correctLang = 'Section '+ location;
						}
					else if(type == 'introduction')
						{
							correctLang = 'Introduction';
						}
					else if(type == 'conclusion')
						{
							correctLang = 'Conclusion';
						}
				}
			
			
			return correctLang;	
		}
	
	
function langCheckForTitle(type, location)
		{
			
			correctLange = '';
			
			
			if(language == 'sp')
				{
					
					
				if(type == 'module')
						{
							correctLang = 'Módulo '+ location;
						}
					else if(type == 'section')
						{
							correctLang = 'Sección '+ location;
						}
					else if(type == 'part')
						{
							correctLang = 'Parte '+ location;
						}
					else if(type == 'introduction')
						{
							correctLang = 'Introducción ';
						}
					else if(type == 'conclusion')
						{
							correctLang = 'Conclusión ';
						}	
					else if(type == 'station')
						{
							correctLang = 'Estación ' + location;
						}
					
				}
			else if(language == 'fr')
				{
					
					if(type == 'module')
						{
							correctLang = 'Module '+ location;
						}
					else if(type == 'section')
						{
							correctLang = 'Section '+ location;
						}
					else if(type == 'part')
						{
							correctLang = 'partie '+ location;
						}
					else if(type == 'introduction')
						{
							correctLang = 'Présentation ';
						}
					else if(type == 'conclusion')
						{
							correctLang = 'Conclusion ';
						}	
					else if(type == 'station')
						{
							correctLang = 'Gare ' + location;
						}
				}
			else if(language == 'pr')
				{
					
					
					if(type == 'module')
						{
							correctLang = 'Módulo '+ location;
						}
					else if(type == 'section')
						{
							correctLang = 'Seção '+ location;
						}
					else if(type == 'part')
						{
							correctLang = 'Parte '+ location;
						}
					else if(type == 'introduction')
						{
							correctLang = 'Apresentação ';
						}
					else if(type == 'conclusion')
						{
							correctLang = 'Conclusão ';
						}	
					else if(type == 'station')
						{
							correctLang = 'Estação ' + location;
						}
				}
			else
				{
					if(type == 'module')
						{
							correctLang = 'Module '+ location;
						}
					else if(type == 'section')
						{
							correctLang = 'Module '+ location;
						}
					else if(type == 'part')
						{
							correctLang = 'Section '+ location;
						}
					else if(type == 'introduction')
						{
							correctLang = 'Introduction';
						}
					else if(type == 'conclusion')
						{
							correctLang = 'Conclusion';
						}
					else if(type == 'station')
						{
							correctLang = 'Station ' + location;
						}
				}
			
			
			return correctLang;	
		}
	
function getLocation(menuIndex, itemName,xml)
	{
		var location;
		
		//addToConsole('m'+($(xml).find('module').length -1));
		
		
		if(group == 'sales')
			{
				if(itemName.indexOf('m0') != -1 || itemName.indexOf('m'+($(xml).find('module').length-1)) != -1)
					{
						location = '';
					}
				else if(itemName.indexOf('m') != -1)
					{
							location = langCheckForTitle('station',itemName.split('m')[1]);
					}
			}
		else
			{
				
				if(itemName.indexOf('m0') != -1 || itemName.indexOf('m'+($(xml).find('module').length-1)) != -1)
					{
						location = '';
					}
				else if(itemName.indexOf('p') != -1)
					{
							location = langCheckForTitle('part',itemName.split('p')[1]);
					}
				else if(itemName.indexOf('s') != -1)
					{
						location = langCheckForTitle('section',itemName.split('s')[1]);
					}
				else if(itemName.indexOf('m') != -1)
					{
						location = langCheckForTitle('module',itemName.split('m')[1]);	
					}
			}
		
		
		return location;
	}
	
function setTitle(courseName)
	{
		$("#coursetitle").append(courseName);	
	}
	
	
function addToConsole(message)
	{
		
		$("#console").append(message+"<br />");
	
	}

function setLocation(location,xml)
	{
		if(location === '0')
			{
				pageIndex = '0';
			}
		else
			{
				pageIndex = location;
			}	
		
		createLesson(pageIndex, xml);
	}

function createLesson(itemIndex, xml)
	{	
		pageIndex = itemIndex;
		$('#menu').empty();
		createMenu(xml);
		var location;
		location = videos[itemIndex].split('/@')[0];
		lessonType(location,xml);
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
	
function lessonType(itemLocation, xml)
	{
		$("#vidPlayer").jPlayer("destroy");
		var isExercise = checkIfExercise(itemLocation,xml);
		
		
		
		if(isExercise == 'true')
			{
				
			}
		else
			{
				currentLessonName = videos[pageIndex].split('/@')[1];
				setLessonName(currentLessonName);
				createPlayer(pageIndex);
			}
			
	}
	
function createPlayer(video)
	{
		
		
      $("#vidPlayer").jPlayer({
      ready: function () {
        $(this).jPlayer("setMedia", {
        m4v: "videos/"+video+".mov"
        }).jPlayer("play");
		return false; 
      },
	  ended: lessonComplete(),
      swfPath: "",
      supplied: "m4v",
      cssSelectorAncestor: "",
      size: {
        width: "640px",
        height: "360px"
      },
	  //errorAlerts: "true"
	  
    });
  
	}
	
function checkIfExercise(location, xml)
	{
		var isExercise = 'false';
		var moduleLocation = $(xml).find('module');
		var test = 3;
		
		if(location.indexOf('p') != -1)
			{
				//addToConsole($(xml).find('module').eq((location.split('m')[1]-1)).find('title').text());
				
				
				//addToConsole($(xml).find('module').eq(location.split('m')[1].split('s')[1]).find('section').eq(location.split('s')[1].split('p')[1]).find('p').eq(location.split('p')[1]).attr('type'));
				//addToConsole($(xml).find('module').eq((location.split('m')[1].split('s')[1])-1).find('section').eq((location.split('s')[1].split('p')[1])-1).find('p').eq((location.split('p')[1])-1).find('title').text());
			}
		else if(location.indexOf('s') != -1)
			{
			}
		else if(location.indexOf('m') != -1)
			{
				//addToConsole($(xml).find('module').eq(location.split('m')[0]).find('title').text());
				//addToConsole(location.split('m')[1]);
				//$("#"+menu+" .itemMenu li:eq("+item1+")").addClass("highlight");
				addToConsole($(moduleLocation).eq(test).find('title').first().text());
			}
		else
			{
			
			}
		
		
		return isExercise;
	}
	
	function getName(location, xml)
		{
				
		}
	
	function lessonComplete()
		{
			
			completedList.push(pageIndex);	
			//videoCompleted(pageIndex);
			doLMSSetValue("cmi.core.lesson_location", pageIndex);
	
	
		}