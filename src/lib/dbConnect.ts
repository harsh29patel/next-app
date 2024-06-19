import mongoose from "mongoose";


type ConnectionObject = {    //you can skip this it is for typeScript  it is because when database connection is done than what data type you det
    isConnected?:number
}

const connection: ConnectionObject={}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){         // to check if db is already connected or nots
        console.log("Already connected to database");
        return
    }
    try {
        const db =   await mongoose.connect(process.env.MONGO_URI || "",{})
        console.log(db);
        
     connection.isConnected = db.connections[0].readyState   // optionals 
     console.log("MONGO DB Connected");
     console.log(db.connections);
     
     
 
    } catch (error) {

        console.log("Database connection failed");
        
        process.exit()

    }
}

export default dbConnect;