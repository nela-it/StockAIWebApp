# aistock

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://flutter.dev/docs/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://flutter.dev/docs/cookbook)

For help getting started with Flutter, view our
[online documentation](https://flutter.dev/docs), which offers tutorials,
samples, guidance on mobile development, and a full API reference.



# Run app in Android Studio
 
 
## Development 
	- install or open android studio 
	- open project file in android studio
	- ansure that flutter and dart plugin installed
	- for install flutter or dart 
	- Start Android Studio.
	- Open plugin preferences (Preferences>Plugins on macOS, File>Settings>Plugins on Windows & Linux).
	- Select Browse repositories…, select the Flutter plug-in and click install. (also for dart plugin)
	- Click Yes when prompted to install the Dart plugin.
	- Click Restart when prompted.
	- after that when you first time open project in header line it will show to "get dependencies" and click on get dependencies
	- after successfully compile project connect the device and in the run the project..and for hot reload press CTR+S


# Run app in X Code

## Development 
	- Download the installation bundle to get the latest stable release of the Flutter SDK
	(visit link for download - https://flutter.dev/docs/get-started/install/macos)
			
		- Installation Of Flutter In Ios
			- Extract the file in the desired location, for example:
			- cd ~/development
			- unzip ~/Downloads/flutter_macos_v1.9.1+hotfix.6-stable.zip
			- Add the flutter tool to your path
			- export PATH="$PATH:`pwd`/flutter/bin"
			- Run the following command to see if there are any dependencies you need to install to complete the setup (for verbose output, add the -v flag)
			- flutter doctor
			- Determine the directory where you placed the Flutter SDK. You need this in Step 3.
				  Open (or create) the rc file for your shell. For example, macOS Mojave (and earlier) uses the Bash shell by default, so edit $HOME/.bashrc. macOS Catalina uses the Z shell by default, so edit $HOME/.zshrc. If you are using a different shell, the file path and filename will be different on your machine.
				  Add the following line and change [PATH_TO_FLUTTER_GIT_DIRECTORY] to be the path where you cloned Flutter’s git repo
			- export PATH="$PATH:[PATH_TO_FLUTTER_GIT_DIRECTORY]/flutter/bin"


			- Run App in Xcode
				- open project in android studio 
				- in terminal type command
					- flutter clean
					- then go to ios module using command - cd ios
					- type command - pod install
					- type command - flutter build ios
					- type command - cd ..
					- type flutter clean
					- type command - flutter build ios --release
					
				- right click on project name on the left panel in android studio
				- in flutter - click open ios module in Xcode
				- in xcode 
					- in info.plist 
						- add App Transport Security Settings
							in it child - allow Arbitrary Loads to - Yes
							
				- then select Generic Ios Device And Select Your Device And click on Play Button
			

# Build Released APk	For Android

## Build
	- open android folder in android studio of flutter project
	- In menu bar click on "build" tab
	- select Generate Singned Bundle /apk
	- select Bundle or APK you want To Generate
	- enter fields  
		-> keystore path
		-> key store password
		-> key alias
		-> key password
	- click on next
	- select folder below path you want to store your build apk 

# Build Released ipa	For iOS

## Build
	- first check all the configuration is completed of your dependency which you are using !!
		- click on Runnder on top left bar
		- click signing & capabilities
			- select Team
			- insure that signing certificate and development certificate is available
			- select Generic IOS device
			- click on product menu in menu bar
			- select archieve
			- click on validate app (next....next..finish)
			- then click on distribute app (next..next..upload)
