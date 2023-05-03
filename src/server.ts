import express from 'express';
import payload from 'payload';

require('dotenv').config();
const app = express();

// tests
(async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })
  
  // reset database
  await payload.delete({
    collection: 'directors',
    where: {},
  });
  await payload.delete({
    collection: 'movies',
    where: {},
  });
  await payload.delete({
    collection: 'screenings',
    where: {},
  });

  // 1. create a director
  const director = await payload.create({
    collection: 'directors',
    data: {
      name: 'Quentin Tarantino',
    },
  });
  console.log('created director', director);

  // 2. create a movie
  const movie = await payload.create({
    collection: 'movies',
    depth: 2,
    data: {
      name: 'Pulp Fiction',
      directors: [
        director.id,
      ],
    },
  });
  console.log('created movie', movie);

  // 3. create a screening
  const screening = await payload.create({
    collection: 'screenings',
    depth: 3,
    data: {
      movie: movie.id,
      name: 'Pulp Fiction Screening',
    },
  });
  console.log('created screening', screening);
  
  // test queries
  const test1 = await payload.find({
    collection: 'screenings',
    where: {
      name: {
        equals: 'Pulp Fiction Screening',
      },
    },
  });
  console.log('find screening by name', test1);

  const test2 = await payload.find({
    collection: 'screenings',
    depth: 3,
    where: {
      'movie.name': {
        equals: 'Pulp Fiction',
      },
    },
  });
  console.log('find screening by movie name', test2);

  const test3 = await payload.find({
    collection: 'movies',
    depth: 3,
    where: {
      'directors.name': {
        equals: director.name,
      },
    },
  });
  console.log('find movie by director name', test3);

  const test4 = await payload.find({
    collection: 'screenings',
    depth: 3,
    where: {
      'movie.directors.name': {
        equals: director.name,
      },
    },
  });
  console.log('find screening by director name', test4);

})();