# Required Library Installation In pubspec.yaml [08-November-2019]
    dependencies:
  flutter:
    sdk: flutter

  # The following adds the Cupertino Icons font to your application.
  # Use with the CupertinoIcons class for iOS style icons.
  cupertino_icons: ^0.1.2
  material_design_icons_flutter: 3.2.3695
  flutter_icons: ^0.1.4
  fl_chart: ^0.1.5
  http: ^0.12.0+2
  shared_preferences: ^0.5.3+4
  flutter_facebook_login: ^2.0.1
  google_sign_in: ^4.0.6
  flutter_twitter_login: ^1.1.0
  linkedin_login: ^0.1.8
  intl: ^0.15.8
  bezier_chart: ^1.0.14
  syncfusion_flutter_charts: ^1.0.0-beta.1
  flutter_webview_plugin: ^0.3.8
  fluttertoast: ^3.0.3

  
  
  - ToDo After Adding Library
  
  #Android 
  - in Gradle files/build.gradle(module.app)
  
		  def localProperties = new Properties()
		def localPropertiesFile = rootProject.file('local.properties')
		if (localPropertiesFile.exists()) {
			localPropertiesFile.withReader('UTF-8') { reader ->
				localProperties.load(reader)
			}
		}

		def flutterRoot = localProperties.getProperty('flutter.sdk')
		if (flutterRoot == null) {
			throw new GradleException("Flutter SDK not found. Define location with flutter.sdk in the local.properties file.")
		}

		def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
		if (flutterVersionCode == null) {
			flutterVersionCode = '1'
		}

		def flutterVersionName = localProperties.getProperty('flutter.versionName')
		if (flutterVersionName == null) {
			flutterVersionName = '1.0'
		}

		apply plugin: 'com.android.application'
		apply from: "$flutterRoot/packages/flutter_tools/gradle/flutter.gradle"
		
		#add keystore properties for building signed APk

		def keystoreProperties = new Properties()
		def keystorePropertiesFile = rootProject.file('key.properties')
		if (keystorePropertiesFile.exists()) {
			keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
		}

		android {
			compileSdkVersion 28

			lintOptions {
				disable 'InvalidPackage'
			}

			defaultConfig {
				// TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
				applicationId "com.example.aistock"
				minSdkVersion 16
				targetSdkVersion 28
				versionCode flutterVersionCode.toInteger()
				versionName flutterVersionName
				testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
			}
			
			#add this code for build signed apk
			signingConfigs {
			   release {
				   keyAlias keystoreProperties['keyAlias']
				   keyPassword keystoreProperties['keyPassword']
				   storeFile file(keystoreProperties['storeFile'])
				   storePassword keystoreProperties['storePassword']
			   }
		   }
			buildTypes {
				release {
					// TODO: Add your own signing config for the release build.
					// Signing with the debug keys for now, so `flutter run --release` works.
					signingConfig signingConfigs.debug
					signingConfig signingConfigs.release
				}
			}
		}

		flutter {
			source '../..'
		}
		
		
		
		#add this dependencies for facebook-login

		dependencies {
			testImplementation 'junit:junit:4.12'
			androidTestImplementation 'com.android.support.test:runner:1.0.2'
			androidTestImplementation 'com.android.support.test.espresso:espresso-core:3.0.2'
			implementation 'com.facebook.android:facebook-login:[5,6)'
		}
		
		
		
		
		# In AndroidManifest.xml add this line before <application> tag for internet access 
		
		<uses-permission android:name="android.permission.INTERNET" /> 
		
		####### For Android
		
		
		----> flutter_facebook_login  (link for dependency = https://pub.dev/packages/flutter_facebook_login)
			This assumes that you've done the "Associate Your Package Name and Default Class with Your App" and "Provide the Development and Release Key Hashes for Your App" in the the Facebook Login documentation for Android site.
			After you've done that, find out what your Facebook App ID is. You can find your Facebook App ID in your Facebook App's dashboard in the Facebook developer console.
			Once you have the Facebook App ID figured out, youll have to do two things.
			First, copy-paste the following to your strings resource file. If you don't have one, just create it.

			<your project root>/android/app/src/main/res/values/strings.xml

			<?xml version="1.0" encoding="utf-8"?>
			<resources>
				<string name="app_name">Your App Name here.</string>

				<!-- Replace "000000000000" with your Facebook App ID here. -->
				<string name="facebook_app_id">000000000000</string>

				<!--
				  Replace "000000000000" with your Facebook App ID here.
				  **NOTE**: The scheme needs to start with `fb` and then your ID.
				-->
				<string name="fb_login_protocol_scheme">fb000000000000</string>
			</resources>
			Then you'll just have to copy-paste the following to your Android Manifest:

			<your project root>/android/app/src/main/AndroidManifest.xml

			<meta-data android:name="com.facebook.sdk.ApplicationId"
				android:value="@string/facebook_app_id"/>

			<activity android:name="com.facebook.FacebookActivity"
				android:configChanges=
						"keyboard|keyboardHidden|screenLayout|screenSize|orientation"
				android:label="@string/app_name" />

			<activity
				android:name="com.facebook.CustomTabActivity"
				android:exported="true">
				<intent-filter>
					<action android:name="android.intent.action.VIEW" />
					<category android:name="android.intent.category.DEFAULT" />
					<category android:name="android.intent.category.BROWSABLE" />
					<data android:scheme="@string/fb_login_protocol_scheme" />
				</intent-filter>
			</activity>
			
		
		---> google_sign_in (link for dependency = https://pub.dev/packages/google_sign_in)
		
				To access Google Sign-In, you'll need to make sure to register your application.
				You don't need to include the google-services.json file in your app unless you are using Google services that require it. You do need to enable the OAuth APIs that you want, using the Google Cloud Platform API manager. For example, if you want to mimic the behavior of the Google Sign-In sample app, you'll need to enable the Google People API.
				Make sure you've filled out all required fields in the console for OAuth consent screen. Otherwise, you may encounter APIException errors.
		
		
		
		####### For ios
		
		--->  flutter_facebook_login (link for dependency = https://pub.dev/packages/flutter_facebook_login)
		
			This assumes that you've done the "Register and Configure Your App with Facebook" step in the the Facebook Login documentation for iOS site. (Note: you can skip "Step 2: Set up Your Development Environment" and "Step 5: Connect Your App Delegate").

			After you've done that, find out what your Facebook App ID is. You can find your Facebook App ID in your Facebook App's dashboard in the Facebook developer console.

			Once you have the Facebook App ID figured out, then you'll just have to copy-paste the following to your Info.plist file, before the ending </dict></plist> tags. (NOTE: If you are using this plugin in conjunction with for example google_sign_in plugin, which also requires you to add CFBundleURLTypes key into Info.plist file, you need to merge them together).

			<your project root>/ios/Runner/Info.plist

			<key>CFBundleURLTypes</key>
			<array>
				<!--
				<dict>
				... Some other CFBundleURLTypes definition.
				</dict>
				-->
				<dict>
					<key>CFBundleURLSchemes</key>
					<array>
						<!--
						  Replace "000000000000" with your Facebook App ID here.
						  **NOTE**: The scheme needs to start with `fb` and then your ID.
						-->
						<string>fb000000000000</string>
					</array>
				</dict>
			</array>

			<key>FacebookAppID</key>

			<!-- Replace "000000000000" with your Facebook App ID here. -->
			<string>000000000000</string>
			<key>FacebookDisplayName</key>

			<!-- Replace "YOUR_APP_NAME" with your Facebook App name. -->
			<string>YOUR_APP_NAME</string>

			<key>LSApplicationQueriesSchemes</key>
			<array>
				<string>fbapi</string>
				<string>fb-messenger-share-api</string>
				<string>fbauth2</string>
				<string>fbshareextension</string>
			</array>
			
			
		---> google_sign_in (link for dependency = https://pub.dev/packages/google_sign_in)
		
			-	First register your application.
			-	Make sure the file you download in step 1 is named GoogleService-Info.plist.
			-	Move or copy GoogleService-Info.plist into the [my_project]/ios/Runner directory.
			-	Open Xcode, then right-click on Runner directory and select Add Files to "Runner".
			-	Select GoogleService-Info.plist from the file manager.
			-	A dialog will show up and ask you to select the targets, select the Runner target.
			-	Then add the CFBundleURLTypes attributes below into the [my_project]/ios/Runner/Info.plist file.
				<!-- Put me in the [my_project]/ios/Runner/Info.plist file -->
				<!-- Google Sign-in Section -->
				<key>CFBundleURLTypes</key>
				<array>
					<dict>
						<key>CFBundleTypeRole</key>
						<string>Editor</string>
						<key>CFBundleURLSchemes</key>
						<array>
							<!-- TODO Replace this value: -->
							<!-- Copied from GoogleService-Info.plist key REVERSED_CLIENT_ID -->
							<string>com.googleusercontent.apps.861823949799-vc35cprkp249096uujjn0vvnmcvjppkn</string>
						</array>
					</dict>
				</array>
				
				
		----> flutter_webview_plugin (link for dependency = https://pub.dev/packages/flutter_webview_plugin)
		
				In order for plugin to work correctly, you need to add new key to ios/Runner/Info.plist

				<key>NSAppTransportSecurity</key>
				<dict>
					<key>NSAllowsArbitraryLoads</key>
					<true/>
					<key>NSAllowsArbitraryLoadsInWebContent</key>
					<true/>
				</dict>
				NSAllowsArbitraryLoadsInWebContent is for iOS 10+ and NSAllowsArbitraryLoads for iOS 9.
				
				
				
		---> Run app in Android Studio
				
			- install or open android studio 
			- open project file in android studio
			- ansure that flutter and dart plugin installed
				- for install flutter or dart 
					-	Start Android Studio.
					-	Open plugin preferences (Preferences>Plugins on macOS, File>Settings>Plugins on Windows & Linux).
					-	Select Browse repositories…, select the Flutter plug-in and click install. (also for dart plugin)
					-	Click Yes when prompted to install the Dart plugin.
					-	Click Restart when prompted.
			-after that when you first time open project in header line it will show to "get dependencies" and click on get dependencies
			- after successfully compile project connect the device and in the run the project..and for hot reload press CTR+S
			
			
			
		---> Run app in X Code
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
				
				
		---> Build Released APk	For Android
				- open android folder in android studio of flutter project
				- In menu bar click on "build" tab
				- select Generate Singned Bundle /apk
				- select Bundle or APK you want To Generate
				- enter fields  - keystore path
								- key store password
								- key alias
								- key password
				- click on next
				- select folder below path you want to store your build apk
				
				
		---> Build Released APk	For Ios
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
			
  
  
  
  
  
  
