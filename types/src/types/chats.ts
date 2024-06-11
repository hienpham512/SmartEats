interface IChat {
  id: string;
  members: string[];
  messages: IMessage[];
  name?: string;
  photo?: string;
  updatedAt: string | Date;
  createdAt: string | Date;
  admins: string[];
}

interface IMessage {
  createdAt: string | Date;
  id: string;
  isRead: boolean;
  senderId: string;
  text: string;
  updatedAt: string | Date;
  isChatInfo?: boolean;
}

export type { IChat, IMessage };
