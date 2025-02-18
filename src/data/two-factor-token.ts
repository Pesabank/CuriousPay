import { db } from "@/lib/db"

export const getTwoFactorTokenByToken = async (
  token: string
) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token }
    })

    return twoFactorToken
  } catch {
    return null
  }
}

export const getTwoFactorTokenByEmail = async (
  email: string
) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email }
    })

    return twoFactorToken
  } catch {
    return null
  }
}

export const getTwoFactorConfirmationByUserId = async (
  userId: string
) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId }
    })

    return twoFactorConfirmation
  } catch {
    return null
  }
}
