import Joi from "joi";
import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import path from 'path'
import dotenv from "dotenv";
import crypto from 'crypto'
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import hbs from "nodemailer-express-handlebars";


dotenv.config();
const prisma = new PrismaClient();
const baseurl = process.env.BASE_URL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var transporter = nodemailer.createTransport({
  // service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  // secure: true,
  auth: {
    user: "pratik.technorizen@gmail.com",
    pass: "utfnyzcywqxarzkf",
  },
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve(__dirname, "../view/"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "../view/"),
};

transporter.use("compile", hbs(handlebarOptions));
export async function signup(req, res) {
  try {
    console.log("here");

    const { email, password, full_name } = req.body;
    console.log(req.body);
    console.log("after")
    const schema = Joi.alternatives(Joi.object({
      email: Joi.string().min(5).max(255).email({ tlds: { allow: false } }).lowercase().required(),
      password: Joi.string().min(8).max(15).required(),
      full_name: Joi.string().max(255).required()

    }))
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (user) {
      return res.json({
        success: false,
        message: "Already have account, Please Login",
        status: 400,
      });
    }
    const act_token = crypto.randomBytes(16).toString('hex');
    let mailOptions = {
      from: 'stuffyclub1@gmail.com',
      to: email,
      subject: 'Activate Account',
      template: 'signupemail',
      context: {
        // href_url: `http://192.168.1.35:3000verifyUser/` + `${act_token}`,
        href_url: `${baseurl}/user/verifyUser/${act_token}`,
        image_logo: `${baseurl}/image/logo.png`,
        msg: `Please click below link to activate your account.`

      }
    };
    transporter.sendMail(mailOptions, async function (error, info) {
      console.log()
      if (error) {
        return res.json({
          success: false,
          status: 400,
          message: 'Mail Not delivered'
        });
      }
      else {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        // Save the user with the hashed password using Prisma
        await prisma.user.create({
          data: {
            email: email,
            password: hashedPassword,
            full_name: full_name,
            act_token: act_token,
          }
        })
        console.log('account created')

        return res.status(200).json({
          success: true,
          message: "Email verification required. Check your inbox for a confirmation link",
          status: 200,
        });
      }
    });

  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }

}
export async function verifyUserEmail(req, res) {
  try {
    const act_token = req.params.id;
    // const token = generateToken();
    if (!act_token) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    }
    else {
      console.log("act_token", act_token);
      const user = await prisma.user.findFirst({
        where: {
          act_token: act_token
        }
      })
      if (user) {
        const updateUser = await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            isVerified: true
          }
        })
        if (updateUser) {
          res.sendFile(path.join(__dirname, '../view/verify.html'));
        }
        else {
          res.sendFile(path.join(__dirname, '../view/notverify.html'));
        }
      }
      else {
        res.sendFile(__dirname + '/view/notverify.html');
      }
    }
  }
  catch (error) {
    console.log(error);
    res.send(`<div class="container">
      <p>404 Error, Page Not Found</p>
      </div> `);
  }
};
export async function login(req, res) {
  try {
    const secretKey = process.env.SECRET_KEY;
    const { email, password } = req.body;
    // const token = generateToken();
    const schema = Joi.alternatives(
      Joi.object({
        //email: Joi.string().min(5).max(255).email({ tlds: { allow: false } }).lowercase().required(),
        email: Joi.string().min(5).max(255).email({ tlds: { allow: false } }).lowercase().required(),
        password: Joi.string().min(8).max(15).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 8 value required",
          "string.max": "maximum 15 values allowed",
        }),

      })
    );
    const result = schema.validate({ email, password });

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email: email
        }
      })
      if (!user || !(await bcrypt.compare(password, user.password))) {

        return res.status(400).json({
          success: false,
          message: "Invalid login credentials",
          status: 400,
        });
      }
      if (user.isVerified === false) {
        return res.status(400).json({
          message: "Please verify your account",
          status: 400,
          success: false
        })
      }
   


      const userData = await prisma.user.findUnique({
        where: {
          email: email
        }
      });
 
  
      const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '3d' });
      return res.json({
        status: 200,
        success: true,
        message: "Login successful!",
        token: token,
        user: userData,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
}
