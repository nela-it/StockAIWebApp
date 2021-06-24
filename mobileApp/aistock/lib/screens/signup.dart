import 'dart:convert';
import 'dart:io';
import 'package:fluttertoast/fluttertoast.dart';

import './home.dart';

import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import './login.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_facebook_login/flutter_facebook_login.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter_twitter_login/flutter_twitter_login.dart';

GoogleSignIn _googleSignIn = GoogleSignIn(
  scopes: <String>[
    'email',
    'https://www.googleapis.com/auth/contacts.readonly',
  ],
);
var twitterLogin = new TwitterLogin(
  consumerKey: 'lrZ2f3tV6UR8Skwchzc1d3w8u',
  consumerSecret: '69bA8t72P3RA5aXsx9RAjdDlkVbDpRETvArL8Tb3Q8WCQaBUV4',
);

class SignUp extends StatefulWidget {
  @override
  _SignUpState createState() => _SignUpState();
}

class _SignUpState extends State<SignUp> {
  String username = "", email = "", password = "";

  String passwordMessage = 'Please Enter Password';
  String usernameMessage = 'Please Enter Username';
  String emailMessage = 'Please Enter Email Id';

  bool keepMeSigned = false,
      usernameError = false,
      emailError = false,
      passwordError = false,
      loading = false,
      signupError = false;

  bool validateEmail(String value) {
    Pattern pattern =
        r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$';
    RegExp regex = new RegExp(pattern);
    if (!regex.hasMatch(value))
      return true;
    else
      return false;
  }

  bool validatePassword(String value) {
    Pattern pattern =
        r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$';
    RegExp regex = new RegExp(pattern);
    if (!regex.hasMatch(value))
      return true;
    else
      return false;
  }

