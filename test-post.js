async function run() {
    const params = new URLSearchParams();
    params.append("nombre", "Test Desde Node");
    params.append("email", "test@node.com");
    params.append("telefono", "123456789");

    const url = "https://script.google.com/macros/s/AKfycbxgALKiut3q7LLDcv_vA2PWXl0IYc5e0sq_o_SD3Li1smQGLKmS2nSlqTgLzVUdVZt_/exec";
    
    try {
        const res = await fetch(url, {
            method: "POST",
            body: params,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch(err) {
        console.error("Error:", err);
    }
}
run();
