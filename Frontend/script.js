document.addEventListener("DOMContentLoaded", () => {

    const startBtn = document.getElementById("start-recording");
    const stopBtn = document.getElementById("stop-recording");
    const generateBtn = document.getElementById("generate-email");
    const sendBtn = document.getElementById("send-email");

    const transcriptionArea = document.getElementById("transcription");
    const emailContent = document.getElementById("email-content");

    let recognition;

    function initSpeechRecognition() {

        recognition = new (
            window.SpeechRecognition ||
            window.webkitSpeechRecognition
        )();

        recognition.continuous = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {

            let transcript = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {
                transcript += event.results[i][0].transcript;
            }

            transcriptionArea.value = transcript;
        };
    }

    startBtn.addEventListener("click", () => {

        initSpeechRecognition();

        recognition.start();

        startBtn.disabled = true;
        stopBtn.disabled = false;
    });

    stopBtn.addEventListener("click", () => {

        recognition.stop();

        startBtn.disabled = false;
        stopBtn.disabled = true;
    });

    generateBtn.addEventListener("click", async () => {

    const transcript = transcriptionArea.value.trim();

    if (!transcript) {
        alert("Please record something first.");
        return;
    }

    const token = prompt("Paste your JWT token here:");

    try {

        const response = await fetch(
            "http://localhost:5000/api/emails/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt: transcript
                })
            }
        );

        const data = await response.json();
        console.log(data);

        if (data.email) {
            emailContent.value = data.email;
        }

    } catch (error) {
        console.error(error);
    }

});
    sendBtn.addEventListener("click", async () => {

        const token = prompt(
            "Paste your JWT token here:"
        );

        const to =
            document.getElementById(
                "recipient-email"
            ).value;

        const body = emailContent.value;

        try {

            const response = await fetch(
                "http://localhost:5000/api/emails/send",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        to,
                        subject: "AI Generated Email",
                        body
                    })
                }
            );

            const data = await response.json();

            alert(data.message);

        } catch (error) {

            console.error(error);

            alert("Failed to send email.");
        }

    });

});