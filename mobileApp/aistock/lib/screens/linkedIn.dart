import 'dart:convert';
import 'dart:io';

import './home.dart';
import 'package:flutter/material.dart';
import 'package:linkedin_login/linkedin_login.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'login.dart';
class LinkedinLogin extends StatefulWidget {
  LinkedinLogin({Key key}) : super(key: key);

  _LinkedinLoginState createState() => _LinkedinLoginState();
}
_loginApi(context,reqBody) async {
    HttpClient client = new HttpClient();
                //client.badCertificateCallback = ((X509Certificate cert, String host, int port) => true);
                String url ='https://stockzai.com/api/user/login';
                HttpClientRequest request = await client.postUrl(Uri.parse(url));
                request.headers.set('content-type', 'application/json');

                request.add(utf8.encode(json.encode(reqBody)));
                HttpClientResponse response = await request.close();
                if(response.statusCode == 200){
                  String reply = await response.transform(utf8.decoder).join();
                    Map data = json.decode(reply);
                    print(data);
                    if(data["message"] == "Success"){
                      SharedPreferences storage = await SharedPreferences.getInstance();
                      storage.setString('userData', reply);
                      Navigator.pushReplacementNamed(context,Home.routeName,arguments: UserData(data["username"]));
                    }
                }
                else{
                    String reply = await response.transform(utf8.decoder).join();
                    Map data = json.decode(reply);
                    print(data["message"]);
                }
}
class _LinkedinLoginState extends State<LinkedinLogin> {
  @override
  Widget build(BuildContext context) {
    return Container(
       child:LinkedInUserWidget(
       redirectUrl: "http://localhost:2000/",
       clientId: "81dlzfy0bvoebd",
       clientSecret: "52E4iXOgrUROMVHf",
       onGetUserProfile:
           (LinkedInUserModel linkedInUser)  {
                print('*************************************************************');
                print(linkedInUser);
                print('Access token ${linkedInUser.token.accessToken}');
                print('First name: ${linkedInUser.firstName.localized.label}');
                print('Last name: ${linkedInUser.lastName.localized.label}');
               // print('Last name: ${linkedInUser.email}');
                var reqBody = {
            "apiType": "socialLogin",
            "providerData": {
                  "email":"",
                  "firstName": linkedInUser.firstName.localized.label,
                  "id": linkedInUser.userId,
                  "lastName": linkedInUser.lastName.localized.label,
                  "provider": "LINKEDIN",
                  "username":linkedInUser.firstName.localized.label +" "+linkedInUser.lastName.localized.label
              }};
                 print(reqBody);
              _loginApi(context, reqBody);
            },
            catchError: (LinkedInErrorObject error) {
              print('***********************ERROR*****************************');
              print(
                  'Error description: ${error.description},'
                  ' Error code: ${error.statusCode.toString()}');
              },
    ) ,
    );
  }
}