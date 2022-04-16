class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            // voiceButton: document.querySelector('.fa-microphone')

            // voiceSearch: document.querySelector(".chatbox__footer"),
            // voiceSearchInput: voiceSearch.querySelector("input"),

            // micBtn: voiceSearch.querySelector(".chatbox_voice"),
            // micIcon: micBtn.querySelector("i")

            micBtn: document.querySelector(".chatbox_voice")

        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton, micBtn } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        micBtn.addEventListener('click', () => this.onmicBtn(chatBox))


        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if (this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                let msg2 = { name: "Sam", message: r.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox)
                textField.value = ''

            }).catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox)
                textField.value = ''
            });
    }


    // Voice Assistant

    onmicBtn(chatbox) {

        const voiceSearch = document.querySelector(".chatbox__footer");
        const voiceSearchInput = voiceSearch.querySelector("input");


        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            console.log("Your browser supports speech recognition")

            const micBtn = document.querySelector(".chatbox_voice");
            const micIcon = micBtn.querySelector("i");

            const recognition = new SpeechRecognition();

            // micBtn.addEventListener("click", micBtnClick)

            // function micBtnClick() {
                if (micIcon.classList.contains("fa-microphone")) { //Start Recongnition

                    recognition.start();
                }
                else { //Stop Recognition
                    micIcon.classList.remove("fa-microphone-slash");
                    micIcon.classList.add("fa-microphone");
                    recognition.stop();
                }
            // }


            recognition.addEventListener("start", startSpeechRecognition);
            function startSpeechRecognition() {
                micIcon.classList.remove("fa-microphone");
                micIcon.classList.add("fa-microphone-slash");
                voiceSearchInput.focus();
                console.log("Speech Recognition active");
            }

            recognition.addEventListener("end", endSpeechRecognition);
            function endSpeechRecognition() {
                micIcon.classList.remove("fa-microphone-slash");
                micIcon.classList.add("fa-microphone");
                voiceSearchInput.focus();
                console.log("Speech Recognition not active");
            }

            recognition.addEventListener("result", resultSpeechRecognition);
            function resultSpeechRecognition(event) {
                const currentResultIndex = event.resultIndex;
                const transcript = event.results[currentResultIndex][0].transcript;
                voiceSearchInput.value = transcript;

                if (transcript.toLowerCase().trim() === "stop recording") {
                    recognition.stop();
                }
                else if (!voiceSearchInput.value) {
                    voiceSearchInput.value = transcript;
                }
                else if (transcript.toLowerCase().trim() === "reset input") {
                    voiceSearchInput.value = "";
                }
                else {
                    voiceSearchInput.value = transcript;
                }
            }


        }
        else {
            console.log("Your browser supports speech recognition")
        }

        let text1 = voiceSearchInput.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                let msg2 = { name: "Sam", message: r.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox)
                textField.value = ''

            }).catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox)
                textField.value = ''
            });

    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function (item, index) {
            if (item.name === "Sam") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}


const chatbox = new Chatbox();
chatbox.display();
