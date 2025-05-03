import { Client } from '@stomp/stompjs';
import * as kurentoUtils from 'kurento-utils';
import { participant } from '../types/participant.ts';
import { isSafari } from '@/shared/const/isSafari.ts';

enum commandTypes {
  JOIN_CALL = 'JOIN_CALL',
  EXISTING_PARTICIPANT = 'EXISTING_PARTICIPANT',
  NEW_PARTICIPANT = 'NEW_PARTICIPANT',
  PARTICIPANT_LEFT = 'PARTICIPANT_LEFT',
  RECEIVE_CALL_ANSWER = 'RECEIVE_CALL_ANSWER',
  ICE_CANDIDATE = 'ICE_CANDIDATE',
  ON_ICE_CANDIDATE = 'ON_ICE_CANDIDATE',
  RECEIVE_CALL = 'RECEIVE_CALL',
  END_CALL = 'END_CALL'
}

export enum participantsUpdateActions {
  ADD = 'add',
  REMOVE = 'remove'
}

class WebRtcService {
  private stompClient: Client | null = null;
  private participants: Record<string, participant> = {};
  private currentUserId: string | null = null;
  private roomId: string | null = null;
  private onParticipantsUpdate: ((participant: participant, action: participantsUpdateActions) => void) | null = null;
  private onCloseConnection: (() => void) | null = null;

  constructor() {
    this.participants = {};
  }

  public initialize(
    token: string,
    userId: string,
    onParticipantsUpdate: (participant: participant, action: participantsUpdateActions) => void,
    onCloseConnection: () => void,
  ) {
    this.currentUserId = userId;
    this.onParticipantsUpdate = onParticipantsUpdate;
    this.onCloseConnection = onCloseConnection;

    this.stompClient = new Client({
      brokerURL: 'wss://api.moootvey.ru/api/call',
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        this.stompClient?.subscribe('/user/exchange/amq.direct/reply', (message) => {
          const response = JSON.parse(message.body);
          this.handleServerMessage(response);
        });
      },
      onStompError: (frame) => console.error('STOMP Error:', frame.headers['message'], frame.body),
    });

    this.stompClient.activate();
  }

  public updateVideoTrack(enabled: boolean) {
    const currentUserId = this.currentUserId!;
    const currentParticipant = this.participants[currentUserId];

    if (!currentParticipant || !currentParticipant.rtcPeer) return;

    const videoTrack = currentParticipant.rtcPeer.getLocalStream().getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = enabled;
      const senders = currentParticipant.rtcPeer.peerConnection.getSenders();
      const videoSender = senders.find(sender => sender.track?.kind === 'video');
      if (videoSender) {
        videoSender.replaceTrack(videoTrack);
      }
    }
  }

  public updateAudioTrack(enabled: boolean) {
    const currentUserId = this.currentUserId!;
    const currentParticipant = this.participants[currentUserId];

    if (!currentParticipant || !currentParticipant.rtcPeer) return;

    const audioTrack = currentParticipant.rtcPeer.getLocalStream().getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = enabled;
      const senders = currentParticipant.rtcPeer.peerConnection.getSenders();
      const audioSender = senders.find(sender => sender.track?.kind === 'audio');
      if (audioSender) {
        audioSender.replaceTrack(audioTrack);
      }
    }
  }

  public connect(roomId: string) {
    this.roomId = roomId;
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
      case commandTypes.END_CALL:
        this.clearStatesAndDeactivateClient();
        this.onCloseConnection();
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
          maxWidth: 1024,
          maxFrameRate: 60,
          minFrameRate: 15
        },
      }
    };

    const currentUserParticipant = {
      userId: this.currentUserId!,
      video: document.createElement('video'),
      rtcPeer: null
    };

    this.participants[this.currentUserId!] = currentUserParticipant;
    const currentUserVideo = currentUserParticipant.video;
    currentUserVideo.id = 'video-' + this.currentUserId;
    currentUserVideo.playsInline = true;
    currentUserVideo.autoplay = true;
    currentUserVideo.muted = false;
    currentUserVideo.controls = false;

    this.onParticipantsUpdate(currentUserParticipant, participantsUpdateActions.ADD);

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
        if (err) return console.error('sdp offer error');
        const modifiedSdp = this.preferH264(offerSdp);
        this.sendStompMessage(commandTypes.RECEIVE_CALL, { senderId: this.currentUserId, sdpOffer: modifiedSdp });
        this.updateVideoTrack(false);
      });
    });

    payload.data.forEach((user) => this.receiveVideo(user));
  };

  private receiveVideo = (sender: any) => {
    if (!this.participants[sender]) {
      const participant = {
        userId: sender,
        video: document.createElement('video'),
        rtcPeer: null
      };

      this.participants[sender] = participant;
      const video = participant.video;
      video.id = 'video-' + sender;
      video.playsInline = true;
      video.autoplay = true;
      video.muted = false;
      video.controls = false;

      this.onParticipantsUpdate(participant, participantsUpdateActions.ADD);

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
          if (err) return console.error('sdp offer error');
          const modifiedSdp = this.preferH264(offerSdp);
          this.sendStompMessage(commandTypes.RECEIVE_CALL, { senderId: sender, sdpOffer: modifiedSdp });
        });
      });
    }
  };

  private receiveVideoResponse = (payload: any) => {
    if (this.participants[payload.userId] && this.participants[payload.userId].rtcPeer) {
      const modifiedSdp = this.preferH264(payload.sdpAnswer);
      this.participants[payload.userId].rtcPeer.processAnswer(modifiedSdp, (error) => {
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
    const participant = this.participants[request.userId];
    if (participant) {
      this.onParticipantsUpdate(participant, participantsUpdateActions.REMOVE);

      if (participant.rtcPeer) {
        participant.rtcPeer.dispose();
      }

      delete this.participants[request.userId];
    }
  };

  public leaveRoom = () => {
    if (this.stompClient && this.stompClient.connected) {
      this.sendStompMessage(commandTypes.END_CALL, { roomId: this.roomId });
    }

    this.clearStatesAndDeactivateClient();
  };

  private clearStatesAndDeactivateClient = () => {
    for (const key in this.participants) {
      if (this.participants[key].rtcPeer) {
        this.participants[key].rtcPeer.dispose();
      }
    }
    this.participants = {};
  };

  private preferH264(sdp: string): string {
    let lines = sdp.split('\n');
    let h264Index = -1;
    let vp8Index = -1;
    let vp9Index = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('a=rtpmap:')) {
        const parts = lines[i].split(' ');
        if (parts[1].includes('H264')) {
          h264Index = parseInt(parts[0].split(':')[1]);
        } else if (parts[1].includes('VP8')) {
          vp8Index = parseInt(parts[0].split(':')[1]);
        } else if (parts[1].includes('VP9')) {
          vp9Index = parseInt(parts[0].split(':')[1]);
        }
      }
    }

    if (h264Index !== -1) {
      lines = lines.filter(line => !line.startsWith(`a=rtpmap:${vp8Index}`) && !line.startsWith(`a=rtpmap:${vp9Index}`));
      lines = lines.filter(line => !line.startsWith(`a=rtcp-fb:${vp8Index}`) && !line.startsWith(`a=rtcp-fb:${vp9Index}`));
      lines = lines.filter(line => !line.startsWith(`a=fmtp:${vp8Index}`) && !line.startsWith(`a=fmtp:${vp9Index}`));
    }

    return lines.join('\n');
  }
}

export default new WebRtcService();
