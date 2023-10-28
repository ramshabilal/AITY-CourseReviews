import mongoose from 'mongoose'

// Uncomment following line to debug value of database connectoin string
//console.log(process.env.DSN)
mongoose.connect(process.env.DSN)