import { Client } from '@stomp/stompjs';
import * as kurentoUtils from 'kurento-utils';

enum commandTypes {
  JOIN_CALL = 'JOIN_CALL',
  EXISTING_PARTICIPANT = 'EXISTING_PARTICIPANT',
  NEW_PARTICIPANT = 'NEW_PARTICIPANT',
  PARTICIPANT_LEFT = 'PARTICIPANT_LEFT',
  RECEIVE_CALL_ANSWER = 'RECEIVE_CALL_ANSWER',
  ICE_CANDIDATE = 'ICE_CANDIDATE',
  ON_ICE_CANDIDATE = 'ON_ICE_CANDIDATE',
  RECEIVE_CALL = 'RECEIVE_CALL',
  LEAVE_CALL = 'LEAVE_CALL'
}

class WebRtcService {
  private stompClient: Client | null = null;
  private participants: Record<string, any> = {};
  private currentUserId: string | null = null;
  private roomId: string | null = null;
  private onParticipantsUpdate: ((participant: HTMLDivElement) => void) | null = null;

  constructor() {
    this.participants = {};
  }

  public initialize(
    token: string,
    userId: string,
    roomId: string,
    onParticipantsUpdate: (participant: HTMLDivElement) => void
  ) {
    this.currentUserId = userId;
    this.roomId = roomId;
    this.onParticipantsUpdate = onParticipantsUpdate;

    this.stompClient = new Client({
      brokerURL: 'wss://api.moootvey.ru/api/call',
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => this.handleConnect(),
      onStompError: (frame) => console.error('STOMP Error:', frame.headers['message'], frame.body),
    });

    this.stompClient.activate();
  }

  private handleConnect() {
    this.stompClient?.subscribe('/user/exchange/amq.direct/reply', (message) => {
      const response = JSON.parse(message.body);
      this.handleServerMessage(response);
    });

    this.sendStompMessage(commandTypes.JOIN_CALL, { roomId: this.roomId });
  }

  private handleServerMessage(message: any) {
    const parsedMessage = JSON.parse(message.jsonPayload);

    switch (message.commandType) {
      case commandTypes.EXISTING_PARTICIPANT:
        this.onExistingParticipants(parsedMessage);
        break;
      case commandTypes.NEW_PARTICIPANT:
        this.onNewParticipant(parsedMessage);
        break;
      case commandTypes.PARTICIPANT_LEFT:
        this.onParticipantLeft(parsedMessage);
        break;
      case commandTypes.RECEIVE_CALL_ANSWER:
        this.receiveVideoResponse(parsedMessage);
        break;
      case commandTypes.ICE_CANDIDATE:
        this.participants[parsedMessage.userId].rtcPeer.addIceCandidate(
          parsedMessage.candidate,
          (error: any) => {
            if (error) {
              console.error('Error adding candidate: ' + error);
              return;
            }
          }
        );
        break;
      default:
        console.error('Unrecognized message type:', message.commandType);
    }
  }

  private sendStompMessage = (commandType: commandTypes, payload: any) => {
    const message = {
      commandType: commandType,
      jsonPayload: JSON.stringify(payload),
    };
    this.stompClient!.publish({ destination: '/app/call', body: JSON.stringify(message) });
  };

  private onExistingParticipants = (payload: any) => {
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          maxWidth: 320,
          maxFrameRate: 15,
          minFrameRate: 15,
        },
      },
    };

    const currentUserParticipant = {
      userId: this.currentUserId,
      videoRef: document.createElement('video'),
      rtcPeer: null
    };

    this.participants[this.currentUserId!] = currentUserParticipant;
    const currentUserVideo = currentUserParticipant.videoRef;
    currentUserVideo.id = 'video-' + this.currentUserId;
    currentUserVideo.autoplay = true;
    currentUserVideo.controls = false;

    const container = document.createElement('div');
    container.id = this.currentUserId;
    container.appendChild(currentUserVideo);
    container.appendChild(document.createTextNode(this.currentUserId));

    this.onParticipantsUpdate(container);

    const options = {
      localVideo: currentUserVideo,
      mediaConstraints: constraints,
      onicecandidate: (candidate: any) => {
        this.sendStompMessage(commandTypes.ON_ICE_CANDIDATE, { candidate });
      },
    };

    currentUserParticipant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, (error) => {
      if (error) {
        return console.error(error);
      }
      currentUserParticipant.rtcPeer.generateOffer((err, offerSdp) => {
        if (err) return console.error("sdp offer error");
        this.sendStompMessage(commandTypes.RECEIVE_CALL, { senderId: this.currentUserId, sdpOffer: offerSdp });
      });
    });

    payload.data.forEach((user) => this.receiveVideo(user));
  };

  private receiveVideo = (sender: any) => {
    if (!this.participants[sender]) {
      const participant = {
        userId: sender,
        videoRef: document.createElement('video'),
        rtcPeer: null
      };

      this.participants[sender] = participant;
      const video = participant.videoRef;
      video.id = 'video-' + sender;
      video.autoplay = true;
      video.controls = false;

      const container = document.createElement('div');
      container.id = sender;
      container.appendChild(video);
      container.appendChild(document.createTextNode(sender));

      this.onParticipantsUpdate(container);

      const options = {
        remoteVideo: video,
        onicecandidate: (candidate: any) => {
          this.sendStompMessage(commandTypes.ON_ICE_CANDIDATE, { candidate });
        },
      };

      participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, (error) => {
        if (error) {
          return console.error(error);
        }
        participant.rtcPeer.generateOffer((err, offerSdp) => {
          if (err) return console.error("sdp offer error");
          this.sendStompMessage(commandTypes.RECEIVE_CALL, { senderId: sender, sdpOffer: offerSdp });
        });
      });
    }
  };

  private receiveVideoResponse = (payload: any) => {
    if (this.participants[payload.userId] && this.participants[payload.userId].rtcPeer) {
      this.participants[payload.userId].rtcPeer.processAnswer(payload.sdpAnswer, (error) => {
        if (error) return console.error(error);
      });
    } else {
      console.error('Participant or rtcPeer not found for userId:', payload.userId);
    }
  };

  private onNewParticipant = (request: any) => {
    this.receiveVideo(request.userId);
  };

  private onParticipantLeft = (request: any) => {
    console.log('Participant ' + request.userId + ' left');
    const { [request.userId]: _, ...rest } = this.participants;
    this.participants = rest;
  };

  public leaveRoom = () => {
    if (this.stompClient && this.stompClient.connected) {
      this.sendStompMessage(commandTypes.LEAVE_CALL, { userId: this.currentUserId });
    }

    for (const key in this.participants) {
      if (this.participants[key].rtcPeer) {
        this.participants[key].rtcPeer.dispose();
      }
    }
    this.participants = {};
    this.stompClient?.deactivate();
  };
}

export default new WebRtcService();
