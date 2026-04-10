import bcryptjs from "bcryptjs";
export default async function checkPassword(accountPassword, accountPasswordHash) {
    return await bcryptjs.compare(
    accountPassword,
    accountPasswordHash
);
}