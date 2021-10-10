## EECS1012 Project
### Team name: MYS
### Project title: Rock-paper-scissors Game Website
### Team members:
* Kai-An Yang, kevin357@my.yorku.ca, Section A Lab03
* Guanyu Shi, s99999@my.yorku.ca, Section A Lab 03
* Weiye Mao, wayne13@my.yorku.ca, Section A Lab 04
### Description:
>This is the website that contains the rock-paper-scissors game and the weather dashboard function. Users play against to PC by selecting one of the three icons, the three icons will be rock, paper, and scissors. At the same time, the pc will choose the random icon in each round as well. After that, the website will judge win, lose or tie and record them to show on the scoreboard. In further, we will devise some strategy for AI which would be more challenging for player. The weather dashboard is also one of the functions of the website, it can show the temperature and some simple weather stats based on the users’ locations.
### Functional requirements:
1.	User can view main menu which involves a cover image, a start game button a ‘help subpage’ button and an ‘about subpage’ button, three buttons lie in a column.
2.	User can enter game page from main menu by click start game button.
3. 	User can exit game page to main menu by click exit button, and scores will be reset.
4.	User can play rock-paper-scissors game with AI in game page, which also has an exit button on top bar.
5.	User can view scoreboard indicate win and lose stats in game page, locate on the left.
6.	Webpage will ask user to access to user’s location by a notification, and user click ‘agree’ or ‘disagree’.
7.	User can view weather dashboard based on location, and the dashboard locates on top bar.
8.	User can hide/unhide weather dashboard by click a hide/unhide button beside the dashboard.
9.	User can switch language settings between [Simplified Chinese/Traditional Chinese/English] on both main page and game page.
10.	User can view ‘help’ subpage from both main menu and game page, the help button in game page locates on top bar.
11.	User can view rules and game instructions from ‘help’ subpage, the help button in game page locates on top bar.
12.	User can view ‘about’ subpage from main menu.
13.	User can view authors and contacts from ‘about’ subpage.
14.	AI will be developed with some strategy that perform better than random, the strategy will collect history round and using and using statistics and probability to predict what is next play by the enemy, e.g., last round is [Rock, Paper, Enemy win], we can check what will enemy play in next round from this state in history, and raise next action for AI.