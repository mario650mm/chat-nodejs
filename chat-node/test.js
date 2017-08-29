app.get('/',function(req,res){
sess = req.session;
if(sess.email) {
    res.redirect('/admin');
}
else {
    res.render('index.html');
}
});


app.post('/login',function(req,res){
  sess = req.session;
  sess.email=req.body.email;
  res.end('done');
});

app.get('/admin',function(req,res){
  sess = req.session;
if(sess.email) {
res.write('<h1>Hello '+sess.email+'</h1>');
res.end('<a href="+">Logout</a>');
} else {
    res.write('<h1>Please login first.</h1>');
    res.end('<a href="+">Login</a>');
}
});

app.get('/logout',function(req,res){
req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/');
  }
});

});
app.listen(5000,function(){
console.log("App Started on PORT 5000");
});

