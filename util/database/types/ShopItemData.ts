export default interface ShopItemData {
    itemID?: string,
    name: string,
    description: string,
    price: string,
    givenRoleID: string | null,
    removedRoleID: string | null,
    userID: string,
    guildId: string
}