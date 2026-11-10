import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
};

export const passwordMatches = async (password, passwordHash) => {
    const isMatch = await bcrypt.compare(password, passwordHash);
    return isMatch;
};