import 'dart:convert';
import 'dart:convert' as prefix0;
import 'dart:io';
import './home.dart';
import 'package:flutter/material.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
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

class Login extends StatefulWidget {
  @override
  _LoginState createState() => _LoginState();
}

class UserData {
  final String name;

  UserData(this.name);
}

class _LoginState extends State<Login> {
  initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _getLoginUser());
    //_facebookLogin();
    //_googleLogin();
  }

  String email = "", password = "";
  String emailErrorMessage = 'Please Enter Email';
  String passwordErrorMessage = 'Please Enter Password';
  String encodedPassword = "";

  bool keepMeSigned = false,
      emailError = false,
      passwordError = false,
      loginError = false,
      loading = false,
      appLoading = true;

  _getLoginUser() async {
    SharedPreferences storage = await SharedPreferences.getInstance();
    var data = storage.getString('userData');
    // print(userData);
    if (data != null) {
      var userData = jsonDecode(data);
      setState(() {
        appLoading = false;
      });
      Navigator.pushReplacementNamed(context, Home.routeName,
          arguments: UserData(userData["username"]));
    } else {
      print('no existing user');
      setState(() {
        appLoading = false;
      });
    }
  }

  _loginApi(reqBody) async {
    HttpClient client = new HttpClient();
    // client.badCertificateCallback = ((X509Certificate cert, String host, int port) => true);
    String url = 'https://stockzai.com/api/user/login';
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
        storage.setString('password', encodedPassword);
        storage.setString('email', email);
        print("email: $email" + "  and encoded password:" + encodedPassword);
        Navigator.pushReplacementNamed(context, Home.routeName,
            arguments: UserData(data["username"]));
      }
    } else {
      String reply = await response.transform(utf8.decoder).join();
      Map data = json.decode(reply);
      print(data["message"]);
      setState(() {
        loading = false;
        if (data["message"].toString().trim().toLowerCase() ==
            "email not found") {
          emailError = true;
          emailErrorMessage = data["message"];
        } else if (data["message"].toString().trim().toLowerCase() ==
            "entered password is wrong") {
          passwordError = true;
          passwordErrorMessage = data["message"];
        }
      });
    }
  }

  _login() async {
    if (email.isEmpty && password.isEmpty) {
      setState(() {
        emailError = true;
        passwordError = true;
      });
    } else if (email == null ||
        password == null ||
        email.isEmpty ||
        password.isEmpty) {
      setState(() {
        if (email == null || email.isEmpty) {
          emailError = true;
          passwordError = false;
        } else {
          emailError = false;
          passwordError = true;
        }
      });
    } else {
      setState(() {
        emailError = false;
        passwordError = false;
        loading = true;
      });
      try {
        Codec<String, String> stringToBase64 = utf8.fuse(base64);
        setState(() {
          encodedPassword = stringToBase64.encode(password);
        });
        print(encodedPassword);
        var reqBody = {
          "apiType": "login",
          "username": email,
          "password": encodedPassword
        };
        _loginApi(reqBody);
      } catch (error) {
        print(error);
      }
    }
  }

  _forgotPassword() {
    Navigator.pushNamed(context, '/forgotPassword');
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
    //twitterLogin.logOut();
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

  _showDailog(status) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('email'),
          actions: <Widget>[
            FlatButton(
                child: Text(status.toString()),
                onPressed: () {
                  Navigator.of(context).pop();
                })
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.

    return Scaffold(
        body: appLoading
            ? Center(
                child: CircularProgressIndicator(
                  backgroundColor: Colors.white,
                  strokeWidth: 3,
                  valueColor: new AlwaysStoppedAnimation(Color(0xff7b67f0)),
                ),
              )
            : Container(
                height: MediaQuery.of(context).size.height,
                width: MediaQuery.of(context).size.width,
                decoration: BoxDecoration(
                    color: Color(0xff282828),
                    image: DecorationImage(
                        image: AssetImage(
                            "lib/assets/images/backgroundAistock.png"),
                        fit: BoxFit.cover,
                        alignment: Alignment.topCenter)),
                alignment: Alignment.bottomCenter,
                child: SingleChildScrollView(
                  child: Column(
                    children: <Widget>[
                      Container(
                        margin: EdgeInsets.only(top: 40),
                        child: Image.asset(
                          "lib/assets/images/logo.png",
                          width: 150,
                          height: 75,
                        ),
                      ),
                      Container(
                        child: Text(
                          "Login into Your Account",
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.w300),
                        ),
                      ),
                      Container(
                        padding: EdgeInsets.symmetric(vertical: 10),
                        margin: EdgeInsets.only(top: 45),
                        //height: MediaQuery.of(context).size.height/1.38 ,
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
                                    margin: EdgeInsets.only(
                                        top: 20, left: 20, right: 20),
                                    child: Text(
                                      "Email ID*",
                                      style: TextStyle(fontSize: 16),
                                    ),
                                    alignment: AlignmentDirectional.topStart,
                                  ),
                                  Container(
                                    margin: EdgeInsets.only(
                                        top: 10, left: 20, right: 20),
                                    child: TextField(
                                      cursorColor: Color(0xff7b67f0),
                                      decoration: InputDecoration(
                                          contentPadding: EdgeInsets.symmetric(
                                              vertical: 10, horizontal: 10),
                                          border: new OutlineInputBorder(
                                              borderSide: new BorderSide(
                                                  color: Colors.red)),
                                          focusedBorder: new OutlineInputBorder(
                                              borderSide: new BorderSide(
                                                  color: Color(0xff7b67f0),
                                                  width: 2)),
                                          errorText: emailError
                                              ? '${emailErrorMessage}'
                                              : null),
                                      onChanged: (text) {
                                        setState(() {
                                          email = text;
                                        });
                                      },
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              child: Column(
                                children: <Widget>[
                                  Container(
                                    //width: 400,
                                    margin: EdgeInsets.only(
                                        top: 20, left: 20, right: 20),
                                    child: Text(
                                      "Password*",
                                      style: TextStyle(fontSize: 16),
                                    ),
                                    alignment: AlignmentDirectional.topStart,
                                  ),
                                  Container(
                                    margin: EdgeInsets.only(
                                        top: 10, left: 20, right: 20),
                                    child: TextField(
                                      obscureText: true,
                                      cursorColor: Color(0xff7b67f0),
                                      decoration: InputDecoration(
                                          contentPadding: EdgeInsets.symmetric(
                                              vertical: 10, horizontal: 10),
                                          border: new OutlineInputBorder(
                                              borderSide: new BorderSide(
                                                  color: Colors.teal)),
                                          focusedBorder: new OutlineInputBorder(
                                              borderSide: new BorderSide(
                                                  color: Color(0xff7b67f0),
                                                  width: 2)),
                                          errorText: passwordError
                                              ? '${passwordErrorMessage}'
                                              : null),
                                      onChanged: (text) {
                                        setState(() {
                                          password = text;
                                        });
                                      },
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              margin: EdgeInsets.symmetric(
                                  horizontal: 20, vertical: 5),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
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
                                          "Keep me signed in",
                                          style: TextStyle(fontSize: 12),
                                        )
                                      ],
                                    ),
                                  ),
                                  Container(
                                      child: GestureDetector(
                                    onTap: () {
                                      _forgotPassword();
                                    },
                                    child: Text(
                                      "Forgot Password ?",
                                      style: TextStyle(fontSize: 12),
                                    ),
                                  ))
                                ],
                              ),
                            ),
                            Container(
                              margin: EdgeInsets.symmetric(horizontal: 20),
                              height: 40,
                              width: MediaQuery.of(context).size.width,
                              decoration: BoxDecoration(
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(50)),
                                  color: Color(0xff7b67f0)),
                              child: MaterialButton(
                                onPressed: () {
                                  _login();
                                },
                                child: loading
                                    ? SizedBox(
                                        height: 20,
                                        width: 20,
                                        child: CircularProgressIndicator(
                                          backgroundColor: Colors.transparent,
                                          strokeWidth: 2,
                                          valueColor:
                                              new AlwaysStoppedAnimation(
                                                  Colors.white),
                                        ),
                                      )
                                    : Text(
                                        "LOGIN",
                                        style: TextStyle(
                                            color: Colors.white, fontSize: 16),
                                      ),
                              ),
                            ),
                            Container(
                              margin: EdgeInsets.symmetric(vertical: 15),
                              child: Text(
                                "Or login with",
                                style: TextStyle(
                                    fontSize: 16, fontWeight: FontWeight.w400),
                              ),
                            ),
                            Container(
                              margin: EdgeInsets.symmetric(vertical: 5),
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
                                        child: Icon(MdiIcons.facebook,
                                            color: Colors.white),
                                        shape: (RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(50)))),
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
                                        child: Icon(MdiIcons.twitter,
                                            color: Colors.white),
                                        shape: (RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(50)))),
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
                                        child: Icon(MdiIcons.youtube,
                                            color: Colors.white),
                                        shape: (RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(50)))),
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
                                        child: Icon(MdiIcons.linkedin,
                                            color: Colors.white),
                                        shape: (RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(50)))),
                                  )
                                ],
                              ),
                            ),
                            Container(
                              margin: EdgeInsets.only(top: 15, bottom: 10),
                              child: Text(
                                "Don't have an account?",
                                style: TextStyle(
                                    fontSize: 16, fontWeight: FontWeight.w400),
                              ),
                            ),
                            Container(
                              margin: EdgeInsets.symmetric(horizontal: 20),
                              height: 40,
                              width: MediaQuery.of(context).size.width,
                              decoration: BoxDecoration(
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(50)),
                                  color: Color(0xff7b67f0).withOpacity(0.5)),
                              child: MaterialButton(
                                onPressed: () {
                                  Navigator.pushReplacementNamed(
                                      context, '/signup');
                                },
                                child: Text(
                                  "REGISTER NOW",
                                  style: TextStyle(
                                      color: Colors.white, fontSize: 16),
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
