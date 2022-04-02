export default interface ReminderData {
    id?: string,
    userID: string,
    createdAt: number,
    expireAt: number,
    content: string
}