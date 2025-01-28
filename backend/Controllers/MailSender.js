const express = require('express')
const nodemailer = require('nodemailer')

const MailSender = (req,res) => {
    const Transporter = nodemailer.createTransport({
        service :'gmail',
        auth :{
            user : "yaswanthsairaghuram@gmail.com",
            pass : "nwda gjjr pvln ulrx"
        }
    })
    const MailOptions = {
        from : "yaswanthsairaghuram@gmail.com",
        to:req.body.email,
        subject:"Checking Nodemailer",
        text : "It is Working!"
    }

    Transporter.sendMail(MailOptions,(err,info) => {
        if (err)
        {
            return res.status(500).json(err)
        }
        return res.status(200).json('Mail Sent Successfully')
    })
}

exports.MailSender = MailSender;
