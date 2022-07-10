import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { prisma } from '../../../database/prismaClient'

interface IAuthenticateDeliveryman {
  username: string
  password: string
}

class AuthenticateDeliverymanUseCase {
  async execute({ username, password }: IAuthenticateDeliveryman) {
    const deliveryman = await prisma.deliveryman.findFirst({
      where: {
        username,
      },
    })
    if (!deliveryman) throw new Error('Username or password invalid! ')

    const pwMatch = await compare(password, deliveryman.password)
    if (!pwMatch) throw new Error('Username or password invalid! ')

    const token = sign({ username }, 'chavesecreta', {
      subject: deliveryman.id,
      expiresIn: '1d',
    })

    return token
  }
}
export default new AuthenticateDeliverymanUseCase()
