import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com', 
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD 
  },
  tls: {
    rejectUnauthorized: true
  }
});

const verifyTransporter = () => {
  return new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error('Transporter verification failed:', error);
        reject(error);
      } else {
        console.log('Transporter is ready to send emails');
        resolve(success);
      }
    });
  });
};

export const sendVerificationEmail = async (email, token) => {
  try {
    if (!process.env.BASE_URL || !process.env.EMAIL_FROM) {
      throw new Error('Required environment variables are missing');
    }
    
    const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: `"Notes App" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Verify Your Email',
      html: `
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `
    };
    
    await verifyTransporter(); 
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};