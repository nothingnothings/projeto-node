exports.error404 = (req, res, next) => { 
 


  // const isLoggedIn = req.get('Cookie').trim().split('=')[1];



    res.status(404).render('404', {pageTitle: 'Page not Found', path: '', 
    
    // isLoggedIn: isLoggedIn
    isLoggedIn: req.session.isLoggedIn
  
  
  });

  } 