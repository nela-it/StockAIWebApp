import 'package:flutter/material.dart';
import './screens/login.dart';
import './screens/signup.dart';
import './screens/home.dart';
import './screens/forgotPassword.dart';
import './screens/linkedIn.dart';

void main() => runApp(
  MaterialApp(
    initialRoute: '/',
    debugShowCheckedModeBanner: false,
    routes: {
      '/': (context) => Login(),
      '/linkedin' : (context) => LinkedinLogin(),
      '/forgotPassword': (context) => ForgotPassword(),
      '/signup': (context) => SignUp(),
      //'/home':(context) => Home(),
      Home.routeName : (context) => Home()
    },
    theme: ThemeData(
      fontFamily: 'Montserrat',
      accentColor: Colors.white,
      buttonColor: Color(0xff5946a8),
    ),
  )
);

