const cheerio = require("cheerio");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken")
const Scholarshipcard = require("../models/Scholarshipcard/Scholarshipcard.js");
const dotenv = require("dotenv");
dotenv.config();

router.get("/addscholarship",async (req,res)=>{
    
    const result = await axios.get("https://www.computersciencedegreehub.com/internships-fortune-500-companies/");
       
        // console.log(result)
        // const $ = cheerio.load(result.data);
        // const res = $('.jobs-search_results-list')
        // console.log(res)
    
    // console.log("here")
    const scholarships = [];
    const $ = cheerio.load(result.data);
    var temp = [];
    var i = 0;
    // console.log($(".jobs-search__results-list"))

    $(".entry-content h3").each((idx,ref)=>{
        var t = $(ref).text()
        scholarships.push({name:t, eligibility: "", details:"" })
        // const t = $(ref).text();
        // console.log(t)
        
        // i++;
        // if(i == 3 || i == 2){
        //     $("table tr ").each((idx,ref)=>{
        //         temp.push($(ref).text());
        //         temp = (($(ref).text()).split("\n")).filter((item)=>{
        //             if(item!=' ' && item!='-' && item!='–'  &&  item!='  '){
        //                 return item;
        //             }
        //         });
                
        //         if(temp[0]!='Name Of Article' && temp[1]!= 'Click Here' && temp[0]!='Category' && temp[0]!='Official Website' && temp[0]!='Scholarship Name' && temp[0]!="Exam Name"){
        //             scholarships.push({name:temp[0],eligibility:temp[1],details:temp[2]+"|"+temp[3]+((temp[4]==undefined || temp[4]==null)?"":"|"+temp[4])+((temp[5]==undefined || temp[5]==null)?"":"|"+temp[5])})
        //         }
                
        //     })
        // }
        
    })
    var i = 0;
    $(".entry-content h3 a").each((idx, ref)=>{
        var t = $(ref).text()
        var u = $(ref).attr("href")
        scholarships[i].eligibility = t;
        scholarships[i].details = u;
        i++; 
    })

    console.log(scholarships)
    Scholarshipcard.insertMany(scholarships).then(()=>{
        res.status(200).send({message:"done"})
    }).catch((err)=>{
        res.status(400).send({error:err})
    })
})

router.get("/scholarshiplist",async (req,res)=>{
    const scholarshiplist = await Scholarshipcard.find();
    const result = [];
    var temp = [];
    var header = req.headers;
    try{
    const ver = jwt.verify(((header.token).split(" "))[1],process.env.JWT_SECRET)
        if(ver){
            console.log("success")
        }
    }
    catch(err){
        return res.status(403).json({error:"Invalid token or token not found"});
    }
    for(let i = 0; i<scholarshiplist.length; i++){
        temp = scholarshiplist[i].details.split("|");
        result.push({name:scholarshiplist[i].name, eligibility: scholarshiplist[i].eligibility, details: temp});
    }
    return res.status(200).json({message:result});
})

module.exports = router;