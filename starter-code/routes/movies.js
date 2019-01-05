const express = require('express');
const router  = express.Router();
const Movie = require('../models/movie.js');
const Celebrity = require('../models/celebrity.js');



router.get('/movies', (req, res, next) => {
  Movie.find()
    .then(movies => {
      res.render("movies", { movies });
    })
    .catch(error => {
      console.log(error)
    })
  });


  router.get('/movies/new', (req, res, next) => {
    res.render("movies/new");
});

router.post('/movies/new', (req, res, next) => {
  const { title, genre, plot } = req.body;
  const newMov = new Movie({title, genre, plot})
  newMov.save()
  .then(movie => {
    res.redirect('/movies');
  })
  .catch((error) => {
    console.log(error);
  })
});


  router.get('/movies/:id', (req, res, next) => {
    let movieId = req.params.id;
    Movie.findOne({'_id': movieId}).populate('celebrities')
      .then(movie => {
        res.render("movies/show", { movie });
      })
      .catch(error => {
        console.log(error)
      })
    });


    router.post('/movies/:id/delete', (req, res, next) => {
      let movId = req.params.id;
      Movie.findByIdAndRemove(movId)
      .then(movie => {
        res.redirect('/movies');
      })
      .catch((error) => {
        console.log(error);
      })
    });

    router.get('/movies/edit/:id', (req, res, next) => {
      let movId = req.params.id;
  Movie.findOne({'_id': movId})
        .then(movie => {
          res.render("movies/edit", { movie });
        })
        .catch(error => {
          console.log(error)
        })
      });
      
      router.post('/movies/edit/:id', (req, res, next) => {
        const { title, genre, plot } = req.body;
        Movie.update({_id: req.params.id}, { $set: {title, genre, plot}}, {new:true})
        .then(movie => {
          res.redirect('/movies/'+req.params.id);
        })
        .catch((error) => {
          console.log(error);
        })
      });

      router.get('/movies/addcelebrity/:id', (req, res, next) => {
        let movId = req.params.id;
    Movie.findOne({'_id': movId})
          .then(movie => {
            res.render("movies/addcelebrity", { movie });
          })
          .catch(error => {
            console.log(error)
          })
        });
        
        router.post('/movies/addcelebrity/:id', (req, res, next) => {
          const { name, occupation, catchPhrase } = req.body;
          const newCeleb = new Celebrity({name, occupation, catchPhrase})          
          newCeleb.save(function (err, celeb) {
            if (err) return handleError(err);
            Movie.update({_id: req.params.id}, { $push: {celebrities: celeb._id}}).then(()=>{
              res.redirect('/movies/'+req.params.id);  
            })
            });
          });
    
  

module.exports = router;