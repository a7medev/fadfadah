interface CreateMessagePayloadBase {
  to: string;
  from?: string;
  isAnonymous: boolean;
}

export interface CreateTextMessagePayload extends CreateMessagePayloadBase {
  content: string;
}

export interface CreateRecordingMessagePayload
  extends CreateMessagePayloadBase {
  recording: string;
}

type CreateMessagePayload =
  | CreateTextMessagePayload
  | CreateRecordingMessagePayload;

export default CreateMessagePayload;
