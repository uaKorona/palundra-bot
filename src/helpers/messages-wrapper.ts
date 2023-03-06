export const DIVIDER = '\n';

export function messagesWrapper(message: string[]): string {
   return message.join(DIVIDER);
}