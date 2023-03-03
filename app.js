const express = require('express');
const mongoose = require('mongoose');
const BP = require('body-parser');
const MO = require('method-override');
const ES = require('express-sanitizer')



const app = express();



mongoose.connect('mongodb://127.0.0.1:27017/myBlog-DB', {


    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: false


  });


app.use(BP.urlencoded({extended:true}));
app.use(ES());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(MO('_method'))


let vlocks = mongoose.Schema({
    title: String,
    image: {

        type: String,
        default: 'imagePlaceholder.jpg' 
        
    },
    body: String,
    created: {

        type: Date,
        default: Date.now

    }
});



let Blog = mongoose.model('Blog', vlocks)



app.get('/', (req, res) => {

    res.redirect('/blogs')

})





app.get('/blogs', (req, res) => {

    Blog.find({}, (error, blogs) => {
      if(error){
          console.log(error);
      }
      
      else{
        res.render('index', {blogs: blogs})
      }

    })
    
})




app.get('/blogs/new', (req, res) => {
  
  res.render('new')

})




app.post('/blogs', (req, res) => {
    
    Blog.create(req.body.blog, (error, newBlog) => {
      if(error){
          res.render('new')
      }
      
      else{
          res.redirect('/blogs')
      }
    })
   
})

app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (error, foundBlog) => {
      if(error){
        res.redirect('/blogs')
      }
      
      else{
        res.render('show', {blog:foundBlog})
      }
    })
});



app.get('/blogs/:id/edit', (req, res) => {

  Blog.findById(req.params.id, (error, foundBlog)=>{
    if(error){
      res.redirect('/blogs')
    }

    else{
      res.render('edit', {blog:foundBlog})
    }

  })

});




app.put('/blogs/:id', (req, res) => {
  
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (error, updatedBlog)=> {
    if(error){
      res.redirect('/blogs')
    }

    else{
      res.redirect('/blogs/' + req.params.id)
    }

  })

});




app.delete('/blogs/:id', (req, res) =>{

  Blog.findByIdAndRemove(req.params.id, (error)=> {

    if(error){
      res.redirect('/blogs')
    }

    else{
      res.redirect('/blogs')
    }

  })

});




app.listen(3500, (req, res) => {

  console.log("SERVER is Running Successfully on Port 3500");

});