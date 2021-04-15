interface CreateMessageDto {
  to: string;
  from?: string;
  isAnonymous: boolean;
  content: string;
}

export default CreateMessageDto;
