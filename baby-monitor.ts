const openMediaDevices = async (constraints: MediaStreamConstraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
}

async function playVideoFromCamera() {
    try {
        const constraints = {'video': true, 'audio': false};
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.querySelector('video#localVideo') as HTMLVideoElement;
        videoElement.srcObject = stream;
        makeCall(stream);
        
    } catch(error) {
        console.error('Error opening video camera.', error);
    }
}


const send = (message: string) => new Promise((resolve) => {
    resolve(message)
})

type newMessageCallback = (message: any)=>void;
class Channel {
    private listeners: newMessageCallback[] = [];

    public listen(onNewMessage: newMessageCallback) {
        this.listeners.push(onNewMessage);
    }

    public send(message: any) {
        console.log('SENDING---', message, JSON.stringify(message).length);
        console.log(this.listeners);
        this.listeners.forEach(listener => listener(message));
    }
}

const c = new Channel();

async function makeCall(stream: MediaStream) {
    const configuration: RTCConfiguration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    const peerConnection = new RTCPeerConnection(configuration);
    stream.getTracks().forEach(t => peerConnection.addTrack(t));

    c.listen(async message => {
        if (message.answer) {
            const remotetDesc = new RTCSessionDescription(message.answer);
            await peerConnection.setRemoteDescription(remotetDesc);
        }
    });
    
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    c.send({'offer': offer});
    // Listen for local ICE candidates on the local RTCPeerConnection
    peerConnection.addEventListener('icecandidate', event => {
        if (event.candidate) {
            c.send({'iceCandidate': event.candidate});
        }
    });
    
}


async function listenToCall() {
    const configuration: RTCConfiguration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    const peerConnection = new RTCPeerConnection(configuration);
    
    const remoteStream = new MediaStream();
    const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
    remoteVideo.srcObject = remoteStream;
    
    peerConnection.addEventListener('track', async (event) => {
        console.log('track added');
        remoteStream.addTrack(event.track);
    });
    
    
    c.listen(async message => {
        if (message.offer) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            c.send({'answer': answer});
        }
    });
    
    // Listen for remote ICE candidates and add them to the local RTCPeerConnection
    c.listen(async message => {
        if (message.iceCandidate) {
            try {
                await peerConnection.addIceCandidate(message.iceCandidate);
                console.log('ice added');
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    });

    // Listen for connectionstatechange on the local RTCPeerConnection
    peerConnection.addEventListener('connectionstatechange', event => {
        if (peerConnection.connectionState === 'connected') {
            console.log('connected')
        }
    });

    
}


listenToCall();
playVideoFromCamera();