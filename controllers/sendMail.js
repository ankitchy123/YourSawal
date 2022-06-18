const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

// To send mail using nodemailer
const {
    GGL_CLIENT_ID,
    GGL_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
} = process.env

const oauth2Client = new OAuth2(
    GGL_CLIENT_ID,
    GGL_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
)

// Send Mail
const sendEmail = (to, url, txt1, txt2) => {
    oauth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken()

    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: GGL_CLIENT_ID,
            clientSecret: GGL_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken
        }
    })
    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: txt2,
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Your Sawaal.</h2>
            <p>${txt1}</p>
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt2}</a>
            </div>`
    }

    smtpTransport.sendMail(mailOptions, (err, data) => {
        if (err) {
            return err;
        }
        return data
    })
}

module.exports = sendEmail