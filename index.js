const express = require('express')
const app = express();
const path = require('path')
const fs =require('fs')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs') // Helps to render ejs pages on browser
app.use(express.static(path.join(__dirname,'public'))) // gives excess to public folder with authentication

app.get('/',(req,res)=>{
    fs.readdir('./files',(err,files)=>{
        res.render("index",{files:files})
    })
})

app.get('/files/:Filename',function(req,res){
    fs.readFile(`files/${req.params.Filename}`,"utf-8",function(err,data){
        res.render("show",{data:data,filename:req.params.Filename})
    })
})

app.post('/create',function(req,res)
{
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err){
        res.redirect('/')
    })
    console.log(req.body)
})

app.get('/delete/:Filename',function(req,res){
    fs.unlink(`./files/${req.params.Filename}`,function(err){
        if(err) throw err
        res.send('File deleted <a href="/" class="text-blue-500 inline-block mb-10">go back</a>')
    })
})

app.get('/edit/:Filename',(req,res)=>{
    fs.readFile(`files/${req.params.Filename}`,"utf-8",function(err,data){
        res.render("edit",{data:data,filename:req.params.Filename})
    })

})

app.post('/edit',async(req,res)=>{
    await fs.writeFile(`./files/${req.body.previous}`,req.body.details,(err)=>{
        if(err) throw new Error("faild to edit data")
        console.log('file updated')
    })
    await fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`,()=>{
        console.log('file renamed')
        res.redirect('/')
    })
})

app.listen(3000,()=>{
    console.log('Running --- ')
})