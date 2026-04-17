require('dotenv').config({ path: '.env' });

async function checkModels() {
    const key = process.env.GOOGLE_API_KEY;
    if (!key) {
        console.error("NO API KEY IN .ENV");
        return;
    }
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await res.json();
    if (data.models) {
        console.log("AVAILABLE MODELS:");
        data.models.forEach(m => console.log(m.name));
    } else {
        console.log("ERROR OR UNEXPECTED DATA:", data);
    }
}
checkModels();
