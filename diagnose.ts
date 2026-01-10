
const { PrismaClient } = require('./generated/client/client');
const fs = require('fs');
const path = require('path');

try {
    const envPath = path.resolve(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8');
        envFile.split(/\r?\n/).forEach(line => {
            if (!line || line.startsWith('#')) return;
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts.shift().trim();
                const value = parts.join('=').trim().replace(/^["']|["']$/g, '');
                process.env[key] = value;
            }
        });
        console.log("Loaded .env file");
    }
} catch (e) { console.error("Error loading .env", e); }

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Testing Employees Query...");
        const employees = await prisma.empleados.findMany({
            take: 1
        });
        console.log("Success! Found " + employees.length + " employees.");
    } catch (e) {
        console.error("Error querying employees:");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