  @override
  Widget build(BuildContext context) {
    void _showDailog() {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text(email),
            actions: <Widget>[
              FlatButton(
                  child: Text("close"),
                  onPressed: () {
                    Navigator.of(context).pop();
                  })
            ],
          );
        },
      );
    }

    _loginApi(reqBody) async {
      HttpClient client = new HttpClient();
      // client.badCertificateCallback = ((X509Certificate cert, String host, int port) => true);
      String url = 'https://api.stockzed.com/api/user/login';
      HttpClientRequest request = await client.postUrl(Uri.parse(url));
      request.headers.set('content-type', 'application/json');

      request.add(utf8.encode(json.encode(reqBody)));
      HttpClientResponse response = await request.close();
      if (response.statusCode == 200) {
        String reply = await response.transform(utf8.decoder).join();
        Map data = json.decode(reply);
        print(data);
        setState(() {
          loading = false;
        });
        if (data["message"] == "Success") {
          SharedPreferences storage = await SharedPreferences.getInstance();
          storage.setString('userData', reply);
          Navigator.pushReplacementNamed(context, Home.routeName,
              arguments: UserData(data["username"]));
        }
      } else {
        String reply = await response.transform(utf8.decoder).join();
        Map data = json.decode(reply);
        print(data["message"]);
        setState(() {
          loading = false;
        });
      }
    }

    _register() async {
      if (username == null || username.isEmpty) {
        setState(() {
          usernameError = true;
          passwordError = false;
        });
      } else if (username.length < 5) {
        setState(() {
          usernameError = true;
          usernameMessage = "Username must be Greater than 5 characters";
        });
      } else
        setState(() {
          usernameError = false;
        });

      if (email == null || email.isEmpty || validateEmail(email)) {
        setState(() {
          emailError = true;
        });
      } else
        setState(() {
          emailError = false;
        });

      if (password == null || password.isEmpty) {
        setState(() {
          passwordError = true;
        });
      } else if (validatePassword(password)) {
        setState(() {
          passwordError = true;
          passwordMessage =
              "Password Must of 8 characters And Should Contain UpperCase, LowerCase Latters, Numeric And Special Character";
        });
      } else {
        setState(() {
          passwordError = false;
        });
      }

      if (usernameError == false &&
          emailError == false &&
          passwordError == false) {
        if (keepMeSigned) {
          setState(() {
            emailError = false;
            usernameError = false;
            passwordError = false;
            loading = true;
          });
          try {
            Codec<String, String> stringToBase64 = utf8.fuse(base64);
            String encodedPassword = stringToBase64.encode(password);
            var reqBody = {
              "apiType": "register",
              "email": email,
              "password": encodedPassword,
              "username": username
            };
            HttpClient client = new HttpClient();
            String url = 'https://api.stockzed.com/api/user/register';
            HttpClientRequest request = await client.postUrl(Uri.parse(url));
            request.headers.set('content-type', 'application/json');

            request.add(utf8.encode(json.encode(reqBody)));
            HttpClientResponse response = await request.close();
            if (response.statusCode == 200) {
              String reply = await response.transform(utf8.decoder).join();
              Map data = json.decode(reply);
              print(data);
              setState(() {
                loading = false;
              });
              if (data["message"] == "User Registered") {
                var reqBody = {
                  "apiType": "login",
                  "username": email,
                  "password": encodedPassword
                };
                setState(() {
                  loading = true;
                });
                _loginApi(reqBody);
              }
            } else {
              String reply = await response.transform(utf8.decoder).join();
              Map data = json.decode(reply);
              print(data);
              setState(() {
                loading = false;
                if (data["message"] == "Email Already Exists.") {
                  emailError = true;
                  emailMessage = data["message"];
                } else if (data["message"] == "Username Already Exists.") {
                  usernameError = true;
                  usernameMessage = data["message"];
                }
              });
            }
          } catch (error) {
            print(error);
          }
        } else {
          Fluttertoast.showToast(
              msg: "Please Accept Terms And Conditions",
              gravity: ToastGravity.TOP,
              toastLength: Toast.LENGTH_LONG);
        }
      }
    }

    _facebookLogin() async {
      final facebookLogin = new FacebookLogin();
      facebookLogin.logOut();
      final result = await facebookLogin.logInWithReadPermissions(['email']);
      switch (result.status) {
        case FacebookLoginStatus.loggedIn:
          final facebookResponse = await http.get(
              'https://graph.facebook.com/v2.12/me?fields=name,first_name,last_name,email,picture&access_token=${result.accessToken.token}');
          var userData = json.decode(facebookResponse.body);
          print(userData);
          var reqBody = {
            "apiType": "socialLogin",
            "providerData": {
              "email": userData['email'] ?? '',
              "firstName": userData['first_name'],
              "id": userData['id'],
              "lastName": userData['last_name'],
              "provider": "FACEBOOK",
              "username": userData['name'],
            }
          };
          _loginApi(reqBody);
          break;
        case FacebookLoginStatus.cancelledByUser:
          print('CANCELED BY USER');
          break;
        case FacebookLoginStatus.error:
          print(result.errorMessage);
          break;
      }
    }

    _googleLogin() async {
      _googleSignIn.signOut();
      try {
        var googleUser = await _googleSignIn.signIn();
        print("google signed in user: $googleUser");
        var reqBody = {
          "apiType": "socialLogin",
          "providerData": {
            "email": googleUser.email,
            "firstName": "",
            "id": googleUser.id,
            "lastName": "",
            "provider": "GOOGLE",
            "username": googleUser.displayName,
          }
        };
        _loginApi(reqBody);
      } catch (error) {
        print("google sign in error: $error"); // error is printed here
        return;
      }
    }

    _twitterLogin() async {
      twitterLogin.logOut();
      final TwitterLoginResult result = await twitterLogin.authorize();
      switch (result.status) {
        case TwitterLoginStatus.loggedIn:
          print('Logged in! username: ${result.session.username}');
          print(result.session);
          var reqBody = {
            "apiType": "socialLogin",
            "providerData": {
              "email": "",
              "firstName": "",
              "id": result.session.userId,
              "lastName": "",
              "provider": "TWITTER",
              "username": result.session.username,
            }
          };
          _loginApi(reqBody);
          break;
        case TwitterLoginStatus.cancelledByUser:
          print('Login cancelled by user.');
          break;
        case TwitterLoginStatus.error:
          print('Login error: ${result.errorMessage}');
          break;
      }
    }

    _linkedInLogin() {
      Navigator.pushReplacementNamed(context, '/linkedin');
    }

    _TermsAndCondition() {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          // return object of type Dialog
          return AlertDialog(
            title: new Text("Terms and Conditions"),
            content: new Text(
                "Help protect your website and its users with clear and fair website terms and conditions. These terms and conditions for a website set out key issues such as acceptable use, privacy, cookies, registration and passwords, intellectual property, links to other sites, termination and disclaimers of responsibility. Terms and conditions are used and necessary to protect a website owner from liability of a user relying on the information or the goods provided from the site then suffering a loss.\nMaking your own terms and conditions for your website is hard, not impossible, to do. It can take a few hours to few days for a person with no legal background to make. But worry no more; we are here to help you out.\nAll you need to do is fill up the blank spaces and then you will receive an email with your personalized terms and conditions."),
            actions: <Widget>[
              // usually buttons at the bottom of the dialog
              new FlatButton(
                child: new Text("Ok",
                    style: TextStyle(
                        color: Colors.black, fontWeight: FontWeight.w600)),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        },
      );
    }

    return Scaffold(
        body: Container(
      height: MediaQuery.of(context).size.height,
      width: MediaQuery.of(context).size.width,
      decoration: BoxDecoration(
          color: Color(0xff282828),
          image: DecorationImage(
              image: AssetImage("lib/assets/images/backgroundAistock.png"),
              fit: BoxFit.cover,
              alignment: Alignment.topCenter)),
      alignment: Alignment.bottomCenter,
      child: SingleChildScrollView(
        child: Column(
          children: <Widget>[
            Container(
              margin: EdgeInsets.only(top: 30),
              child: Image.asset(
                "lib/assets/images/logo.png",
                width: 150,
                height: 75,
              ),
            ),
            Container(
              child: Text(
                "Create Your Account",
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.w300),
              ),
            ),
            Container(
              padding: EdgeInsets.symmetric(vertical: 10),
              margin: EdgeInsets.only(top: 20),
              //height: MediaQuery.of(context).size.height/1.28 ,
              width: MediaQuery.of(context).size.width,
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(20),
                      topRight: Radius.circular(20))),
              child: Column(
                children: <Widget>[
                  Container(
                    child: Column(
                      children: <Widget>[
                        Container(
                          //width: 400,
                          margin: EdgeInsets.only(top: 10, left: 20, right: 20),
                          child: Text(
                            "Username*",
                            style: TextStyle(fontSize: 16),
                          ),
                          alignment: AlignmentDirectional.topStart,
                        ),
                        Container(
                          margin: EdgeInsets.only(top: 5, left: 20, right: 20),
                          child: TextFormField(
                            cursorColor: Color(0xff7b67f0),
                            decoration: InputDecoration(
                                contentPadding: EdgeInsets.symmetric(
                                    vertical: 10, horizontal: 10),
                                border: new OutlineInputBorder(
                                    borderSide:
                                        new BorderSide(color: Colors.red)),
                                focusedBorder: new OutlineInputBorder(
                                    borderSide: new BorderSide(
                                        color: Color(0xff7b67f0), width: 2)),
                                errorText: usernameError
                                    ? '${usernameMessage}'
                                    : null),
                            onChanged: (text) {
                              setState(() {
                                username = text;
                              });
                            },
                          ),
                        ),
                        Container(
                          //width: 400,
                          margin: EdgeInsets.only(top: 10, left: 20, right: 20),
                          child: Text(
                            "Email ID*",
                            style: TextStyle(fontSize: 16),
                          ),
                          alignment: AlignmentDirectional.topStart,
                        ),
                        Container(
                          margin: EdgeInsets.only(top: 5, left: 20, right: 20),
                          child: TextFormField(
                            cursorColor: Color(0xff7b67f0),
                            decoration: InputDecoration(
                                contentPadding: EdgeInsets.symmetric(
                                    vertical: 10, horizontal: 10),
                                border: new OutlineInputBorder(
                                    borderSide:
                                        new BorderSide(color: Colors.red)),
                                focusedBorder: new OutlineInputBorder(
                                    borderSide: new BorderSide(
                                        color: Color(0xff7b67f0), width: 2)),
                                errorText:
                                    emailError ? '${emailMessage}' : null),
                            onChanged: (text) {
                              setState(() {
                                email = text;
                              });
                            },
                          ),
                        )
                      ],
                    ),
                  ),
                  Container(
                    child: Column(
                      children: <Widget>[
                        Container(
                          //width: 400,
                          margin: EdgeInsets.only(top: 10, left: 20, right: 20),
                          child: Text(
                            "Password*",
                            style: TextStyle(fontSize: 16),
                          ),
                          alignment: AlignmentDirectional.topStart,
                        ),
                        Container(
                          margin: EdgeInsets.only(top: 5, left: 20, right: 20),
                          child: TextField(
                            obscureText: true,
                            cursorColor: Color(0xff7b67f0),
                            decoration: InputDecoration(
                                contentPadding: EdgeInsets.symmetric(
                                    vertical: 10, horizontal: 10),
                                border: new OutlineInputBorder(
                                    borderSide:
                                        new BorderSide(color: Colors.teal)),
                                focusedBorder: new OutlineInputBorder(
                                    borderSide: new BorderSide(
                                        color: Color(0xff7b67f0), width: 2)),
                                errorMaxLines: 2,
                                errorText: passwordError
                                    ? '${passwordMessage}'
                                    : null),
                            onChanged: (text) {
                              setState(() {
                                password = text;
                              });
                            },
                          ),
                        )
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.symmetric(horizontal: 20, vertical: 5),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                        Container(
                          child: Row(
                            children: <Widget>[
                              Checkbox(
                                value: keepMeSigned,
                                onChanged: (bool value) {
                                  setState(() {
                                    keepMeSigned = value;
                                  });
                                },
                                activeColor: Color(0xff7b67f0),
                              ),
                              Text(
                                "By signing up I agree with ",
                                style: TextStyle(fontSize: 12),
                              ),
                              GestureDetector(
                                onTap: () {
                                  _TermsAndCondition();
                                },
                                child: Text(
                                  "Terms and Conditions",
                                  style: TextStyle(color: Color(0xff7b67f0)),
                                ),
                              )
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.symmetric(horizontal: 20),
                    height: 40,
                    width: MediaQuery.of(context).size.width,
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.all(Radius.circular(50)),
                        color: Color(0xff7b67f0)),
                    child: MaterialButton(
                      onPressed: () {
                        _register();
                      },
                      child: loading
                          ? SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                backgroundColor: Colors.white,
                                strokeWidth: 2,
                              ),
                            )
                          : Text(
                              "REGISTER NOW",
                              style:
                                  TextStyle(color: Colors.white, fontSize: 16),
                            ),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.symmetric(vertical: 15),
                    child: Text(
                      "Register by using a social network",
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.w400),
                    ),
                  ),
                  Container(
                    // margin: EdgeInsets.symmetric(vertical: 5),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Container(
                          margin: EdgeInsets.symmetric(horizontal: 5),
                          child: MaterialButton(
                              height: 55,
                              minWidth: 50,
                              color: Color(0xff5648a5),
                              onPressed: () {
                                _facebookLogin();
                              },
                              child:
                                  Icon(MdiIcons.facebook, color: Colors.white),
                              shape: (RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(50)))),
                        ),
                        Container(
                          margin: EdgeInsets.symmetric(horizontal: 5),
                          child: MaterialButton(
                              height: 55,
                              minWidth: 50,
                              color: Color(0xff5648a5),
                              onPressed: () {
                                _twitterLogin();
                              },
                              child:
                                  Icon(MdiIcons.twitter, color: Colors.white),
                              shape: (RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(50)))),
                        ),
                        Container(
                          margin: EdgeInsets.symmetric(horizontal: 5),
                          child: MaterialButton(
                              height: 55,
                              minWidth: 50,
                              color: Color(0xff5648a5),
                              onPressed: () {
                                _googleLogin();
                              },
                              child:
                                  Icon(MdiIcons.youtube, color: Colors.white),
                              shape: (RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(50)))),
                        ),
                        Container(
                          margin: EdgeInsets.symmetric(horizontal: 5),
                          child: MaterialButton(
                              height: 55,
                              minWidth: 50,
                              color: Color(0xff5648a5),
                              onPressed: () {
                                _linkedInLogin();
                              },
                              child:
                                  Icon(MdiIcons.linkedin, color: Colors.white),
                              shape: (RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(50)))),
                        )
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 15, bottom: 10),
                    child: Text(
                      "Already a member?",
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.w400),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.symmetric(horizontal: 20),
                    height: 40,
                    width: MediaQuery.of(context).size.width,
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.all(Radius.circular(50)),
                        color: Color(0xff7b67f0).withOpacity(0.5)),
                    child: MaterialButton(
                      onPressed: () {
                        Navigator.pushReplacementNamed(context, '/');
                      },
                      child: Text(
                        "LOGIN",
                        style: TextStyle(color: Colors.white, fontSize: 16),
                      ),
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    ));
  }
}
