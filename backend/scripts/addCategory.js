const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const Category = require('../models/category');

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node addCategory.js <name> <description> [mongodb_uri]');
    process.exit(1);
}

const [name, description, dbUrlArg] = args;
const dbUrl = dbUrlArg || process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('No MongoDB connection string provided. Set DATABASE_URL or pass it as third arg.');
    process.exit(1);
}

async function main() {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const existing = await Category.findOne({ name });
        if (existing) {
            console.log('Category with this name already exists:', existing._id);
            await mongoose.disconnect();
            process.exit(0);
        }

        const cat = await Category.create({ name, description });
        console.log('Category created successfully with id:', cat._id);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error creating category:', err.message || err);
        try { await mongoose.disconnect(); } catch (e) {}
        process.exit(1);
    }
}

main();
