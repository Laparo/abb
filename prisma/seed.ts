import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo courses
  const courseYoga = await prisma.course.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Einführung in Yoga',
      description: 'Sanfter Einstieg mit Atem und Asanas.',
      capacity: 12,
      priceCents: 2500,
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // in 14 Tagen
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60 * 2), // +2h
      materials: {
        create: [
          { type: 'TEXT', title: 'Willkommensleitfaden', url: '/content/yoga/welcome.pdf' },
          { type: 'VIDEO', title: 'Atemgrundlagen', url: '/stream/yoga/breathing-101' },
        ],
      },
    },
  })

  const coursePilates = await prisma.course.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Pilates Basics',
      description: 'Kernstärkung und Haltung.',
      capacity: 10,
      priceCents: 3000,
      startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21 + 1000 * 60 * 60 * 2),
      materials: {
        create: [{ type: 'TEXT', title: 'Checkliste', url: '/content/pilates/checklist.pdf' }],
      },
    },
  })

  // Seed a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { email: 'demo@example.com', name: 'Demo User' },
  })

  // Create a booking for the first course
  await prisma.booking.upsert({
    where: { id: 1 },
    update: {},
    create: { userId: user.id, courseId: courseYoga.id, status: 'BOOKED' },
  })

  console.log('Seed complete:', {
    courseYoga: courseYoga.id,
    coursePilates: coursePilates.id,
    user: user.id,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
