import { WebRtcPeer } from 'kurento-utils';

export type participant = {
  video: HTMLVideoElement;
  userId: string;
  rtcPeer: WebRtcPeer | null;
}
