const express = require('express');





const authController = require('../controllers/auth');



const router = express.Router();




router.get('/login',  


            authController.getLoginPage

)





router.post('/login', 



authController.postLogin

)





router.post('/logout', 



authController.postLogout
)










router.get(
    '/signup', 

    authController.getSignupPage
)




router.post(
    '/signup',
    authController.postSignup
)




router.get(
    '/reset-password',
    authController.getResetPassword
)




router.post(
    '/reset-password',
    authController.postResetPassword
)


router.get(
    '/reset-password/:token',
    authController.getNewPasswordPage
)


router.post(
    '/new-password',
    authController.postNewPassword
)





module.exports = router;