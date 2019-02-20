const passport = require('passport');
const passportConf = require('../config/passport');

const passportSignIn = passport.authenticate('local', {
  session: false
});
const passportJWT = passport.authenticate('jwt', {
  session: false
});

// for ping testing
router.get('/ping', (req, res) => {
  res.status(200).send('pong!');
});


// login register API
router.route('/signup').post(UsersController.signUp);
router.route('/signin').post(passportSignIn, UsersController.signIn);


router
  .get('/customer', passportJWT, UsersController.customerLIST);

module.exports = router;