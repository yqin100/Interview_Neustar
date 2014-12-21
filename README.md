Neustar Guessing Game
===================

----------

Introduction
-------------
This is a responsive web application that allows the user to guess numbers from 1-20 and you are only allow up to 5 attempts.  To play all you need to do is click on the number you're guessing.  The web application is mobile friendly and will respond to portrait or landscape view (the buttons have more columns less rows in landscape view and the reverse for portrait view).  Enjoy!

Technology
-------------
 - HTML5
 - CSS3
 - Twitter Bootstrap (3.3.1)
 - JQuery (1.11.1)
 - QUnit (1.16.0)
 - Gradle (2.0)

Design
-------------
The requirements stated the following:

 - Create web application
 - Host the web application
 - User can select a number from 1-20
 - User has 5 attempts to select the correct number
 - Written in any language

Given the requirements, my goal of the application is to be a lightweight HTML5 responsive web application.  Since there isn't any state/session that needs to be persisted, keeping all the code in the front-end is adequate.  The advantages to this design follows:

 - Web and mobile compatible
 - HTML5/CSS3 application provides easier portability to other media (e.g. Cordova to create Android/iOS versions of the application, etc.)
 - Lightweight code (i.e. easier deployments and portability)
 - Modularity (i.e. if persistence needs to be added use Ajax and RESTful design to the existing HTML5 application to separate presentation from business layers)

Custom Modifications
-------------
#### Add/Remove numbers (buttons)
To have more/less numbers (buttons) to select from, do the following:

 1. Open "my.js"
 2. Edit the object array "numbers" by adding more "false" entries in the array.

> **Note:**

> The code dynamically creates the buttons by looking into the "numbers" array object and seeing how many elements are in there.  Thus, if there are X entries in the array, there will be X buttons.

Unit Tests
-------------
To view the unit tests for the JS, click on "Test" on the top tool bar.  Or type "test.html" in the relative path on your browser.

Build
-------------
To build a new WAR do the following Gradle command.
```
gradle clean build
```