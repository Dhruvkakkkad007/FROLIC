require('dotenv').config();
const mongoose = require('mongoose');

async function checkDB() {
    try {
        console.log("Connecting to:", process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected!");
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections in DB:", collections.map(c => c.name));
        
        for (let coll of collections) {
            const count = await mongoose.connection.db.collection(coll.name).countDocuments();
            console.log(`- ${coll.name}: ${count} documents`);
            if (count > 0) {
                const sample = await mongoose.connection.db.collection(coll.name).findOne();
                console.log(`  Sample keys:`, Object.keys(sample));
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkDB();
